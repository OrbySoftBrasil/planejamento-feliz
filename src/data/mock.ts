/* Dados fictícios ricos de uma professora de pré-escola (turma de 4 anos).
   Tudo é mockado, mas com volume e coerência suficientes para o protótipo
   parecer um sistema em uso há meses. */

export type CampoExperiencia =
  | "O eu, o outro e o nós"
  | "Corpo, gestos e movimentos"
  | "Traços, sons, cores e formas"
  | "Escuta, fala, pensamento e imaginação"
  | "Espaços, tempos, quantidades, relações e transformações";

export const camposExperiencia: CampoExperiencia[] = [
  "O eu, o outro e o nós",
  "Corpo, gestos e movimentos",
  "Traços, sons, cores e formas",
  "Escuta, fala, pensamento e imaginação",
  "Espaços, tempos, quantidades, relações e transformações",
];

export const campoCor: Record<CampoExperiencia, string> = {
  "O eu, o outro e o nós": "coral",
  "Corpo, gestos e movimentos": "folha",
  "Traços, sons, cores e formas": "sol",
  "Escuta, fala, pensamento e imaginação": "agua",
  "Espaços, tempos, quantidades, relações e transformações": "primary",
};

export const campoCurto: Record<CampoExperiencia, string> = {
  "O eu, o outro e o nós": "Eu e o outro",
  "Corpo, gestos e movimentos": "Corpo e movimento",
  "Traços, sons, cores e formas": "Artes",
  "Escuta, fala, pensamento e imaginação": "Linguagem",
  "Espaços, tempos, quantidades, relações e transformações": "Mundo e números",
};

export type Atividade = {
  id: string;
  titulo: string;
  tema: string;
  campo: CampoExperiencia;
  faixa: string;
  duracao: number;
  espaco: "Sala" | "Pátio" | "Parque" | "Refeitório" | "Corredor";
  organizacao: "Turma toda" | "Pequenos grupos" | "Duplas" | "Individual";
  materiais: string[];
  objetivo: string;
  objetivosBncc: { codigo: string; texto: string }[];
  passos: string[];
  adaptacoes: string[];
  observacaoProfessora?: string;
  tags: string[];
  criadaEm: string;
  origem: "minha" | "assistente" | "escola";
  favorita?: boolean;
};

export type Registro = {
  id: string;
  atividadeId: string;
  humor: "otimo" | "mais_ou_menos" | "dificil";
  duracaoReal: number;
  engajamento: number; // 1 a 5
  comentario: string;
  data: string; // ISO
};

export type Slot = {
  id: string;
  data: string; // ISO yyyy-mm-dd
  momento: Momento;
  titulo: string;
  atividadeId?: string;
  tipo: "rotina" | "atividade" | "projeto" | "evento";
  status: "planejado" | "feito" | "adiado";
  nota?: string;
};

export type Momento = "Acolhida" | "Roda de conversa" | "Atividade principal" | "Parque" | "Roda final";

export const momentos: Momento[] = [
  "Acolhida",
  "Roda de conversa",
  "Atividade principal",
  "Parque",
  "Roda final",
];

export const momentoHorario: Record<Momento, string> = {
  Acolhida: "07:30",
  "Roda de conversa": "08:10",
  "Atividade principal": "08:45",
  Parque: "09:40",
  "Roda final": "10:40",
};

export type Evento = {
  data: string; // ISO
  titulo: string;
  tipo: "data" | "projeto" | "evento" | "escola";
  detalhe?: string;
};

/* ---------------------------------------------------------------- datas */

export const HOJE_ISO = "2026-03-18";

export const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
export const diasCurtos = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function parseISO(iso: string) {
  const partes = iso.split("-").map(Number);
  return new Date(partes[0] ?? 2026, (partes[1] ?? 1) - 1, partes[2] ?? 1);
}
export function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function addDias(iso: string, n: number) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
export function inicioDaSemana(iso: string) {
  const d = parseISO(iso);
  const diff = (d.getDay() + 6) % 7; // segunda = 0
  d.setDate(d.getDate() - diff);
  return toISO(d);
}
export function diasUteis(inicioISO: string) {
  return Array.from({ length: 5 }, (_, i) => addDias(inicioISO, i));
}
export function nomeMes(n: number) {
  return meses[n] ?? "";
}
export function formatarCurto(iso: string) {
  const d = parseISO(iso);
  return `${d.getDate()} de ${nomeMes(d.getMonth()).toLowerCase()}`;
}
export function formatarLongo(iso: string) {
  const d = parseISO(iso);
  return `${diasSemana[d.getDay()] ?? ""}, ${d.getDate()} de ${nomeMes(d.getMonth()).toLowerCase()} de ${d.getFullYear()}`;
}
export function nomeDia(iso: string) {
  return diasSemana[parseISO(iso).getDay()] ?? "";
}


/* ------------------------------------------------------------ professora */

