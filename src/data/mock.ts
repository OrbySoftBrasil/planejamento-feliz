export type Atividade = {
  id: string;
  titulo: string;
  tema: string;
  campo: string;
  faixa: string;
  duracao: number;
  materiais: string[];
  objetivo: string;
  passos: string[];
  adaptacoes: string[];
  tags: string[];
};

export type Registro = {
  atividadeId: string;
  humor: "otimo" | "mais_ou_menos" | "dificil";
  duracaoReal: number;
  comentario: string;
  data: string;
};

export type Slot = {
  id: string;
  dia: string;
  momento: string;
  titulo: string;
  atividadeId?: string;
  tipo: "rotina" | "atividade" | "projeto";
};

export type EventoCalendario = {
  dia: number;
  titulo: string;
  tipo: "data" | "projeto" | "evento";
};

export const professora = {
  nome: "Ana Lúcia",
  escola: "EMEI Vila das Flores",
  turma: "Turma Girassol",
  idade: "4 anos",
  criancas: 18,
  periodo: "Manhã",
  estilo: "Aprender brincando, com muita conversa e experimentação",
  preferencias: [
    "Atividades curtas, de 20 a 40 minutos",
    "Trabalho em pequenos grupos",
    "Histórias antes de propor o desafio",
  ],
  materiais: [
    "Papel e giz de cera",
    "Tinta guache",
    "Copos e bacias plásticas",
    "Sucata (garrafas, tampinhas)",
    "Caixa de som",
  ],
  particularidades:
    "Dois bebês de colo na sala ao lado; uma criança em processo de adaptação; grupo agitado depois do parque.",
};

export const hoje = {
  diaSemana: "Quarta-feira",
  dataCurta: "18 de março",
  dataLonga: "Quarta-feira, 18 de março de 2026",
};

export const projetoAnual = [
  {
    bimestre: "1º bimestre",
    tema: "Quem sou eu e quem é o outro",
    objetivos: [
      "Reconhecer o próprio nome e o dos colegas",
      "Construir combinados da turma",
      "Explorar sentidos e movimentos",
    ],
    projetos: ["Meu retrato falado", "Água e vida"],
  },
  {
    bimestre: "2º bimestre",
    tema: "O mundo ao meu redor",
    objetivos: [
      "Observar plantas e bichos do entorno",
      "Cuidar do espaço coletivo",
      "Registrar descobertas com desenho",
    ],
    projetos: ["Horta da turma", "Festa junina"],
  },
  {
    bimestre: "3º bimestre",
    tema: "Histórias que contamos",
    objetivos: [
      "Recontar histórias com apoio de imagens",
      "Brincar de faz de conta",
      "Ampliar vocabulário",
    ],
    projetos: ["Teatro de sombras", "Semana do folclore"],
  },
  {
    bimestre: "4º bimestre",
    tema: "O que aprendemos juntos",
    objetivos: [
      "Retomar descobertas do ano",
      "Apresentar produções para as famílias",
      "Preparar a passagem para o próximo ano",
    ],
    projetos: ["Mostra cultural", "Livro da turma"],
  },
];

export const planoMensal = {
  mes: "Março",
  tema: "Água e vida",
  focos: [
    "De onde vem a água que usamos",
    "Como cuidar e não desperdiçar",
    "Experimentar: flutua ou afunda?",
  ],
  datas: [
    { dia: 8, titulo: "Dia da Mulher", tipo: "data" as const },
    { dia: 11, titulo: "Passeio ao parque", tipo: "evento" as const },
    { dia: 16, titulo: "Início do projeto Água e vida", tipo: "projeto" as const },
    { dia: 20, titulo: "Dia da Água (celebração na escola)", tipo: "data" as const },
    { dia: 21, titulo: "Início do Outono", tipo: "data" as const },
    { dia: 25, titulo: "Reunião com as famílias", tipo: "evento" as const },
    { dia: 30, titulo: "Mostra de desenhos do projeto", tipo: "projeto" as const },
  ] as EventoCalendario[],
};

export const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
export const momentos = ["Acolhida", "Atividade principal", "Roda final"];

