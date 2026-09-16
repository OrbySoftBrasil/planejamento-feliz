# Planeja — planejamento editável, atividades ilustradas e assistente livre

Quatro frentes, todas dentro do protótipo sem backend (dados no próprio navegador).

## 1. Criar e editar o planejamento (ano, mês, semana)

Hoje o plano anual e os planos mensais são texto fixo. Passam a ser editáveis:

- **Ano**: nova tela do plano anual com o projeto do ano (título, intenção, o que a turma vai viver), e os 4 bimestres. Cada bloco pode ser editado, ter foco adicionado/removido e virar um mês.
- **Mês**: cada mês tem tema, objetivos, datas importantes e atividades ligadas. Botões "Editar mês", "Novo mês" e "Duplicar do mês anterior".
- **Semana**: já é editável; ganha "Criar semana a partir do mês" (puxa tema e sugestões do mês) e "Copiar semana passada".
- Tudo salvo automaticamente, com aviso "Salvo" e opção de desfazer a última alteração.

## 2. Lista de materiais

Nova tela **Materiais** (acessível pela semana e pelo perfil):

- Materiais da semana, juntados automaticamente das atividades planejadas, com caixinhas de "já tenho / preciso pedir".
- Lista de materiais em falta editável (adicionar, marcar como resolvido, excluir).
- Dentro de cada atividade, a lista de materiais também passa a ser editável (adicionar/remover/renomear item).
- Botão para baixar a lista de compras da semana.

## 3. Atividades ilustradas, com modelo da escola e download

- **Modelo da escola** (configurado no perfil): nome da escola, marca d'água, logo, campos de "Nome", "Turma" e "Data", cor da borda e rodapé. Fica salvo e vale para todas as folhas.
- **Folha de atividade ilustrada**: cada atividade impressa vira uma folha A4 com ilustração em traço (para colorir/recortar/ligar), enunciado em letra grande, espaço da criança e o modelo da escola aplicado.
- **Baixar**: botões "Baixar PDF" e "Baixar imagem", além de imprimir. Pré-visualização da folha antes de baixar.
- **Nova criação de atividade**: o fluxo muda de "3 passos de formulário" para escolha do **tipo de folha** primeiro — colorir, ligar pontos, contar, recortar e colar, traçado, desenho livre — depois tema e ajustes, com a folha se montando ao vivo ao lado. No fim: salvar na biblioteca, agendar e baixar.
- Um conjunto de ilustrações em traço (água, gotinha, plantas, animais, corpo, formas) é gerado e usado nas folhas.

## 4. Assistente estilo "ChatGPT mais simples"

- Campo de texto livre de verdade: a professora escreve o que quiser e recebe resposta.
- Respostas em texto formatado, escritas aos poucos (como digitando), com histórico da conversa guardado.
- Conversas anteriores em uma lista lateral simples, com "Nova conversa".
- Sugestões de início ("Preciso de uma atividade para sexta", "Me ajuda com o plano de abril") e, quando a resposta traz uma atividade, aparece o cartão com "Salvar no planejamento" e "Baixar folha".
- Continua sem serviço externo: as respostas vêm de um conjunto amplo de respostas montadas por palavra-chave e pelo contexto real da turma e do planejamento.

## Detalhes técnicos

- Plano anual, planos mensais, materiais e modelo da escola migram de `src/data/mock.ts` para o estado persistido em `planner-store` (nova versão de chave, com migração do estado antigo).
- Novas rotas: `/planejamento/ano`, `/planejamento/mes/$id`, `/materiais`, `/atividades/$id/folha`.
- Folha A4 renderizada em HTML/SVG; download via `html-to-image` + `jspdf` (PNG e PDF), impressão mantida por CSS.
- Ilustrações geradas como PNG em traço preto sobre fundo transparente, guardadas em `src/assets/ilustracoes/`.
- Assistente: motor local em `src/lib/assistente.ts` (intenções por palavra-chave + contexto do store), conversas persistidas por thread.