export const professora = {
  nome: "Ana Lúcia",
  sobrenome: "Ribeiro",
  iniciais: "AL",
  escola: "EMEI Vila das Flores",
  rede: "Rede municipal · São Paulo",
  turma: "Turma Girassol",
  etapa: "Pré-escola I",
  idade: "4 anos",
  criancas: 18,
  periodo: "Manhã · 7h30 às 11h30",
  anosDeCasa: 9,
  estilo: "Aprender brincando, com muita conversa e experimentação",
  preferencias: [
    "Atividades de 20 a 40 minutos",
    "Pequenos grupos sempre que possível",
    "História antes de propor o desafio",
    "Registro em desenho no fim da atividade",
  ],
  evita: ["Folhinhas prontas para colorir", "Atividades longas sentadas", "Materiais que precisam comprar"],
  materiais: [
    "Papel e giz de cera",
    "Tinta guache",
    "Copos e bacias plásticas",
    "Sucata (garrafas, tampinhas)",
    "Caixa de som",
    "Massinha caseira",
    "Livros de história da sala",
    "Regadores e pazinhas",
  ],
  materiaisEmFalta: ["Cola colorida", "Papel crepom"],
  particularidades:
    "Dois bebês de colo na sala ao lado (evitar barulho alto antes das 9h); Miguel em adaptação; grupo agitado depois do parque.",
  rotina: [
    { horario: "07:30", titulo: "Acolhida e chamada" },
    { horario: "08:10", titulo: "Roda de conversa" },
    { horario: "08:45", titulo: "Atividade principal" },
    { horario: "09:30", titulo: "Lanche" },
    { horario: "09:40", titulo: "Parque" },
    { horario: "10:40", titulo: "Roda final e registro" },
    { horario: "11:10", titulo: "Higiene e saída" },
  ],
};

export type Crianca = {
  nome: string;
  idade: string;
  observacao?: string;
  atencao?: boolean;
};

export const criancas: Crianca[] = [
  { nome: "Alice", idade: "4a 3m" },
  { nome: "Arthur", idade: "4a 7m", observacao: "Adora contar histórias na roda." },
  { nome: "Benício", idade: "4a 1m" },
  { nome: "Cecília", idade: "4a 9m", observacao: "Ajuda os colegas a organizar o material." },
  { nome: "Davi", idade: "4a 2m" },
  { nome: "Elisa", idade: "4a 5m", observacao: "Sensível a sons altos.", atencao: true },
  { nome: "Enzo", idade: "4a 4m" },
  { nome: "Helena", idade: "4a 8m" },
  { nome: "Isabela", idade: "4a 0m" },
  { nome: "Joaquim", idade: "4a 6m" },
  { nome: "Laura", idade: "4a 3m" },
  { nome: "Lorenzo", idade: "4a 10m", observacao: "Já reconhece o próprio nome escrito." },
  { nome: "Maitê", idade: "4a 2m" },
  { nome: "Miguel", idade: "4a 1m", observacao: "Em adaptação, chora na entrada.", atencao: true },
  { nome: "Nina", idade: "4a 5m" },
  { nome: "Pedro", idade: "4a 7m", observacao: "Precisa de apoio para esperar a vez.", atencao: true },
  { nome: "Sofia", idade: "4a 4m" },
  { nome: "Theo", idade: "4a 6m" },
];

/* --------------------------------------------------------- planejamentos */

export const planoAnual = {
  ano: 2026,
  titulo: "Cuidar do nosso mundo",
  intencao:
    "Ao longo do ano, a turma investiga como cuidamos de nós, dos outros e dos espaços que compartilhamos.",
  bimestres: [
    {
      bimestre: "1º bimestre",
      periodo: "Fevereiro a abril",
      tema: "Quem sou eu e quem é o outro",
      status: "em andamento" as const,
      progresso: 62,
      objetivos: [
        "Reconhecer o próprio nome e o dos colegas",
        "Construir e retomar os combinados da turma",
        "Explorar sentidos, movimentos e materiais",
        "Perceber o cuidado com a água no dia a dia",
      ],
      projetos: ["Meu retrato falado", "Água e vida"],
    },
    {
      bimestre: "2º bimestre",
      periodo: "Maio a julho",
      tema: "O mundo ao meu redor",
      status: "planejado" as const,
      progresso: 18,
      objetivos: [
        "Observar plantas e bichos do entorno",
        "Cuidar do espaço coletivo",
        "Registrar descobertas com desenho e fala",
      ],
      projetos: ["Horta da turma", "Festa junina"],
    },
    {
      bimestre: "3º bimestre",
      periodo: "Agosto a setembro",
      tema: "Histórias que contamos",
      status: "rascunho" as const,
      progresso: 0,
      objetivos: [
        "Recontar histórias com apoio de imagens",
        "Brincar de faz de conta com papéis variados",
        "Ampliar vocabulário e escuta",
      ],
      projetos: ["Teatro de sombras", "Semana do folclore"],
    },
    {
      bimestre: "4º bimestre",
      periodo: "Outubro a dezembro",
      tema: "O que aprendemos juntos",
      status: "rascunho" as const,
      progresso: 0,
      objetivos: [
        "Retomar descobertas do ano",
        "Apresentar produções para as famílias",
        "Preparar a passagem para o próximo ano",
      ],
      projetos: ["Mostra cultural", "Livro da turma"],
    },
  ],
};