export const slotsIniciais: Slot[] = [
  { id: "s1", dia: "Segunda", momento: "Acolhida", titulo: "Roda de música e chamada", tipo: "rotina" },
  { id: "s2", dia: "Segunda", momento: "Atividade principal", titulo: "Flutua ou afunda?", atividadeId: "a1", tipo: "atividade" },
  { id: "s3", dia: "Segunda", momento: "Roda final", titulo: "O que descobrimos hoje", tipo: "rotina" },
  { id: "s4", dia: "Terça", momento: "Acolhida", titulo: "História: A gotinha viajante", tipo: "rotina" },
  { id: "s5", dia: "Terça", momento: "Atividade principal", titulo: "Pintura com água colorida", atividadeId: "a2", tipo: "atividade" },
  { id: "s6", dia: "Terça", momento: "Roda final", titulo: "Combinados da semana", tipo: "rotina" },
  { id: "s7", dia: "Quarta", momento: "Acolhida", titulo: "Roda de conversa: banho e torneira", tipo: "rotina" },
  { id: "s8", dia: "Quarta", momento: "Atividade principal", titulo: "Caminho da água na sucata", atividadeId: "a3", tipo: "projeto" },
  { id: "s9", dia: "Quarta", momento: "Roda final", titulo: "Desenho do que vimos", tipo: "rotina" },
  { id: "s10", dia: "Quinta", momento: "Acolhida", titulo: "Brincadeira cantada", tipo: "rotina" },
  { id: "s11", dia: "Quinta", momento: "Atividade principal", titulo: "Cuidar das plantas da escola", atividadeId: "a4", tipo: "atividade" },
  { id: "s12", dia: "Quinta", momento: "Roda final", titulo: "Leitura de imagens", tipo: "rotina" },
  { id: "s13", dia: "Sexta", momento: "Acolhida", titulo: "Boas-vindas ao Dia da Água", tipo: "rotina" },
  { id: "s14", dia: "Sexta", momento: "Roda final", titulo: "Mural coletivo da semana", tipo: "rotina" },
];

