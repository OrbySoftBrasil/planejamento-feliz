import { sugestaoAgua, type Atividade } from "@/data/mock";

export type Contexto = {
  professora: string;
  turma: string;
  criancas: number;
  idade: string;
  temaMes?: string;
  focosMes: string[];
  diasSemAtividade: { data: string; rotulo: string }[];
  materiaisFaltando: string[];
  proximosEventos: { data: string; titulo: string }[];
  particularidades: string;
};

export type Resposta = { texto: string; sugestao?: Atividade };

const tem = (t: string, ...palavras: string[]) => palavras.some((p) => t.includes(p));

export const sugestoesIniciais = [
  "Preciso de uma atividade para sexta",
  "O que eu faço no Dia da Água?",
  "Me ajuda a montar o plano do mês que vem",
  "Uma ideia curta para um grupo agitado",
  "O que preciso separar de material esta semana?",
];

export function responder(pergunta: string, ctx: Contexto): Resposta {
  const t = pergunta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const vazio = ctx.diasSemAtividade[0];

  if (tem(t, "oi", "ola", "bom dia", "boa tarde", "tudo bem") && t.length < 25) {
    return {
      texto: `Oi, ${ctx.professora}! 👋\n\nEstou aqui para ajudar com o planejamento da ${ctx.turma}.\n\nPosso:\n\n- sugerir uma atividade para um dia específico\n- adaptar algo que você já tem\n- ajudar a escrever o plano do mês\n- montar uma folha ilustrada para as crianças\n\nO que você quer resolver agora?`,
    };
  }

  if (tem(t, "agua", "gotinha", "22 de marco", "dia da agua")) {
    return {
      sugestao: sugestaoAgua,
      texto: `Boa! O **Dia da Água** cai na sexta e o projeto do mês é **${ctx.temaMes ?? "Água e vida"}**.\n\nPensei em **A viagem da gotinha**, que junta história, experimento e desenho, em 45 minutos:\n\n1. História da gotinha que sai da nuvem e chega na torneira\n2. Roda: onde usamos água hoje?\n3. Experimento em pequenos grupos com copos\n4. Cada criança desenha um lugar onde a água aparece\n\nTudo com material que você já tem. Quer que eu deixe mais curta, simplifique o material ou já salve na sexta-feira?`,
    };
  }

  if (tem(t, "atividade", "ideia", "sugest", "proposta", "brincadeira")) {
    const curta = tem(t, "curta", "rapid", "15", "20 min", "pouco tempo");
    const agitado = tem(t, "agitad", "bagunc", "inquiet", "depois do parque");
    const base = { ...sugestaoAgua };
    if (curta) {
      base.duracao = 25;
      base.passos = base.passos.slice(0, 3);
    }
    if (agitado) {
      base.organizacao = "Pequenos grupos";
      base.adaptacoes = [
        "Começar sentados no tapete, com a luz mais baixa.",
        "Dividir em três grupos com um combinado antes de distribuir o material.",
        ...base.adaptacoes,
      ];
    }
    return {
      sugestao: base,
      texto: `Vamos lá. Considerando a ${ctx.turma} (${ctx.criancas} crianças de ${ctx.idade})${
        ctx.temaMes ? ` e o tema do mês, **${ctx.temaMes}**` : ""
      }${curta ? ", em versão curta" : ""}${agitado ? ", pensada para um grupo agitado" : ""}:\n\n${
        base.titulo
      } — ${base.duracao} minutos, ${base.organizacao.toLowerCase()}.\n\n${base.objetivo}\n\n${
        vazio ? `Vi que **${vazio.rotulo}** está sem atividade principal. Quer que eu salve lá?` : "Quer que eu salve no planejamento?"
      }`,
    };
  }

  if (tem(t, "material", "materiais", "comprar", "falta")) {
    return {
      texto: `Sobre materiais:\n\n${
        ctx.materiaisFaltando.length
          ? `Na sua lista está faltando: **${ctx.materiaisFaltando.join(", ")}**. Enquanto isso, evito sugerir propostas que dependam disso.`
          : "Sua lista está em dia, nada marcado como faltando."
      }\n\nVocê pode abrir a tela **Materiais** para marcar o que já tem, anotar o que precisa pedir e baixar a lista da semana para levar à secretaria.`,
    };
  }

  if (tem(t, "plano do mes", "mes que vem", "planejamento mensal", "proximo mes", "abril", "maio")) {
    return {
      texto: `Posso ajudar a montar o mês. Um caminho simples:\n\n1. **Tema**: uma pergunta que a turma investiga o mês todo (ex.: "de onde vêm os bichos que aparecem no pátio?")\n2. **3 ou 4 focos**: o que vocês vão explorar por semana\n3. **Campos de experiência** que ficam em evidência\n4. **Como o mês termina**: uma mostra, um mural, um livro da turma\n\nSe quiser seguir o fio do projeto do ano, o mês atual é **${
        ctx.temaMes ?? "—"
      }**${ctx.focosMes.length ? `, com foco em ${ctx.focosMes.slice(0, 2).join(" e ").toLowerCase()}` : ""}.\n\nAbra **Planejamento → Mês → Montar o próximo mês** que eu já deixo os campos prontos para você escrever.`,
    };
  }

  if (tem(t, "plano do ano", "anual", "bimestre", "projeto do ano")) {
    return {
      texto: `O plano do ano é o fio que segura tudo. Em **Planejamento → Ano → Criar e editar o plano do ano** você escreve:\n\n- o projeto do ano e a intenção em uma frase\n- o tema de cada bimestre\n- os objetivos e os projetos ligados a ele\n\nDica: escreva objetivos que dê para observar na prática, tipo "reconhecer o próprio nome" em vez de "desenvolver a linguagem".`,
    };
  }

  if (tem(t, "semana", "sexta", "segunda", "terca", "quarta", "quinta", "vazio", "buraco")) {
    return {
      texto: vazio
        ? `Olhei sua semana. **${vazio.rotulo}** está sem atividade principal.\n\nQuer que eu proponha algo ligado a **${
            ctx.temaMes ?? "seu projeto"
          }** para esse dia? Posso já deixar salvo e com a folha ilustrada pronta para imprimir.`
        : `Sua semana está completa: todos os dias têm atividade principal. 🎉\n\nSe quiser, posso revisar o equilíbrio entre os campos de experiência ou sugerir uma troca para deixar algum dia mais leve.`,
    };
  }

  if (tem(t, "folha", "imprimir", "baixar", "pdf", "ilustra", "colorir", "desenho")) {
    return {
      texto: `Toda atividade tem uma **folha ilustrada**.\n\nAbra a atividade e toque em "Folha ilustrada e download". Lá você escolhe o tipo (colorir, ligar, contar, recortar, traçado ou desenho livre), a ilustração e o enunciado.\n\nA folha já sai com o modelo da sua escola: marca d'água, logo, campo de nome, turma e data. Dá para **baixar em PDF ou imagem** e também imprimir.`,
    };
  }

  if (tem(t, "relatorio", "registro", "familia", "reuniao", "portfolio", "avalia")) {
    return {
      texto: `Para relatórios e reuniões, use os **registros**: depois de cada atividade, toque em "Como foi?" e deixe uma linha sobre o que funcionou.\n\nNa hora de escrever o relatório, você tem em mãos:\n\n- o que a turma fez, dia a dia\n- o engajamento de cada proposta\n- suas anotações sobre crianças específicas\n\nIsso vira texto quase pronto e economiza a noite de domingo.`,
    };
  }

  if (tem(t, "adaptar", "adaptacao", "inclus", "autis", "deficien", "miguel", "choro", "adaptacao")) {
    return {
      texto: `Sobre adaptação, vale lembrar do seu contexto: ${ctx.particularidades}\n\nAlgumas saídas que costumam funcionar:\n\n- combinar a proposta antes, com uma imagem ou gesto\n- oferecer um lugar mais calmo para quem precisa de pausa\n- reduzir o número de materiais na mesa\n- fazer em pequenos grupos, revezando com uma brincadeira livre\n\nMe diga qual atividade você quer adaptar que eu reescrevo os passos.`,
    };
  }

  if (tem(t, "obrigad", "valeu", "perfeito", "otimo")) {
    return { texto: "Que bom! 💛 Estou por aqui quando precisar de mais alguma coisa." };
  }

  return {
    texto: `Entendi: "${pergunta}".\n\nAinda estou aprendendo, então funciono melhor quando você me pede algo do dia a dia, como:\n\n- "uma atividade de 20 minutos sobre água"\n- "o que faço na sexta?"\n- "me ajuda com o plano de abril"\n- "quais materiais preciso separar?"\n\n${
      vazio ? `Ah, e reparei que **${vazio.rotulo}** está sem atividade principal.` : ""
    }`,
  };
}