export type PlanoMensal = {
  mes: number; // 1-12
  ano: number;
  tema: string;
  bimestre: string;
  status: "concluído" | "em andamento" | "planejado" | "rascunho";
  focos: string[];
  camposPrioritarios: CampoExperiencia[];
  saida?: string;
};

export const planosMensais: PlanoMensal[] = [
  {
    mes: 2,
    ano: 2026,
    tema: "Nosso jeito de chegar",
    bimestre: "1º bimestre",
    status: "concluído",
    focos: ["Acolhimento e adaptação", "Combinados da turma", "Nome e crachá"],
    camposPrioritarios: ["O eu, o outro e o nós", "Escuta, fala, pensamento e imaginação"],
    saida: "Mural com os retratos da turma",
  },
  {
    mes: 3,
    ano: 2026,
    tema: "Água e vida",
    bimestre: "1º bimestre",
    status: "em andamento",
    focos: [
      "De onde vem a água que usamos",
      "Como cuidar e não desperdiçar",
      "Experimentar: flutua ou afunda?",
      "Registrar descobertas em desenho",
    ],
    camposPrioritarios: [
      "Espaços, tempos, quantidades, relações e transformações",
      "Escuta, fala, pensamento e imaginação",
    ],
    saida: "Mostra de desenhos do projeto, dia 30",
  },
  {
    mes: 4,
    ano: 2026,
    tema: "Bichos que vivem perto",
    bimestre: "1º bimestre",
    status: "planejado",
    focos: ["Observar formigas e joaninhas no pátio", "Sons dos bichos", "Cuidado com os animais"],
    camposPrioritarios: ["Espaços, tempos, quantidades, relações e transformações", "Corpo, gestos e movimentos"],
    saida: "Caderno de observações da turma",
  },
  {
    mes: 5,
    ano: 2026,
    tema: "Horta da turma",
    bimestre: "2º bimestre",
    status: "rascunho",
    focos: ["Plantar e regar", "Do que a planta precisa", "Medir o crescimento"],
    camposPrioritarios: ["Espaços, tempos, quantidades, relações e transformações", "O eu, o outro e o nós"],
  },
];

export const eventos: Evento[] = [
  { data: "2026-03-02", titulo: "Conselho de classe", tipo: "escola" },
  { data: "2026-03-06", titulo: "Entrega dos relatórios de fevereiro", tipo: "escola" },
  { data: "2026-03-08", titulo: "Dia Internacional da Mulher", tipo: "data" },
  { data: "2026-03-11", titulo: "Passeio ao parque do bairro", tipo: "evento", detalhe: "Saída às 8h30, levar autorização." },
  { data: "2026-03-16", titulo: "Início do projeto Água e vida", tipo: "projeto" },
  { data: "2026-03-19", titulo: "Formação: brincar e aprender", tipo: "escola", detalhe: "Das 13h às 15h, no polo." },
  {
    data: "2026-03-20",
    titulo: "Dia da Água — celebração na escola",
    tipo: "data",
    detalhe: "Cada turma apresenta uma produção no pátio às 10h.",
  },
  { data: "2026-03-21", titulo: "Início do Outono", tipo: "data" },
  { data: "2026-03-25", titulo: "Reunião com as famílias", tipo: "escola", detalhe: "18h, na sala da turma." },
  { data: "2026-03-27", titulo: "Dia do Circo", tipo: "data" },
  { data: "2026-03-30", titulo: "Mostra de desenhos do projeto", tipo: "projeto" },
  { data: "2026-04-03", titulo: "Recesso — Sexta-feira Santa", tipo: "escola" },
  { data: "2026-04-07", titulo: "Início do projeto Bichos que vivem perto", tipo: "projeto" },
  { data: "2026-04-19", titulo: "Dia dos Povos Indígenas", tipo: "data" },
  { data: "2026-04-22", titulo: "Dia da Terra", tipo: "data" },
  { data: "2026-04-30", titulo: "Entrega dos relatórios do bimestre", tipo: "escola" },
  { data: "2026-02-13", titulo: "Carnaval na escola", tipo: "evento" },
  { data: "2026-02-02", titulo: "Primeiro dia de aula", tipo: "escola" },
];

/* ------------------------------------------------------------ atividades */