export const atividades: Atividade[] = [
  {
    id: "a1",
    titulo: "Flutua ou afunda?",
    tema: "Água",
    campo: "Espaços, tempos, quantidades, relações e transformações",
    faixa: "4 a 5 anos",
    duracao: 30,
    materiais: ["Bacia com água", "Tampinhas", "Pedrinhas", "Folhas secas"],
    objetivo: "Levantar hipóteses sobre o que flutua e o que afunda, observando e comparando.",
    passos: [
      "Reunir a turma em roda ao redor da bacia com água.",
      "Mostrar cada objeto e perguntar: vai boiar ou afundar?",
      "Testar um a um, em pequenos grupos.",
      "Registrar no cartaz com carinhas de sim e não.",
    ],
    adaptacoes: [
      "Para grupos agitados, dividir em dois momentos de 15 minutos.",
      "Crianças mais novas podem apenas manipular e observar.",
    ],
    tags: ["experimento", "água", "ciências"],
  },
  {
    id: "a2",
    titulo: "Pintura com água colorida",
    tema: "Água",
    campo: "Traços, sons, cores e formas",
    faixa: "3 a 5 anos",
    duracao: 40,
    materiais: ["Copos", "Tinta guache", "Pincéis", "Papel grosso"],
    objetivo: "Explorar misturas de cor e a diluição da tinta na água.",
    passos: [
      "Preparar copos com água e um pouco de guache.",
      "Deixar as crianças misturarem e observarem as cores.",
      "Pintar livremente em papel grande.",
      "Expor as produções no varal da sala.",
    ],
    adaptacoes: ["Usar pincéis maiores para quem ainda tem pouca firmeza."],
    tags: ["arte", "água", "cores"],
  },
  {
    id: "a3",
    titulo: "Caminho da água na sucata",
    tema: "Água",
    campo: "Espaços, tempos, quantidades, relações e transformações",
    faixa: "4 a 6 anos",
    duracao: 45,
    materiais: ["Garrafas cortadas", "Mangueirinhas", "Fita adesiva", "Bacia"],
    objetivo: "Construir um percurso para a água correr e observar o movimento.",
    passos: [
      "Mostrar fotos de calhas e canos.",
      "Montar o percurso preso no muro, em pequenos grupos.",
      "Testar com jarrinhas de água e ajustar.",
      "Conversar sobre para onde a água vai depois.",
    ],
    adaptacoes: ["Se chover, montar dentro da sala sobre a bacia."],
    tags: ["projeto", "água", "construção"],
  },
  {
    id: "a4",
    titulo: "Cuidar das plantas da escola",
    tema: "Natureza",
    campo: "O eu, o outro e o nós",
    faixa: "3 a 5 anos",
    duracao: 25,
    materiais: ["Regadores", "Pazinhas"],
    objetivo: "Assumir pequenos cuidados coletivos com os espaços da escola.",
    passos: [
      "Combinar quem rega cada canteiro.",
      "Observar a terra seca e molhada.",
      "Voltar para a sala e desenhar a planta escolhida.",
    ],
    adaptacoes: ["Fazer em duplas para quem está em adaptação."],
    tags: ["rotina", "natureza", "cuidado"],
  },
  {
    id: "a5",
    titulo: "Meu nome, meu retrato",
    tema: "Identidade",
    campo: "O eu, o outro e o nós",
    faixa: "4 a 5 anos",
    duracao: 35,
    materiais: ["Espelho", "Papel", "Giz de cera"],
    objetivo: "Reconhecer características próprias e escrever o próprio nome com apoio.",
    passos: [
      "Observar o rosto no espelho.",
      "Desenhar o autorretrato.",
      "Copiar o nome do crachá embaixo do desenho.",
    ],
    adaptacoes: ["Oferecer crachá com letra maior para quem precisar."],
    tags: ["identidade", "escrita"],
  },
  {
    id: "a6",
    titulo: "História cantada: chuva no telhado",
    tema: "Água",
    campo: "Escuta, fala, pensamento e imaginação",
    faixa: "3 a 4 anos",
    duracao: 20,
    materiais: ["Caixa de som", "Lenços"],
    objetivo: "Ampliar repertório musical e brincar com sons da chuva.",
    passos: [
      "Ouvir a música com os olhos fechados.",
      "Imitar o som da chuva com as mãos.",
      "Dançar com os lenços na parte final.",
    ],
    adaptacoes: ["Reduzir o volume para crianças sensíveis a som."],
    tags: ["música", "água", "corpo"],
  },
];

export const sugestaoAgua: Atividade = {
  id: "nova-agua",
  titulo: "A viagem da gotinha",
  tema: "Água",
  campo: "Espaços, tempos, quantidades, relações e transformações",
  faixa: "4 anos",
  duracao: 45,
  materiais: ["Bacia com água", "Copos plásticos", "Papel", "Giz de cera", "Caixa de som"],
  objetivo:
    "Perceber o caminho da água no dia a dia e conversar sobre formas simples de não desperdiçar.",
  passos: [
    "Contar a história da gotinha que sai da nuvem e chega na torneira.",
    "Roda de conversa: onde usamos água hoje?",
    "Experimento em pequenos grupos: passar água de um copo a outro sem derramar.",
    "Cada criança desenha um lugar onde a água aparece.",
    "Montar o mural 'A viagem da gotinha' no corredor.",
  ],
  adaptacoes: [
    "Se o grupo estiver agitado, fazer a história sentados no tapete.",
    "Oferecer copos menores para as crianças com menos firmeza.",
  ],
  tags: ["água", "experimento", "conversa"],
};

export const registrosIniciais: Registro[] = [
  {
    atividadeId: "a1",
    humor: "otimo",
    duracaoReal: 35,
    comentario: "Todos quiseram testar. Vale repetir com objetos trazidos de casa.",
    data: "16 de março",
  },
  {
    atividadeId: "a4",
    humor: "mais_ou_menos",
    duracaoReal: 20,
    comentario: "Faltou regador para todo mundo, formar duplas ajudou.",
    data: "12 de março",
  },
];
