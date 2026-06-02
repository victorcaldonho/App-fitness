import { createClient } from '@supabase/supabase-js';
import { safeStorage } from './safeStorage';

// Supabase Connection Credentials provided explicitly by user
let supabaseUrl = 'https://dykhamodnttcsoczuwxc.supabase.co';
let supabaseKey = 'sb_publishable_w2SCEzvEqORzSoJY_y-4tg_7PVYKyDJ';

// Dynamically check with optional fallbacks
if (typeof window !== 'undefined') {
  const metaEnv = (import.meta as any).env;
  if (metaEnv?.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseUrl = metaEnv.NEXT_PUBLIC_SUPABASE_URL;
  }
  if (metaEnv?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    supabaseKey = metaEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  }
} else {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generate a friendly 8-char capital alphanumeric code (e.g. VITA-A2C4E9)
 */
function generateReadableSyncId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid easily confusable O, 1, I, 0
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `VITA-${code}`;
}

/**
 * Reads the existing user synchronization ID or generates a portable one.
 */
export function getOrCreateUserId(): string {
  let userId = safeStorage.getItem('vita_supabase_sync_id');
  if (!userId) {
    // Generate portable elegant ID
    userId = generateReadableSyncId();
    safeStorage.setItem('vita_supabase_sync_id', userId);
  }
  return userId;
}

/**
 * Synchronize user global objective/workout preferences.
 */
export async function syncProfile(
  userId: string,
  objective: string | null,
  workoutType: string | null
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        objective: objective || '',
        workout_type: workoutType || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('[Supabase syncProfile] Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('[Supabase syncProfile] Critical err:', err);
    return { success: false, error: err };
  }
}

/**
 * Synchronize user dashboard numerical metrics.
 */
export async function syncDashboardStats(
  userId: string,
  stats: {
    waterLogged: number;
    waterGoal: number;
    workoutsCompleted: number;
    workoutsGoal: number;
    caloriesLogged: number;
    caloriesGoal: number;
    protein: number;
    proteinGoal: number;
    carbs: number;
    carbsGoal: number;
    fats: number;
    fatsGoal: number;
  }
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from('dashboard_stats')
      .upsert({
        user_id: userId,
        water_logged: stats.waterLogged,
        water_goal: stats.waterGoal,
        workouts_completed: stats.workoutsCompleted,
        workouts_goal: stats.workoutsGoal,
        calories_logged: stats.caloriesLogged,
        calories_goal: stats.caloriesGoal,
        protein: stats.protein,
        protein_goal: stats.proteinGoal,
        carbs: stats.carbs,
        carbs_goal: stats.carbsGoal,
        fats: stats.fats,
        fats_goal: stats.fatsGoal,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('[Supabase syncDashboardStats] Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('[Supabase syncDashboardStats] Critical err:', err);
    return { success: false, error: err };
  }
}

/**
 * Synchronize whole weight logs array. Bulk overwrite matches client offline-first cache perfectly.
 */
export async function syncWeights(
  userId: string,
  weights: { date: string; value: number }[]
): Promise<{ success: boolean; error?: any }> {
  try {
    // Delete existing to rewrite current snapshot cleanly
    await supabase.from('weight_history').delete().eq('user_id', userId);

    if (weights.length === 0) return { success: true };

    const payload = weights.map((w, idx) => ({
      user_id: userId,
      date_label: w.date,
      weight_value: w.value,
      sort_order: idx
    }));

    const { error } = await supabase.from('weight_history').insert(payload);
    if (error) {
      console.error('[Supabase syncWeights] Error inserting details:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('[Supabase syncWeights] Critical err:', err);
    return { success: false, error: err };
  }
}

/**
 * Synchronize activities history list.
 */
export async function syncActivities(
  userId: string,
  activities: { id: string; time: string; text: string; category: string }[]
): Promise<{ success: boolean; error?: any }> {
  try {
    await supabase.from('activities').delete().eq('user_id', userId);

    if (activities.length === 0) return { success: true };

    const payload = activities.slice(0, 45).map((act, idx) => ({
      user_id: userId,
      activity_id: act.id,
      timestamp_label: act.time,
      activity_text: act.text,
      category: act.category,
      sort_order: idx
    }));

    const { error } = await supabase.from('activities').insert(payload);
    if (error) {
      console.error('[Supabase syncActivities] Error inserting list:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('[Supabase syncActivities] Critical err:', err);
    return { success: false, error: err };
  }
}

/**
 * Fetch and consolidate entire cloud data snapshot under target sync ID.
 */
export async function fetchAllUserData(userId: string): Promise<{
  success: boolean;
  profile?: any;
  dashboard?: any;
  weights?: any[];
  activities?: any[];
  error?: any;
}> {
  try {
    const [profileRes, statsRes, weightsRes, activitiesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('dashboard_stats').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('weight_history').select('*').eq('user_id', userId).order('sort_order', { ascending: true }),
      supabase.from('activities').select('*').eq('user_id', userId).order('sort_order', { ascending: true })
    ]);

    if (profileRes.error || statsRes.error || weightsRes.error || activitiesRes.error) {
      const err = profileRes.error || statsRes.error || weightsRes.error || activitiesRes.error;
      console.error('[Supabase fetchAllUserData] Read failure:', err);
      return { success: false, error: err };
    }

    return {
      success: true,
      profile: profileRes.data || null,
      dashboard: statsRes.data || null,
      weights: weightsRes.data ? weightsRes.data.map((w: any) => ({ date: w.date_label, value: w.weight_value })) : [],
      activities: activitiesRes.data ? activitiesRes.data.map((a: any) => ({
        id: a.activity_id,
        time: a.timestamp_label,
        text: a.activity_text,
        category: a.category
      })) : []
    };
  } catch (err) {
    console.error('[Supabase fetchAllUserData] Critical failure:', err);
    return { success: false, error: err };
  }
}