export const atividades: Atividade[] = [
  {
    id: "a1",
    titulo: "Flutua ou afunda?",
    tema: "Água",
    campo: "Espaços, tempos, quantidades, relações e transformações",
    faixa: "4 a 5 anos",
    duracao: 30,
    espaco: "Sala",
    organizacao: "Pequenos grupos",
    materiais: ["Bacia com água", "Tampinhas", "Pedrinhas", "Folhas secas", "Cartaz"],
    objetivo: "Levantar hipóteses sobre o que flutua e o que afunda, observando e comparando.",
    objetivosBncc: [
      { codigo: "EI03ET01", texto: "Estabelecer relações de comparação entre objetos e suas propriedades." },
      { codigo: "EI03ET03", texto: "Identificar e selecionar fontes de informação para responder a questões." },
    ],
    passos: [
      "Reunir a turma em roda ao redor da bacia com água.",
      "Mostrar cada objeto e perguntar: vai boiar ou afundar?",
      "Testar um a um, em pequenos grupos de quatro crianças.",
      "Registrar no cartaz com carinhas de sim e não.",
      "Fechar perguntando o que surpreendeu.",
    ],
    adaptacoes: [
      "Para grupos agitados, dividir em dois momentos de 15 minutos.",
      "Crianças mais novas podem apenas manipular e observar.",
    ],
    observacaoProfessora: "Deixar toalha de pano por perto, sempre molha o chão.",
    tags: ["experimento", "água", "ciências"],
    criadaEm: "2026-03-09",
    origem: "minha",
    favorita: true,
  },
  {
    id: "a2",
    titulo: "Pintura com água colorida",
    tema: "Água",
    campo: "Traços, sons, cores e formas",
    faixa: "3 a 5 anos",
    duracao: 40,
    espaco: "Pátio",
    organizacao: "Pequenos grupos",
    materiais: ["Copos", "Tinta guache", "Pincéis", "Papel grosso"],
    objetivo: "Explorar misturas de cor e a diluição da tinta na água.",
    objetivosBncc: [
      { codigo: "EI03TS02", texto: "Expressar-se livremente por meio de desenho, pintura e modelagem." },
    ],
    passos: [
      "Preparar copos com água e um pouco de guache.",
      "Deixar as crianças misturarem e observarem as cores.",
      "Pintar livremente em papel grande.",
      "Expor as produções no varal da sala.",
    ],
    adaptacoes: ["Usar pincéis maiores para quem ainda tem pouca firmeza."],
    tags: ["arte", "água", "cores"],
    criadaEm: "2026-03-10",
    origem: "minha",
  },
  {
    id: "a3",
    titulo: "Caminho da água na sucata",
    tema: "Água",
    campo: "Espaços, tempos, quantidades, relações e transformações",
    faixa: "4 a 6 anos",
    duracao: 45,
    espaco: "Pátio",
    organizacao: "Pequenos grupos",
    materiais: ["Garrafas cortadas", "Mangueirinhas", "Fita adesiva", "Bacia", "Jarras"],
    objetivo: "Construir um percurso para a água correr e observar o movimento.",
    objetivosBncc: [
      { codigo: "EI03ET02", texto: "Observar e descrever mudanças em materiais causadas por fatores diversos." },
      { codigo: "EI03EO04", texto: "Comunicar suas ideias e sentimentos a pessoas e grupos diversos." },
    ],
    passos: [
      "Mostrar fotos de calhas e canos.",
      "Montar o percurso preso no muro, em pequenos grupos.",
      "Testar com jarrinhas de água e ajustar.",
      "Conversar sobre para onde a água vai depois.",
    ],
    adaptacoes: ["Se chover, montar dentro da sala sobre a bacia."],
    tags: ["projeto", "água", "construção"],
    criadaEm: "2026-03-11",
    origem: "minha",
    favorita: true,
  },
  {
    id: "a4",
    titulo: "Cuidar das plantas da escola",
    tema: "Natureza",
    campo: "O eu, o outro e o nós",
    faixa: "3 a 5 anos",
    duracao: 25,
    espaco: "Pátio",
    organizacao: "Duplas",
    materiais: ["Regadores", "Pazinhas"],
    objetivo: "Assumir pequenos cuidados coletivos com os espaços da escola.",
    objetivosBncc: [
      { codigo: "EI03EO03", texto: "Ampliar as relações interpessoais, desenvolvendo atitudes de participação e cooperação." },
    ],
    passos: [
      "Combinar quem rega cada canteiro.",
      "Observar a terra seca e molhada.",
      "Voltar para a sala e desenhar a planta escolhida.",
    ],
    adaptacoes: ["Fazer em duplas para quem está em adaptação."],
    tags: ["rotina", "natureza", "cuidado"],
    criadaEm: "2026-02-24",
    origem: "minha",
  },
  {
    id: "a5",
    titulo: "Meu nome, meu retrato",
    tema: "Identidade",
    campo: "O eu, o outro e o nós",
    faixa: "4 a 5 anos",
    duracao: 35,
    espaco: "Sala",
    organizacao: "Turma toda",
    materiais: ["Espelho", "Papel", "Giz de cera", "Crachás"],
    objetivo: "Reconhecer características próprias e escrever o próprio nome com apoio.",
    objetivosBncc: [
      { codigo: "EI03EO02", texto: "Agir de maneira independente, com confiança em suas capacidades." },
      { codigo: "EI03EF09", texto: "Levantar hipóteses sobre gêneros textuais, recorrendo a estratégias de observação." },
    ],
    passos: ["Observar o rosto no espelho.", "Desenhar o autorretrato.", "Copiar o nome do crachá embaixo do desenho."],
    adaptacoes: ["Oferecer crachá com letra maior para quem precisar."],
    tags: ["identidade", "escrita"],
    criadaEm: "2026-02-18",
    origem: "minha",
  },
  {
    id: "a6",
    titulo: "História cantada: chuva no telhado",
    tema: "Água",
    campo: "Escuta, fala, pensamento e imaginação",
    faixa: "3 a 4 anos",
    duracao: 20,
    espaco: "Sala",
    organizacao: "Turma toda",
    materiais: ["Caixa de som", "Lenços"],
    objetivo: "Ampliar repertório musical e brincar com sons da chuva.",
    objetivosBncc: [
      { codigo: "EI03TS03", texto: "Reconhecer as qualidades do som (intensidade, duração, altura e timbre)." },
    ],
    passos: ["Ouvir a música com os olhos fechados.", "Imitar o som da chuva com as mãos.", "Dançar com os lenços no fim."],
    adaptacoes: ["Reduzir o volume para crianças sensíveis a som (Elisa)."],
    tags: ["música", "água", "corpo"],
    criadaEm: "2026-03-05",
    origem: "minha",
  },
  {
    id: "a7",
    titulo: "Quanta água cabe aqui?",
    tema: "Água",
    campo: "Espaços, tempos, quantidades, relações e transformações",
    faixa: "4 a 5 anos",
    duracao: 30,
    espaco: "Pátio",
    organizacao: "Pequenos grupos",
    materiais: ["Copos de tamanhos diferentes", "Garrafas", "Funil", "Bacia"],
    objetivo: "Comparar quantidades usando recipientes diferentes.",
    objetivosBncc: [
      { codigo: "EI03ET07", texto: "Relacionar números às suas respectivas quantidades." },
    ],
    passos: [
      "Mostrar os recipientes e perguntar qual cabe mais água.",
      "Encher e comparar em duplas.",
      "Marcar com fita o resultado de cada um.",
    ],
    adaptacoes: ["Usar só dois recipientes para quem se dispersa."],
    tags: ["água", "matemática", "experimento"],
    criadaEm: "2026-03-12",
    origem: "escola",
  },
  {
    id: "a8",
    titulo: "Torneira que pinga: escuta e conta",
    tema: "Água",
    campo: "Escuta, fala, pensamento e imaginação",
    faixa: "4 anos",
    duracao: 20,
    espaco: "Sala",
    organizacao: "Turma toda",
    materiais: ["Copo", "Conta-gotas", "Cartaz"],
    objetivo: "Perceber o desperdício contando as gotas em um minuto.",
    objetivosBncc: [
      { codigo: "EI03ET07", texto: "Relacionar números às suas respectivas quantidades." },
      { codigo: "EI03EF01", texto: "Expressar ideias, desejos e sentimentos em distintas situações de interação." },
    ],
    passos: ["Pingar gotas em um copo enquanto a turma conta.", "Conversar: e se ficar pingando o dia todo?", "Desenhar o cartaz de lembrete da torneira."],
    adaptacoes: ["Contar até 10 e recomeçar com os menores."],
    tags: ["água", "consciência", "números"],
    criadaEm: "2026-03-13",
    origem: "escola",
  },
  {
    id: "a9",
    titulo: "Circuito das poças",
    tema: "Corpo",
    campo: "Corpo, gestos e movimentos",
    faixa: "3 a 5 anos",
    duracao: 25,
    espaco: "Pátio",
    organizacao: "Turma toda",
    materiais: ["Fita crepe", "Bambolês", "Cones"],
    objetivo: "Pular, desviar e equilibrar seguindo um percurso.",
    objetivosBncc: [
      { codigo: "EI03CG01", texto: "Criar movimentos, gestos e deslocamentos em brincadeiras e danças." },
    ],
    passos: ["Desenhar poças no chão com fita.", "Percorrer pulando de poça em poça.", "Criar novas regras com a turma."],
    adaptacoes: ["Reduzir a distância entre as poças."],
    tags: ["movimento", "água", "brincadeira"],
    criadaEm: "2026-03-04",
    origem: "minha",
  },
  {
    id: "a10",
    titulo: "Massinha caseira com a turma",
    tema: "Arte",
    campo: "Traços, sons, cores e formas",
    faixa: "3 a 5 anos",
    duracao: 40,
    espaco: "Sala",
    organizacao: "Pequenos grupos",
    materiais: ["Farinha", "Sal", "Água", "Corante", "Bacia"],
    objetivo: "Participar do preparo e explorar a modelagem.",
    objetivosBncc: [
      { codigo: "EI03TS02", texto: "Expressar-se livremente por meio de desenho, pintura e modelagem." },
    ],
    passos: ["Medir os ingredientes juntos.", "Misturar e sovar em grupos.", "Modelar livremente."],
    adaptacoes: ["Preparar a massa antes se o tempo estiver curto."],
    tags: ["arte", "receita", "sensorial"],
    criadaEm: "2026-02-26",
    origem: "minha",
    favorita: true,
  },
  {
    id: "a11",
    titulo: "Roda dos combinados",
    tema: "Convivência",
    campo: "O eu, o outro e o nós",
    faixa: "3 a 5 anos",
    duracao: 20,
    espaco: "Sala",
    organizacao: "Turma toda",
    materiais: ["Cartaz", "Fotos da turma"],
    objetivo: "Retomar acordos de convivência com apoio de imagens.",
    objetivosBncc: [
      { codigo: "EI03EO01", texto: "Demonstrar empatia pelos outros, percebendo modos de agir e sentir." },
    ],
    passos: ["Ler o cartaz com as imagens.", "Contar situações da semana.", "Escolher um combinado para cuidar."],
    adaptacoes: ["Usar fantoche para conduzir com os mais tímidos."],
    tags: ["convivência", "rotina"],
    criadaEm: "2026-02-10",
    origem: "minha",
  },
  {
    id: "a12",
    titulo: "Caça aos sons da escola",
    tema: "Escuta",
    campo: "Escuta, fala, pensamento e imaginação",
    faixa: "4 a 5 anos",
    duracao: 30,
    espaco: "Corredor",
    organizacao: "Pequenos grupos",
    materiais: ["Prancheta", "Papel", "Lápis"],
    objetivo: "Identificar e representar sons do ambiente.",
    objetivosBncc: [
      { codigo: "EI03EF01", texto: "Expressar ideias, desejos e sentimentos em distintas situações de interação." },
    ],
    passos: ["Caminhar em silêncio pela escola.", "Parar e escutar em três pontos.", "Desenhar o que ouviu."],
    adaptacoes: ["Fazer só dois pontos de escuta."],
    tags: ["escuta", "exploração"],
    criadaEm: "2026-03-02",
    origem: "escola",
  },
  {
    id: "a13",
    titulo: "Mural das famílias",
    tema: "Identidade",
    campo: "O eu, o outro e o nós",
    faixa: "4 a 5 anos",
    duracao: 35,
    espaco: "Sala",
    organizacao: "Individual",
    materiais: ["Fotos trazidas de casa", "Papel", "Cola"],
    objetivo: "Falar sobre a própria família e escutar a dos colegas.",
    objetivosBncc: [
      { codigo: "EI03EO04", texto: "Comunicar suas ideias e sentimentos a pessoas e grupos diversos." },
    ],
    passos: ["Cada criança apresenta sua foto.", "Colar no mural coletivo.", "Registrar uma frase ditada."],
    adaptacoes: ["Para quem não trouxe foto, desenhar a família."],
    tags: ["identidade", "família"],
    criadaEm: "2026-02-20",
    origem: "minha",
  },
  {
    id: "a14",
    titulo: "Experimento: gelo que vira água",
    tema: "Água",
    campo: "Espaços, tempos, quantidades, relações e transformações",
    faixa: "4 a 5 anos",
    duracao: 25,
    espaco: "Sala",
    organizacao: "Pequenos grupos",
    materiais: ["Cubos de gelo", "Potes", "Lupa"],
    objetivo: "Observar a transformação do gelo em água ao longo da manhã.",
    objetivosBncc: [
      { codigo: "EI03ET02", texto: "Observar e descrever mudanças em materiais causadas por fatores diversos." },
    ],
    passos: ["Colocar gelo em potes no sol e na sombra.", "Voltar a observar depois do parque.", "Comparar e conversar."],
    adaptacoes: ["Usar gelo maior para durar até a roda final."],
    tags: ["água", "experimento", "observação"],
    criadaEm: "2026-03-14",
    origem: "escola",
  },
  {
    id: "a15",
    titulo: "Dança das estações",
    tema: "Corpo",
    campo: "Corpo, gestos e movimentos",
    faixa: "3 a 5 anos",
    duracao: 20,
    espaco: "Sala",
    organizacao: "Turma toda",
    materiais: ["Caixa de som", "Fitas coloridas"],
    objetivo: "Movimentar-se seguindo mudanças de ritmo.",
    objetivosBncc: [
      { codigo: "EI03CG01", texto: "Criar movimentos, gestos e deslocamentos em brincadeiras e danças." },
    ],
    passos: ["Apresentar quatro músicas.", "Criar um movimento para cada estação.", "Fazer a sequência completa."],
    adaptacoes: ["Sentar e movimentar só os braços quando cansarem."],
    tags: ["música", "movimento"],
    criadaEm: "2026-03-16",
    origem: "minha",
  },
  {
    id: "a16",
    titulo: "Livro da chuva: recontando a história",
    tema: "Linguagem",
    campo: "Escuta, fala, pensamento e imaginação",
    faixa: "4 a 5 anos",
    duracao: 30,
    espaco: "Sala",
    organizacao: "Turma toda",
    materiais: ["Livro da sala", "Cartelas com cenas"],
    objetivo: "Recontar uma história na ordem, usando imagens de apoio.",
    objetivosBncc: [
      { codigo: "EI03EF04", texto: "Recontar histórias ouvidas e planejar coletivamente roteiros de faz de conta." },
    ],
    passos: ["Ler a história.", "Embaralhar as cartelas e reorganizar juntos.", "Recontar com as próprias palavras."],
    adaptacoes: ["Trabalhar com três cartelas apenas."],
    tags: ["linguagem", "leitura", "água"],
    criadaEm: "2026-03-06",
    origem: "minha",
  },
];

