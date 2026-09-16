# Planeja — assistente de planejamento para Educação Infantil

Protótipo navegável, só frontend, com dados fictícios de uma professora da pré-escola (turma de 4 anos). Sem backend, sem login: o app abre já "dentro" do sistema.

## Persona e dados fictícios

- Professora Ana Lúcia, Turma Girassol, 18 crianças de 4 anos, período da manhã.
- Escola com projeto anual "Cuidar do nosso mundo"; projeto do mês: "Água e vida".
- Data simulada: semana do Dia da Água (22 de março).

## Telas

1. **Início (Hoje)** — saudação, data de hoje, faixa da semana, cards de "Atividades de hoje", "Pendências" (inclui: atividade do Dia da Água ainda não preparada) e "Datas importantes".
2. **Planejamento** — três abas conectadas: Anual (objetivos por bimestre e projetos), Mensal (temas e datas do mês), Semanal (grade dias × momentos do dia, com arrastar/soltar simplificado ou botão "adicionar atividade").
3. **Calendário** — visão mensal visual com eventos, projetos e datas comemorativas coloridos; clicar num dia abre o resumo.
4. **Atividades (Biblioteca)** — cards de atividades já criadas, com busca e filtros simples (faixa etária, duração, materiais, campo de experiência da BNCC).
5. **Criar atividade** — antes de criar, o sistema mostra "atividades parecidas que você já tem"; depois um formulário curto (tema, faixa etária, duração, materiais, objetivo) que gera uma proposta editável.
6. **Atividade pronta** — página de detalhe com objetivo, materiais, passo a passo, adaptações e botão Imprimir (layout de impressão limpo).
7. **Assistente** — conversa dentro do sistema (não tela cheia de chatbot): sugestões rápidas em botões, respostas com cartão de atividade e ação "Salvar no planejamento".
8. **Meu perfil** — perfil pedagógico (estilo, preferências, materiais disponíveis) e contexto da turma (idade, número de crianças, particularidades).
9. **Como foi?** — registro rápido após a atividade: carinhas (funcionou bem / mais ou menos / não engajou), tempo real e um comentário; alimenta o texto "sugestões melhoram com seus registros".

## Fluxo demonstrativo do Dia da Água

Início mostra pendência "Dia da Água — sem atividade preparada" → botão "Pedir ajuda ao assistente" → conversa já iniciada com contexto da turma → assistente sugere "Viagem da gotinha" (experimento + roda de conversa) → professora clica em "Adaptar": reduzir para 30 minutos e usar só materiais disponíveis → proposta atualizada → "Salvar na sexta-feira, período da manhã" → volta ao planejamento semanal com a atividade no lugar e a pendência resolvida.

## Direção visual

Moderno, leve e acolhedor sem infantilizar: fundo claro quente, uma cor principal calma com acentos por tipo de item (projeto, data comemorativa, atividade), cantos arredondados, cards com bastante respiro, tipografia grande e legível, ícones claros e textos curtos. Navegação inferior no celular e lateral simples no computador. Máximo 5 itens de menu.

## Detalhes técnicos

- TanStack Start + React + Tailwind v4; tokens semânticos em `src/styles.css` (nada de cores fixas nos componentes).
- Rotas: `/` (Hoje), `/planejamento`, `/calendario`, `/atividades`, `/atividades/$id`, `/atividades/nova`, `/assistente`, `/perfil`.
- Dados mockados em `src/data/*.ts`; estado das interações (salvar atividade, registrar "como foi") em um store em memória via React context, para que o fluxo do Dia da Água realmente atualize as outras telas durante a sessão.
- Assistente com respostas roteirizadas (sem IA), reconhecendo o cenário da água e as adaptações de tempo/materiais.
- Impressão via CSS `@media print`.
- `head()` próprio em cada rota com título e descrição.
