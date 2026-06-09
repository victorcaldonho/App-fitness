export interface Recipe {
  title: string;
  ingredients: string[];
  preparation: string;
  tip: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ExerciseDemo {
  title: string;
  target: string;
  execution: string[];
  proTip: string;
  breathing: string;
}

export const RECIPE_DATABASE: { [key: string]: Recipe } = {
  // PERDER PESO PROTOCOLO
  'Omelete de 2 ovos com espinafre': {
    title: 'Omelete de Ovos com Espinafre',
    ingredients: [
      '2 Ovos inteiros orgânicos',
      '1 xícara de folhas de espinafre frescas',
      '1 dente de alho picado',
      'Uma pitada pequena de sal marinho e pimenta-do-reino',
      'Fio de azeite de oliva extra virgem para untar'
    ],
    preparation: 'Bata levemente os ovos com sal e pimenta em uma tigela. Em uma frigideira antiaderente pré-aquecida em fogo médio, coloque um fio de azeite e refogue as folhas de espinafre com o alho por 1 minuto até murcharem. Despeje os ovos batidos sobre as folhas de espinafre, tampe a frigideira e cozinhe em fogo baixo por 3-4 minutos até as bordas firmarem. Vire o omelete delicadamente e deixe dourar o outro lado por mais 1 minuto. Sirva quente.',
    tip: 'Adicione gergelim torrado ao finalizar para obter micronutrientes neuroprotetores extras.',
    calories: 150, protein: 13, carbs: 2, fats: 10
  },
  '1 xícara de café preto (sem açúcar)': {
    title: 'Café Preto Premium (Concentração e Termogênese)',
    ingredients: [
      '150ml de água filtrada aquecida (90 a 94°C)',
      '15g de café em pó moído de boa qualidade'
    ],
    preparation: 'Passe o café utilizando um filtro de papel ou prensa francesa. Não use açúcar ou adoçante para maximizar a secreção de catecolaminas indutoras de lipólise e ativação do sistema nervoso central.',
    tip: 'Insira um pedaço minúsculo de canela em pau para acelerar o metabolismo sem quebrar o jejum.',
    calories: 5, protein: 0, carbs: 0, fats: 0
  },
  '50g de mamão com sementes de chia': {
    title: 'Mamão Papaia Digestivo com Chia',
    ingredients: [
      '50g de mamão papaia maduro picado',
      '1 colher de chá (5g) de sementes de chia hidratadas'
    ],
    preparation: 'Corte o mamão fresco em cubos pequenos e distribua igualmente em um bowl. Polvilhe as sementes de chia sobre a fruta e deixe repousar por 2 minutos para que as fibras solúveis da chia absorvam o sumo da fruta.',
    tip: 'A papaína presente no mamão combinada com a chia melhora drasticamente o trânsito e a absorção de proteínas da refeição seguinte.',
    calories: 45, protein: 1, carbs: 10, fats: 1
  },
  '150g de Filé de frango grelhado': {
    title: 'Filé de Frango Grelhado Suculento',
    ingredients: [
      '150g de peito de frango limpo sem osso',
      'Suco de 1/2 limão siciliano',
      '1 colher de café de páprica defumada',
      'Ervas finas secas, sal e alho amassado'
    ],
    preparation: 'Marine o filé de frango com limão, páprica, alho e ervas finas por 10 minutos. Aqueça uma frigideira grelhadora antiaderente. Grelhe o frango por 4 minutos de um lado antes de virar, pressionando levemente. Vire e deixe por mais 3-4 minutos para reter o suco da carne, mantendo-o suculento e macio.',
    tip: 'Não corte o frango imediatamente após grelhar; espere 1 minuto para que as fibras relaxem e o caldo nutritivo se espalhe uniformemente.',
    calories: 240, protein: 45, carbs: 0, fats: 5
  },
  '3 colheres de arroz integral': {
    title: 'Arroz Integral Perfeito',
    ingredients: [
      '3 colheres de sopa de arroz integral cozido',
      'Água fervente',
      'Cebola roxa picadinha e alho refogado levemente'
    ],
    preparation: 'Cozinhe o arroz integral em fogo baixo por cerca de 25 minutos com tampa semi-aberta para amolecer a casca rígida fibrosa. Deixe secar bem.',
    tip: 'O arroz integral possui carboidratos fibrosos de baixíssimo índice glicêmico que evitam oscilações de insulina e letargia à tarde.',
    calories: 110, protein: 2.5, carbs: 23, fats: 1
  },
  'Salada verde à vontade': {
    title: 'Bowl de Folhas Verdes Desintoxicante',
    ingredients: [
      'Folhas de alface americana, rúcula selvagem e agrião à vontade',
      'Gotas de limão fresco e sal rosa para temperar'
    ],
    preparation: 'Higienize muito bem as folhas sob água corrente. Rasgue-as com as mãos no bowl, misture bem e tempere na hora de consumir.',
    tip: 'Rúcula e agrião contêm compostos sulfurados que otimizam a detoxificação hepática de estrogênios indesejados.',
    calories: 15, protein: 1, carbs: 3, fats: 0
  },
  'Brócolis no vapor': {
    title: 'Brócolis Al Dente Hidratado',
    ingredients: [
      '80g de floretes de brócolis frescos de cor verde intensa',
      'Água para o vapor'
    ],
    preparation: 'Coloque os floretes na vaporeira sobre água fervente. Cozinhe por exatamente 3 a 4 minutos para manter a textura crocante e cor esmeralda, o que preserva os compostos antioxidantes sulforafanos.',
    tip: 'Dê um choque térmico em água gelada logo após o vapor para cessar o cozimento e reter a cor viva.',
    calories: 35, protein: 3, carbs: 6, fats: 0
  },
  '1 Iogurte natural desnatado': {
    title: 'Iogurte Natural Probiótico',
    ingredients: [
      '1 copo (170g) de iogurte natural desnatado sob refrigeração'
    ],
    preparation: 'Sirva bem gelado. Excelente fonte láctea de cálcio e bio-peptídeos de fácil assepsia intestinal.',
    tip: 'Mexa bem com uma colher para aerar o iogurte, tornando a textura cremosa parecida com mousse.',
    calories: 60, protein: 6, carbs: 9, fats: 0
  },
  '3 nozes ou 5 amêndoas': {
    title: 'Mix de Oleaginosas Micronutrientes fitoquímicos',
    ingredients: [
      '3 nozes chilenas inteiras ou 5 amêndoas torradas sem sal'
    ],
    preparation: 'Consuma mastigando devagar para induzir a liberação do hormônio colecistoquinina (sensação sacietógena prolongada).',
    tip: 'Ricas em vitamina E e magnésio, estabilizam as membranas celulares do miocárdio contra inflamações.',
    calories: 90, protein: 2, carbs: 2, fats: 8
  },
  'Posta de peixe branco': {
    title: 'Posta de Peixe Branco ao Forno',
    ingredients: [
      '150g de posta de pescada, tilápia ou linguado',
      'Ervas finas, manjericão, rodelas fininhas de cebola e limão'
    ],
    preparation: 'Disponha a posta em uma assadeira untada. Regue com limão, tempere com sal e ervas. Cubra com rodelas finas de cebola. Asse no forno a 180°C por 15-18 minutos até a carne lascar facilmente.',
    tip: 'O peixe branco tem taxa de digestibilidade de quase 100%, ideal para o jantar pós-reparo e sono leve.',
    calories: 150, protein: 30, carbs: 0, fats: 3
  },
  'Mix de legumes (abobrinha e cenoura)': {
    title: 'Legumes Assados ou Grelhados no vapor',
    ingredients: [
      '50g de abobrinha em rodelas',
      '50g de cenoura baby em bastões'
    ],
    preparation: 'Cozinhe a cenoura e abobrinha no vapor por 4 minutos, ou grelhe em fogo alto em uma frigideira antiaderente seladora.',
    tip: 'Ricos em potássio, ajudam a expulsar o excesso de sódio retido extracelularmente.',
    calories: 50, protein: 1.5, carbs: 10, fats: 0.5
  },
  'Salada de folhas roxas': {
    title: 'Salada Antioxidante Roxa',
    ingredients: [
      'Folhas de repolho roxo fatiado fino e alface roxo',
      'Vinagre de maçã e sal rosa'
    ],
    preparation: 'Misture as folhas roxas e acrescente gotas de vinagre de maçã fermentado naturalmente.',
    tip: 'Antocianinas que dão a coloração roxa combatem os radicais livres induzidos pelo treino intenso.',
    calories: 15, protein: 1, carbs: 3, fats: 0
  },

  // GANHAR MASSA - BULKING
  'Vitamina: 300ml leite, 1 banana, 40g aveia': {
    title: 'Shake de Hipertrofia Clássico',
    ingredients: [
      '300ml de leite desnatado ou integral',
      '1 banana nanica madura de tamanho médio',
      '40g (4 colheres de sopa) de aveia fina em flocos'
    ],
    preparation: 'Adicione todos os ingredientes no liquidificador. Bata em velocidade máxima por exactamente 1 minuto para que os flocos de aveia quebrem totalmente e virem um shake cremoso.',
    tip: 'Beba imediatamente para evitar que as fibras insolúveis da aveia sedimentem no fundo.',
    calories: 350, protein: 15, carbs: 58, fats: 7
  },
  '2 fatias de pão integral com ovos': {
    title: 'Toast de Ovos sobre Pão Integral',
    ingredients: [
      '2 fatias de pão de fôrma integral nutritivo',
      '2 ovos inteiros estalados',
      'Fio de azeite e orégano'
    ],
    preparation: 'Toste as fatias de pão integral na torradeira ou na frigideira. Paralelamente, faça os ovos mexidos ou fritos com gema mole em fogo médio com o azeite. Coloque os ovos carinhosamente sobre as fatias de pão quente e salpique orégano.',
    tip: 'Adicione uma pitada de açafrão-da-terra nos ovos para poderosa ação anti-inflamatória.',
    calories: 280, protein: 18, carbs: 24, fats: 12
  },
  '200g de Carne bovina magra': {
    title: 'Carne Bovina Vermelha Selecionada',
    ingredients: [
      '200g de bife de patinho extra-limpo ou coxão mole',
      'Alho picado, sal grosso moído e alecrim fresco'
    ],
    preparation: 'Aqueça uma chapa de ferro até soltar fumaça. Grelhe a carne por 2-3 minutos de cada lado para selar as albuminas por completo, preservando os micronutrientes como creatina biodisponível.',
    tip: 'Garante o aporte de ferro heme e zinco essenciais para a sinalização androgênica.',
    calories: 380, protein: 50, carbs: 0, fats: 18
  },
  '200g de Arroz branco': {
    title: 'Arroz Branco de Rápido Transporte de Glicogênio',
    ingredients: [
      '200g de arroz branco cozido e soltinho'
    ],
    preparation: 'Cozinhe o arroz de forma simples, reduzindo gorduras no preparo secundário. Ideal para digestão limpa e elevação rápida de glicogênio muscular.',
    tip: 'A perfeita quebra pós-treino ou no almoço para atletas sob alto gasto metabólico diário.',
    calories: 260, protein: 5, carbs: 57, fats: 0.5
  },
  '100g de Feijão': {
    title: 'Caldo de Feijão Carioca Clássico',
    ingredients: [
      '100g de feijão carioca cozido com caldo concentrado',
      'Tempero de alho e folha de louro'
    ],
    preparation: 'Cozinhe o feijão com folha de louro para reduzir flatulências intestinais e sirva sobre o arroz branco.',
    tip: 'Contém aminoácido lisina que se complementa perfeitamente ao arroz em uma cadeia de proteína completa.',
    calories: 95, protein: 6, carbs: 17, fats: 0.5
  },
  'Salada de tomate': {
    title: 'Vinagrete de Tomate com Hortelã',
    ingredients: [
      '1 tomate vermelho maduro fatiado',
      'Hortelã fresco rasgado e fio de azeite'
    ],
    preparation: 'Higienize, retire se preferir as sementes e corte o tomate em cubos ou rodelas. Misture a hortelã e o azeite.',
    tip: 'Tomate cozido ou aquecido libera licopeno de enorme biodisponibilidade para saúde prostática.',
    calories: 25, protein: 1, carbs: 5, fats: 0.2
  },
  'Shake de Whey Protein': {
    title: 'Shake Whey de Rápida Síntese Proteica',
    ingredients: [
      '30g (1 scoop) de Whey Protein Concentrado ou Isolado',
      '200ml de água mineral gelada'
    ],
    preparation: 'No shaker portátil, insira a água gelada primeiro e depois adicione o Whey em pó. Chacoalhe rigorosamente por 20 segundos até solubilizar por completo e dissolver grumos.',
    tip: 'Consumir até 45 minutos após o estimulador de treino de pernas ou tronco para sinalização mTor otimizada.',
    calories: 140, protein: 25, carbs: 3, fats: 2
  },
  '60g de Dextrose ou 1 banana grande': {
    title: 'Carboidratos Simples Reconstrutor Pós-Treino',
    ingredients: [
      '60g de suplemento em pó de Dextrose OR 1 banana nanica grande bem madura'
    ],
    preparation: 'Misture a Dextrose junto ao shake de Whey Protein pós-treino ou desfrute da banana cortada logo após a sessão de força.',
    tip: 'Esse pico glicêmico controlado conduz os aminoácidos do Whey direto para os canais de sódio do músculo exaurido.',
    calories: 240, protein: 1, carbs: 58, fats: 0
  },
  '200g de Macarrão integral': {
    title: 'Pasta Integral de Baixo Índice Glicêmico',
    ingredients: [
      '200g de macarrão penne ou espaguete integral cozido',
      'Água fervente e sal'
    ],
    preparation: 'Cozinhe o macarrão em água abundante fervente por 8-10 minutos até o ponto al dente, escorrendo logo em seguida.',
    tip: 'A liberação estendida de glicose garante depósitos de glicogênio cheios para treinos de altíssima intensidade.',
    calories: 250, protein: 10, carbs: 50, fats: 1.5
  },
  'Molho de tomate caseiro com frango desfiado': {
    title: 'Frango Cremoso com Molho Pomodoro',
    ingredients: [
      '100g de frango cozido desfiado',
      '1/2 xicara de extrato de tomate rústico natural de cor escura',
      'Manjericão e temperos'
    ],
    preparation: 'Refogue o frango desfiado, misture o molho pomodoro rústico, deixe ferver e agregue manjericão. Derrame sobre o macarrão integral cozido.',
    tip: 'Poderoso prato anabólico para reparação proteica de alta escala.',
    calories: 180, protein: 25, carbs: 8, fats: 4
  },

  // HIPERTROFIA - DENSIDADE MÁXIMA
  '4 Claras e 2 ovos inteiros': {
    title: 'Mexido de Claras e Ovos Super Aminoácidos',
    ingredients: [
      '4 Claras de ovo orgânicas',
      '2 Ovos inteiros',
      'Fio de óleo de coco ou azeite de oliva extra virgem'
    ],
    preparation: 'Bata os ovos vigorosamente até formar uma liga amarela homogênea. Cozinhe em frigideira quente untada, mexendo constantemente com uma espátula de silicone para criar pedaços macios e cozidos por igual.',
    tip: 'Altíssimo valor biológico protéico contendo leucina, valina e isoleucina naturais.',
    calories: 225, protein: 26, carbs: 2, fats: 12
  },
  '80g de Aveia em flocos': {
    title: 'Mingau de Aveia dos Campeões',
    ingredients: [
      '80g de aveia em flocos grossos',
      '150ml de água ou leite vegetal',
      'Opção de canela em pó para perfumar'
    ],
    preparation: 'Cozinhe a aveia com a água em fogo baixo, mexendo vigorosamente por 4-5 minutos até virar um mingau encorpado.',
    tip: 'Os beta-glucanos da aveia estabilizam o intestino de atletas que ingerem grandes quantidades de alimentos.',
    calories: 300, protein: 11, carbs: 52, fats: 6
  },
  'Frutas vermelhas': {
    title: 'Bowl Vermelho de Polifenóis',
    ingredients: [
      '40g de morangos picados, mirtilos selvagens e amoras congeladas'
    ],
    preparation: 'Misture as frutas congeladas ou frescas por cima do mingau de aveia morno.',
    tip: 'Os antioxidantes presentes impedem o estresse oxidativo desnecessário nas mitocôndrias musculares.',
    calories: 50, protein: 1, carbs: 11, fats: 0.5
  },
  '180g de Frango ou Peixe': {
    title: 'Sabor Grelhado Proteico Intenso',
    ingredients: [
      '180g de peito de frango limpo ou filé de tilápia fresca',
      'Alho, sal e páprica picante termogênica'
    ],
    preparation: 'Doure a carne escolhida em frigideira grelhadora de ferro com fogo alto até obter coloração levemente dourada marcante.',
    tip: 'Carga maciça de lisina e glutamina regeneradoras.',
    calories: 290, protein: 54, carbs: 0, fats: 6
  },
  '150g de Batata Doce': {
    title: 'Batata Doce Glicêmica Estável',
    ingredients: [
      '150g de batata doce com casca'
    ],
    preparation: 'Lave bem a casca externa. Cozinhe em água fervente ou asse embrulhada em papel alumínio por 20 minutos.',
    tip: 'Conserve a casca para retardar ainda mais a absorção intestinal dos carboidratos complexos.',
    calories: 130, protein: 2, carbs: 30, fats: 0.2
  },
  'Aspargos ou Vagem': {
    title: 'Aspargos / Vagem Grelhados crocantes',
    ingredients: [
      '50g de aspargos verdes ou vagem nacional',
      'Fio pequeno de azeite, alho e sal'
    ],
    preparation: 'Grelhe rapidamente os aspargos na frigideira por 3 minutos até dourarem mantendo-os firmes e suculentos.',
    tip: 'Diurético natural perfeito para deixar a pele colada aos músculos definidos.',
    calories: 30, protein: 2, carbs: 5, fats: 0.1
  },
  'Sanduíche de atum natural': {
    title: 'Power Sandwich de Atum Integral',
    ingredients: [
      '2 fatias de pão de forma integral',
      '80g de atum sólido em conserva de água escorrido',
      '1 colher de sobremesa de iogurte desnatado (para liga cremosa)'
    ],
    preparation: 'Misture o atum com o iogurte desnatado criando um patê protéico denso. Espalhe uniformemente sobre a fatia de pão e feche o sanduíche.',
    tip: 'O atum em lata é excelente fonte rápida de selênio e ácidos graxos essenciais ótimos para articulações.',
    calories: 250, protein: 20, carbs: 25, fats: 5
  },
  'Pasta de amendoim (1 colher)': {
    title: 'Pasta de Amendoim Puro Anabolismo',
    ingredients: [
      '1 colher de sopa cheia (15g) de pasta de amendoim 100% integral sem açúcar'
    ],
    preparation: 'Consumir diretamente da colher ou misturada com pedaços de fruta ricas em potássio.',
    tip: 'Rica em arginina e gorduras monoinsaturadas saudáveis para síntese hormonal androgênica.',
    calories: 95, protein: 3.5, carbs: 3, fats: 8
  },
  'Abacate (100g)': {
    title: 'Abacate Lipídeos Protetores de Membrana',
    ingredients: [
      '100g de polpa de abacate firme sem caroço',
      'Gotas de limão siciliano'
    ],
    preparation: 'Retire a polpa e fatie em lâminas limpas, salpicando limão para impedir que o abacate oxide e mude sua consistência.',
    tip: 'Essas gorduras insaturadas reduzem o cortisol que é altamente catabólico à noite.',
    calories: 160, protein: 2, carbs: 9, fats: 15
  },
  'Proteína de lenta absorção (Caseína ou Ovos)': {
    title: 'Proteína de Lenta Absorção Anticatabólica Noturna',
    ingredients: [
      '25g de suplemento de Micellar Casein OR 3 claras de ovos cozidos com gema mole'
    ],
    preparation: 'Prepare em forma de shake leve com água se for caseína, ou consuma os ovos cozidos descascados e temperados.',
    tip: 'Fornece aminoácidos correntes para o corpo durante as fases profundas de sono REM por até 7 horas corridas.',
    calories: 120, protein: 24, carbs: 1, fats: 1.5
  }
};

export const EXERCISE_DEMO_DATABASE: { [key: string]: ExerciseDemo } = {
  // SPLIT A (PEITO / OMBROS / TRÍCIPS)
  // WEIGHT LOSS LIST
  'Flexão de Braço Dinâmica (Peso Corporal)': {
    title: 'Flexão de Braço Dinâmica',
    target: 'Peito, Ombro Anterior e Tríceps',
    execution: [
      'Posicione-se em prancha alta, mãos ligeiramente mais afastadas que a largura dos ombros.',
      'Mantenha o core (abdômen e glúteos) 100% contraído, mantendo uma linha reta dos calcanhares ao pescoço.',
      'Desça o corpo dobrando os cotovelos para trás (em um ângulo de 45° com o tronco) até o peito quase tocar o solo.',
      'Empurre o solo com explosão retornando à posição inicial de prancha.'
    ],
    proTip: 'Se cansar nas últimas repetições, apoie os joelhos no solo e continue sem interrupção para manter a intensidade cardiopulmonar.',
    breathing: 'Inspire durante a descida e expire no maior esforço de subida (fase concêntrica).'
  },
  'Supino Inclinado com Halteres (Foco Definição)': {
    title: 'Supino Inclinado com Halteres',
    target: 'Peito Superior (Porção Clavicular) e Deltoide Anterior',
    execution: [
      'Sente-se em um banco inclinado a 30° ou no máximo 45°, segurando um halter em cada mão apoiado nas coxas.',
      'Deite-se no banco, eleve os halteres alinhando-os acima do seu peito superior com as palmas voltadas para a frente.',
      'Desça os halteres sob absoluto controle até que fiquem próximos à linha média do seu peito.',
      'Empurre os halteres para cima de forma convergente, sem deixar que os pesos batam um no outro no topo.'
    ],
    proTip: 'Mantenha as escápulas constantemente aduzidas (fechadas) contra o banco para proteger seus ombros de lesões por impacto.',
    breathing: 'Inspire na descida controlada e expire na subida forte.'
  },
  'Crucifixo Reto com Halteres': {
    title: 'Crucifixo Reto com Halteres',
    target: 'Peito Maior (Fibras Esternocostais) e Deltoide Anterior',
    execution: [
      'Deite-se em um banco plano segurando halteres sobre os ombros com palmas das mãos voltadas uma para a outra.',
      'Mantenha uma leve flexão nos cotovelos para eliminar estresse articular no bíceps.',
      'Abra os braços lateralmente em arco largo até sentir um alongamento completo nas fibras do peitoral.',
      'Feche os braços seguindo o mesmo arco largo de volta, focando inteiramente em esmagar o peito.'
    ],
    proTip: 'Evite descer os braços abaixo da linha dos ombros se você tiver dores ou hipermobilidade na articulação glenoumeral.',
    breathing: 'Inspire enquanto abre os braços e expire ao fechá-los no ponto mais alto.'
  },
  'Crossover Polia Alta (Foco Miolo/Cardio)': {
    title: 'Crossover na Polia Alta',
    target: 'Porção Inferior e Miolo do Peitoral Maior',
    execution: [
      'Ajuste as polias na posição mais alta e segure um estribo em cada mão.',
      'Dê um passo à frente saindo do alinhamento da máquina e curve levemente o tronco à frente.',
      'Com os cotovelos semi-flexionados, empurre as manoplas para baixo e para frente até as mãos quase se tocarem à frente do quadril.',
      'Esforce-se para esmagar as musculaturas do peito por 1 segundo no topo da contração.'
    ],
    proTip: 'Puxe focando nos cotovelos indo em direção um ao outro e não apenas unindo as palmas das mãos.',
    breathing: 'Inspire ao retornar com os braços elevados e expire ao esmagar as manoplas.'
  },
  'Desenvolvimento com Halteres no Banco': {
    title: 'Desenvolvimento de Ombros Sentado',
    target: 'Deltoide Medial/Anterior e Tríceps',
    execution: [
      'Sente-se em um banco com encosto reto ajustado a 90° segurando um halter em cada mão na altura dos ombros.',
      'Mantenha as costas totalmente apoiadas e os pés firmes empurrando o chão.',
      'Pressione os halteres diretamente para cima até que seus braços estejam completamente estendidos.',
      'Desça sob controle constante até que os halteres cheguem no mínimo na altura das orelhas.'
    ],
    proTip: 'Não incline a cabeça para a frente nem arqueie a coluna lombar de forma desproporcional durante a subida do exercício.',
    breathing: 'Expire na subida empurrando o peso e inspire ao trazer os halteres para os ombros.'
  },
  'Elevação Lateral de Alta Cadência': {
    title: 'Elevação Lateral de Alta Cadência',
    target: 'Deltoide Lateral (Ombros Largos de Elite)',
    execution: [
      'Fique em pé, pés na largura do quadril, segurando um halter leve em cada mão ao lado das pernas.',
      'Incline as costas levemente para a frente (cerca de 5 a 10 graus).',
      'Eleve os braços para os lados, mantendo as mãos ligeiramente pronadas (dedo mindinho voltado para cima, como se estivesse derramando água de uma jarra).',
      'Pare na altura dos ombros e desça controlando o peso.'
    ],
    proTip: 'Não use impulso das pernas ou do quadril. Deixe o deltoide fazer 100% da tração mecânica.',
    breathing: 'Expire ao subir os braços e inspire suavemente durante a descida.'
  },
  'Tríceps no Pulley Alto com Corda': {
    title: 'Tríceps Polia com Corda',
    target: 'Tríceps (Cabeça Lateral e Medial)',
    execution: [
      'Segure a corda acoplada na polia alta com uma pegada neutra.',
      'Dobre ligeiramente os joelhos, incline o tronco à frente e trave os cotovelos bem próximos ao seu tórax.',
      'Pressione a corda para baixo até estender totalmente os braços, abrindo as extremidades da corda no final para contração extrema.',
      'Retorne lentamente até o antebraço atingir um ângulo de 90 graus em relação ao braço superior.'
    ],
    proTip: 'Não balance os ombros! Os cotovelos devem agir estritamente como pivôs fixos sem recuar para trás durante a descida.',
    breathing: 'Expire ao estender os braços para baixo e expire controladamente na subida.'
  },
  'Tríceps Coice Unilateral na Polia': {
    title: 'Tríceps Coice Unilateral na Polia',
    target: 'Tríceps (Cabeça Longa de Impacto)',
    execution: [
      'Abaixe a polia, segure a ponta do cabo sem pegador para torque natural.',
      'Incline o tronco paralelo ao solo, segurando na coluna da máquina para estabilizar.',
      'Trave o cotovelo acima da linha do corpo e empurre o cabo para trás até o braço estar totalmente reto.',
      'Dobre de volta apenas o antebraço de forma altamente cadenciada.'
    ],
    proTip: 'Mantenha o ombro oposto e quadril alinhados, sem rotacionar a coluna vertebral.',
    breathing: 'Expire na extensão de estalo do tríceps e inspire na volta.'
  },

  // GANHAR MASSA OU HIPERTROFIA SPLIT A (PEITO / OMBROS / TRÍCIPS)
  'Supino Reto com Barra Olímpica': {
    title: 'Supino Reto com Barra Olímpica',
    target: 'Peito Geral (Foco Esternal), Deltoide Anterior e Tríceps',
    execution: [
      'Deite-se no banco plano sob a barra olímpica, olhos alinhados diretamente embaixo da barra.',
      'Segure a barra com pegada firme pronada um pouco além da largura dos ombros.',
      'Retire a barra do cavalete, estabilizando-a acima do meio do peito com braços travados.',
      'Desça a barra lentamente até tocar com extrema leveza a linha dos mamilos.',
      'Empurre a barra com força explosiva de volta ao topo sem descolar os ombros.'
    ],
    proTip: 'Faça a técnica do "Leg Drive": empurre vigorosamente os pés contra o solo para gerar rigidez estrutural no corpo.',
    breathing: 'Inspire retendo o ar na fase cêntrica (descida) e expire ao explodir a subida.'
  },
  'Supino Inclinado com Halteres Pesados': {
    title: 'Supino Inclinado Pesado com Halteres',
    target: 'Porção Superior Completa do Peito e Tríceps',
    execution: [
      'Sente no banco de 30° elevando os halteres pesados com ajuda vigorosa dos joelhos.',
      'Empurre os halteres com carga pesada aplicando movimento convergente mas estrito.',
      'Desça até alongar profundamente as fibras do topo do peito e empurre novamente com força superior.'
    ],
    proTip: 'Não jogue os cotovelos para os lados a 90 graus; mantenha-os a 45 graus para blindar o manguito rotador.',
    breathing: 'Inspire soltando o peso sob gravidade controlada e solte o ar na transição superior.'
  },
  'Crucifixo Inclinado com Halteres': {
    title: 'Crucifixo Inclinado',
    target: 'Fibras Superiores do Peito (Alongamento de Elite)',
    execution: [
      'Sente no banco inclinado a 30°, estabilizando os halteres sobre o trapézio superior.',
      'Abra os braços descrevendo um grande semicírculo no plano sagital inclinado.',
      'Alongue no limiar do seu manguito e feche retornando à contração concêntrica superior.'
    ],
    proTip: 'A velocidade deve ser lenta na descida (fase excêntrica) de 4 segundos.',
    breathing: 'Inspiração profunda na descida para inflar a caixa torácica, expiração fechando a contração.'
  },
  'Supino Declinado com Barra': {
    title: 'Supino Declinado com Barra',
    target: 'Peitoral Inferior (Contorno e Densidade Base)',
    execution: [
      'Prenda os pés nos rolos do banco declinado e deite-se confortavelmente.',
      'Retire a barra livre e desça em trajetória suave até o peito inferior de forma fluida.',
      'Empurre exercendo pressão contraída direcionada.'
    ],
    proTip: 'Muito cuidado ao retirar a barra sozinho de bancos declinados de alta inclinação.',
    breathing: 'Respire curtas inspirações na descida e solte de forma audível na subida.'
  },
  'Desenvolvimento Militar Barra Livre em Pé': {
    title: 'Desenvolvimento Militar Livre (OHP - Overhead Press)',
    target: 'Deltoide Geral, Abdominais e Tríceps Estabilizador',
    execution: [
      'Fique em pé, pés firmes na largura dos ombros, tire a barra do cavalete na altura do peitoral superior.',
      'Contraia glúteos e core imensamente para neutralizar e blindar a lombar.',
      'Empurre a barra para cima, passando rente ao rosto até estender os braços diretamente acima da cabeça.'
    ],
    proTip: 'Quando a barra passar a linha do rosto, "empurre" sutilmente a cabeça para frente para alinhar os braços à linha da orelha.',
    breathing: 'Bloqueie a respiração na saída (Manobra de Valsalva básica) e expire firme no topo.'
  },
  'Elevação Lateral com Carga Progressiva': {
    title: 'Elevação Lateral com Carga Progressiva',
    target: 'Deltoides Laterais (Densidade e Hipertrofia Extrema)',
    execution: [
      'Segure halteres adequadamente pesados em postura ereta.',
      'Inicie a elevação lateral mantendo o minguinho sutilmente elevado e mantendo cadência perfeita.',
      'Incremente carga progressiva a cada set reduzindo levemente repetições (Pirâmide).'
    ],
    proTip: 'Se houver perda de técnica antes da oitava repetição, reduza o peso imensamente.',
    breathing: 'Expulse o ar de forma explosiva ao atingir o zênite do alongamento lateral.'
  },
  'Tríceps Testa na Barra W (Banco Reto)': {
    title: 'Tríceps Testa na Barra W',
    target: 'Tríceps (Cabeça Longa e Lateral)',
    execution: [
      'Deite-se no banco reto segurando a barra W nas marcas curvadas com pegada pronada curta.',
      'Aponte os braços para cima e incline-os cerca de 10° para trás para manter o tríceps sob tensão constante.',
      'Dobre apenas os cotovelos abaixando a barra até a região de sua testa ou topo do crânio.',
      'Estenda os cotovelos puxando de volta ao ponto inclinado.'
    ],
    proTip: 'Mantenha os cotovelos o mais fechados e apontando reto para a frente possíveis sem abrir para os lados.',
    breathing: 'Inspire na flexão controlada do cotovelo e expire na extensão pesada de força.'
  },
  'Tríceps Francês Sentado com Halter Pesado': {
    title: 'Tríceps Francês Sentado',
    target: 'Tríceps Cabeça Longa (Anabolismo Profundo)',
    execution: [
      'Sente no banco, segure um halter de carga alta com ambas as mãos apoiando as palmas por dentro da anilha.',
      'Eleve o halter acima do topo de sua cabeça e execute flexões profundas para trás.',
      'Estenda o tríceps até o topo travando por breves instantes.'
    ],
    proTip: 'Ideal manter o encosto ligeiramente inclinado para acomodar ombros encurtados sem dores nas costas.',
    breathing: 'Inspire ao descer o peso atrás da nuca e expire ao erguer.'
  },

  // SPLIT B (COSTAS / OMBROS / BÍCEPS)
  'Puxador Alto Frente com Barra': {
    title: 'Puxador Alto Frente (Pulldown)',
    target: 'Latíssimo do Dorso (Dorsais Largos) e Bíceps',
    execution: [
      'Sente-se no aparelho ajustando o suporte de coxa firmemente contra o quadril.',
      'Segure a barra com pegada pronada larga e puxe-a em direção à parte superior do peito.',
      'Retorne sob controle, permitindo que as escápulas se abram totalmente no topo sem soltar o cabo.'
    ],
    proTip: 'Puxe liderando o movimento com os cotovelos descendo em direção à sua cintura, eliminando a tração das mãos.',
    breathing: 'Expire na puxada concêntrica e inspire na subida controlada.'
  },
  'Remada Curvada com Halteres (Pegada Supinada)': {
    title: 'Remada Curvada Supinada',
    target: 'Dorsais, Trapézio, Romboides e Bíceps',
    execution: [
      'Incline o tronco à frente a 45° mantendo a coluna lombar totalmente plana e pernas flexionadas.',
      'Segure os halteres com pegada supinada (palmas das mãos voltadas para a frente).',
      'Puxe os halteres em direção ao seu umbigo, esmagando as escápulas na parte alta do exercício.'
    ],
    proTip: 'Esta pegada induz forte ativação mecânica dos bíceps combinada à espessura de costas.',
    breathing: 'Expire ao puxar as cargas e expire enquanto alonga na descida.'
  },
  'Rosca Direta Clássica com Barra W': {
    title: 'Rosca Direta com Barra W',
    target: 'Bíceps Braquial e Braquiorradial',
    execution: [
      'Segure a barra W na angulação externa mais confortável, cotovelos junto aos quadris.',
      'Flexione os cotovelos elevando a barra em direção ao peito sem balançar o tronco ou mover os ombros.',
      'Desça estendendo de forma cadenciada até esticar totalmente os braços.'
    ],
    proTip: 'A barra W diminui drasticamente o estresse nos punhos em relação à barra reta comum.',
    breathing: 'Expire ao flexionar o braço na subida e deite a barra inspirando.'
  },

  // SPLIT C (INFERIOR COMPLETO)
  'Agachamento Livre com Peso Corporal (Completo)': {
    title: 'Agachamento Livre de Alta Amplitude',
    target: 'Quadríceps, Isquiotibiais, Glúteos e Core',
    execution: [
      'Fique em pé com pés na largura dos ombros, pontas dos pés levemente apontadas para fora (15 graus).',
      'Inicie a descida projetando os quadris para trás, descendo como se fosse sentar em uma cadeira baixa.',
      'Agache com amplitude completa de preferência abaixo dos 90°, mantendo o calcanhar plantado.',
      'Empurre os calcanhares no solo subindo com glúteos e quadríceps travando no topo.'
    ],
    proTip: 'Abra os joelhos ativamente acompanhando a direção das pontas de seus pés para preservar os meniscos.',
    breathing: 'Inspire durante toda a descida profunda e expire forte na subida.'
  },
  'Agachamento Livre Traseiro Barra Pesada': {
    title: 'Agachamento Livre Traseiro com Barra',
    target: 'Quadríceps, Glúteos, Eretores da Espinha e Adutores',
    execution: [
      'Posicione a barra de aço sobre o trapézio (evitando a vértebra cervical direta).',
      'Tire a barra dando um passo firme para trás com pés na largura de ombro.',
      'Desça profundamente mantendo a coluna estritamente alinhada e empurre o solo com agressividade.'
    ],
    proTip: 'Use sapatos de sola plana ou agache descalço para melhor conexão cinestésica orbital.',
    breathing: 'Preencha o abdômen com ar e bloqueie (Cinturão de ar) para excelente estabilidade lombar.'
  },
  'Leg Press 45º Pesado Repetições Estritas': {
    title: 'Leg Press 45º de Alta Carga',
    target: 'Quadríceps, Vastos Medial/Lateral e Glúteos',
    execution: [
      'Sente no aparelho, ajuste a região lombar inteiramente apoiada no estofado.',
      'Coloque os pés na plataforma na largura dos ombros.',
      'Destrave a plataforma e abaixe trazendo os joelhos em direção às axilas de modo profundo.',
      'Empurre estendendo pernas sem descolar o quadril e sem esticar 100% o joelho (pare em 95%).'
    ],
    proTip: 'Jamais estenda completamente e de forma rápida os joelhos sob altas cargas de perna no topo.',
    breathing: 'Inspire no recuo inferior e expire na subida forçada.'
  }
};

// Default generic demos for items missing in precise maps
export const getGenericExerciseDemo = (name: string): ExerciseDemo => {
  return {
    title: name,
    target: 'Geral Estabilizador / Cardio Ativo',
    execution: [
      'Inicie com postura estabilizada, peito aberto e escápulas aduzidas.',
      'Execute as repetições sob cadência lenta (3s descida, 2s subida).',
      'Mantenha o músculo-alvo sob máxima tensão mecânica durante todo o percurso.',
      'Conclua a amplitude completa sem usar balanço ou impulsos cinéticos extras.'
    ],
    proTip: 'A disciplina na velocidade de execução traz mais recrutamento de fibras do que apenas peso bruto.',
    breathing: 'Inspire na fase excêntrica de menor esforço e expire na fase de maior empuxo de carga.'
  };
};

export const getGenericRecipe = (name: string): Recipe => {
  return {
    title: name,
    ingredients: ['Porção pesada recomendada de acordo com seu peso', 'Sal, hortaliças e ervas naturais para complementar livremente'],
    preparation: 'Cozinhe ou asse de forma simples utilizando panelas antiaderentes untadas com o mínimo de óleo de coco ou azeite extra virgem.',
    tip: 'Pratos de alta densidade biológica limpos catalisam a queima de gorduras e dão energia extrema.',
    calories: 200, protein: 15, carbs: 15, fats: 5
  };
};