export const sugestaoAgua: Atividade = {
  id: "nova-agua",
  titulo: "A viagem da gotinha",
  tema: "Água",
  campo: "Espaços, tempos, quantidades, relações e transformações",
  faixa: "4 anos",
  duracao: 45,
  espaco: "Sala",
  organizacao: "Pequenos grupos",
  materiais: ["Bacia com água", "Copos plásticos", "Papel", "Giz de cera", "Caixa de som"],
  objetivo:
    "Perceber o caminho da água no dia a dia e conversar sobre formas simples de não desperdiçar.",
  objetivosBncc: [
    { codigo: "EI03ET02", texto: "Observar e descrever mudanças em materiais causadas por fatores diversos." },
    { codigo: "EI03EF01", texto: "Expressar ideias, desejos e sentimentos em distintas situações de interação." },
  ],
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
  criadaEm: HOJE_ISO,
  origem: "assistente",
};

/* ------------------------------------------------- semanas e rotina base */

const rotinaBase: { momento: Momento; titulo: string }[] = [
  { momento: "Acolhida", titulo: "Chamada com os crachás" },
  { momento: "Parque", titulo: "Parque e lanche" },
  { momento: "Roda final", titulo: "Roda final: o que descobrimos hoje" },
];

function semanaSlots(inicio: string, itens: Partial<Slot>[]): Slot[] {
  const base: Slot[] = [];
  diasUteis(inicio).forEach((data, i) => {
    rotinaBase.forEach((r, j) => {
      base.push({
        id: `r-${data}-${j}`,
        data,
        momento: r.momento,
        titulo: r.titulo,
        tipo: "rotina",
        status: parseISO(data) < parseISO(HOJE_ISO) ? "feito" : "planejado",
      });
    });
    void i;
  });
  itens.forEach((it, k) => {
    const data = it.data ?? inicio;
    const slot: Slot = {
      id: it.id ?? `p-${inicio}-${k}`,
      data,
      momento: it.momento ?? "Atividade principal",
      titulo: it.titulo ?? "",
      tipo: it.tipo ?? "atividade",
      status: it.status ?? (parseISO(data) < parseISO(HOJE_ISO) ? "feito" : "planejado"),
    };
    if (it.atividadeId) slot.atividadeId = it.atividadeId;
    if (it.nota) slot.nota = it.nota;
    base.push(slot);

  });
  return base;
}

