import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  // ambient declarations to guarantee type safety in custom compiler settings
  props!: Props;
  setState!: (state: Partial<State> | ((state: State) => Partial<State>)) => void;
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-2xl w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient Red Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <span className="text-xl font-bold text-red-400">⚠️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">Oops! Algo deu errado</h1>
                <p className="text-xs text-slate-400 font-mono">Erro de Renderização capturado</p>
              </div>
            </div>

            <p className="text-sm text-slate-350 mb-4 leading-relaxed">
              O aplicativo encontrou um erro inesperado ao renderizar os componentes. Isso pode ocorrer devido a incompatibilidades de armazenamento ou falta de tabelas no banco de dados.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-red-300 overflow-x-auto mb-6 max-h-60 whitespace-pre-wrap">
              <strong>{this.state.error && this.state.error.toString()}</strong>
              {this.state.errorInfo && (
                <div className="mt-2 text-slate-400 text-[11px]">
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  } catch (e) {
                    window.location.reload();
                  }
                }}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-lg transition-all shadow-lg shadow-red-950/40 cursor-pointer"
              >
                Limpar Cache e Reiniciar
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-lg transition-all border border-slate-700 cursor-pointer"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