export const slotsIniciais: Slot[] = [
  // Semana anterior: 9 a 13 de março
  ...semanaSlots("2026-03-09", [
    { data: "2026-03-09", momento: "Roda de conversa", titulo: "De onde vem a água?", tipo: "projeto" },
    { data: "2026-03-09", momento: "Atividade principal", titulo: "Caça aos sons da escola", atividadeId: "a12" },
    { data: "2026-03-10", momento: "Atividade principal", titulo: "Circuito das poças", atividadeId: "a9" },
    { data: "2026-03-11", momento: "Atividade principal", titulo: "Passeio ao parque do bairro", tipo: "evento" },
    { data: "2026-03-12", momento: "Atividade principal", titulo: "Cuidar das plantas da escola", atividadeId: "a4" },
    { data: "2026-03-13", momento: "Atividade principal", titulo: "Livro da chuva: recontando a história", atividadeId: "a16" },
  ]),
  // Semana atual: 16 a 20 de março
  ...semanaSlots("2026-03-16", [
    { data: "2026-03-16", momento: "Roda de conversa", titulo: "Abertura do projeto Água e vida", tipo: "projeto" },
    { data: "2026-03-16", momento: "Atividade principal", titulo: "Flutua ou afunda?", atividadeId: "a1" },
    { data: "2026-03-17", momento: "Roda de conversa", titulo: "História: A gotinha viajante", tipo: "rotina" },
    { data: "2026-03-17", momento: "Atividade principal", titulo: "Pintura com água colorida", atividadeId: "a2" },
    { data: "2026-03-18", momento: "Roda de conversa", titulo: "Conversa: banho e torneira", tipo: "rotina" },
    { data: "2026-03-18", momento: "Atividade principal", titulo: "Caminho da água na sucata", atividadeId: "a3", tipo: "projeto" },
    { data: "2026-03-19", momento: "Atividade principal", titulo: "Experimento: gelo que vira água", atividadeId: "a14" },
    { data: "2026-03-20", momento: "Roda de conversa", titulo: "Boas-vindas ao Dia da Água", tipo: "rotina" },
    { data: "2026-03-20", momento: "Roda final", titulo: "Apresentação no pátio (10h)", tipo: "evento", id: "ev-agua" },
  ]),
  // Próxima semana: 23 a 27 de março
  ...semanaSlots("2026-03-23", [
    { data: "2026-03-23", momento: "Atividade principal", titulo: "Quanta água cabe aqui?", atividadeId: "a7" },
    { data: "2026-03-24", momento: "Atividade principal", titulo: "Torneira que pinga: escuta e conta", atividadeId: "a8" },
    { data: "2026-03-25", momento: "Roda de conversa", titulo: "Preparar o que mostrar às famílias", tipo: "projeto" },
    { data: "2026-03-27", momento: "Atividade principal", titulo: "Dança das estações", atividadeId: "a15" },
  ]),
];

export const registrosIniciais: Registro[] = [
  {
    id: "rg1",
    atividadeId: "a1",
    humor: "otimo",
    duracaoReal: 35,
    engajamento: 5,
    comentario: "Todos quiseram testar. Vale repetir com objetos trazidos de casa.",
    data: "2026-03-16",
  },
  {
    id: "rg2",
    atividadeId: "a4",
    humor: "mais_ou_menos",
    duracaoReal: 20,
    engajamento: 3,
    comentario: "Faltou regador para todo mundo, formar duplas ajudou.",
    data: "2026-03-12",
  },
  {
    id: "rg3",
    atividadeId: "a9",
    humor: "otimo",
    duracaoReal: 30,
    engajamento: 5,
    comentario: "Pediram para repetir. Funciona bem antes do parque.",
    data: "2026-03-10",
  },
  {
    id: "rg4",
    atividadeId: "a12",
    humor: "dificil",
    duracaoReal: 18,
    engajamento: 2,
    comentario: "Muito barulho no corredor, a turma se dispersou. Tentar mais cedo.",
    data: "2026-03-09",
  },
  {
    id: "rg5",
    atividadeId: "a16",
    humor: "otimo",
    duracaoReal: 30,
    engajamento: 4,
    comentario: "As cartelas ajudaram muito. Lorenzo recontou sozinho.",
    data: "2026-03-13",
  },
  {
    id: "rg6",
    atividadeId: "a2",
    humor: "otimo",
    duracaoReal: 45,
    engajamento: 4,
    comentario: "Passou do tempo, mas valeu. Fazer no pátio foi acertado.",
    data: "2026-03-17",
  },
];

export const recados = [
  {
    id: "rc1",
    de: "Coordenação",
    texto: "Cada turma apresenta uma produção no Dia da Água, sexta às 10h no pátio.",
    data: "2026-03-16",
  },
  {
    id: "rc2",
    de: "Secretaria",
    texto: "Relatórios do bimestre devem ser entregues até 30 de abril.",
    data: "2026-03-13",
  },
];

export const temas = Array.from(new Set(atividades.map((a) => a.tema))).sort();

/* --------------------------------------------- folhas e modelo da escola */

export type TipoFolha = "colorir" | "ligar" | "contar" | "recortar" | "tracado" | "desenho";

export const tiposFolha: { id: TipoFolha; nome: string; descricao: string }[] = [
  { id: "colorir", nome: "Colorir", descricao: "Desenho grande em traço para pintar." },
  { id: "ligar", nome: "Ligar os pontos", descricao: "A criança liga os pares com um risco." },
  { id: "contar", nome: "Contar e marcar", descricao: "Contar figuras e marcar a quantidade." },
  { id: "recortar", nome: "Recortar e colar", descricao: "Linhas para recortar e montar." },
  { id: "tracado", nome: "Traçado", descricao: "Caminhos pontilhados para treinar o traço." },
  { id: "desenho", nome: "Desenho livre", descricao: "Um quadro grande para a criança desenhar." },
];

export type Folha = {
  tipo: TipoFolha;
  ilustracao: string;
  enunciado: string;
  recado?: string;
};

export type ModeloEscola = {
  escola: string;
  marcaDagua: string;
  mostrarNome: boolean;
  mostrarTurma: boolean;
  mostrarData: boolean;
  cor: "agua" | "sol" | "folha" | "coral";
  rodape: string;
  logoTexto: string;
};

export const modeloEscolaInicial: ModeloEscola = {
  escola: "EMEI Vila das Flores",
  marcaDagua: "EMEI VILA DAS FLORES",
  mostrarNome: true,
  mostrarTurma: true,
  mostrarData: true,
  cor: "agua",
  rodape: "Educação Infantil · Pré-escola I · Prof.ª Ana Lúcia",
  logoTexto: "VF",
};

/* ------------------------------------------------------------- materiais */

export type ItemMaterial = {
  id: string;
  nome: string;
  status: "tenho" | "preciso" | "comprado";
  nota?: string;
};

export const materiaisIniciais: ItemMaterial[] = [
  { id: "m1", nome: "Papel e giz de cera", status: "tenho" },
  { id: "m2", nome: "Tinta guache", status: "tenho" },
  { id: "m3", nome: "Copos e bacias plásticas", status: "tenho" },
  { id: "m4", nome: "Sucata (garrafas, tampinhas)", status: "tenho", nota: "Pedir ajuda das famílias" },
  { id: "m5", nome: "Caixa de som", status: "tenho" },
  { id: "m6", nome: "Massinha caseira", status: "tenho" },
  { id: "m7", nome: "Cola colorida", status: "preciso", nota: "Pedir na secretaria" },
  { id: "m8", nome: "Papel crepom", status: "preciso" },
  { id: "m9", nome: "Regadores e pazinhas", status: "tenho" },
];
