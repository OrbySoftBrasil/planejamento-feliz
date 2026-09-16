import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { professora, sugestaoAgua, type Atividade } from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/assistente")({
  validateSearch: (search: Record<string, unknown>) => ({
    tema: typeof search.tema === "string" ? search.tema : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Assistente de planejamento da professora · Planeja" },
      {
        name: "description",
        content:
          "Converse para planejar, adaptar uma atividade à sua turma e salvar direto no planejamento da semana.",
      },
      { property: "og:title", content: "Assistente · Planeja" },
      {
        property: "og:description",
        content: "Peça ajuda, adapte a atividade e salve no planejamento em poucos toques.",
      },
    ],
  }),
  component: Assistente,
});

type Mensagem = {
  autor: "assistente" | "professora";
  texto: string;
  cartao?: Atividade;
};

function Assistente() {
  const { tema } = Route.useSearch();
  const { salvarAtividade, agendar } = usePlanner();
  const navigate = useNavigate();
  const contextoAgua = tema === "agua";

  const [proposta, setProposta] = useState<Atividade>(sugestaoAgua);
  const [sugeriu, setSugeriu] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [texto, setTexto] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      autor: "assistente",
      texto: contextoAgua
        ? `Oi, ${professora.nome}! Vi que a sexta-feira (Dia da Água) está sem atividade principal para a ${professora.turma}. Quer que eu sugira uma proposta para 18 crianças de 4 anos?`
        : `Oi, ${professora.nome}! Posso ajudar a planejar a semana, adaptar uma atividade ou encontrar algo que você já criou. Por onde começamos?`,
    },
  ]);

  function responder(msgProfessora: string, resposta: Mensagem) {
    setMensagens((m) => [...m, { autor: "professora", texto: msgProfessora }, resposta]);
  }

  function sugerir() {
    setSugeriu(true);
    responder("Sim, por favor. Preciso de algo para o Dia da Água.", {
      autor: "assistente",
      texto:
        "Pensei nesta proposta, seguindo o projeto Água e vida e usando só materiais que você tem na sala:",
      cartao: sugestaoAgua,
    });
  }

  function encurtar() {
    const nova = {
      ...proposta,
      duracao: 30,
      passos: proposta.passos.filter((_, i) => i !== 4),
      adaptacoes: [...proposta.adaptacoes, "Versão de 30 minutos: o mural fica para a semana seguinte."],
    };
    setProposta(nova);
    responder("Pode deixar em 30 minutos?", {
      autor: "assistente",
      texto: "Claro. Tirei a montagem do mural e ajustei para 30 minutos. Ficou assim:",
      cartao: nova,
    });
  }

  function simplificarMateriais() {
    const nova = {
      ...proposta,
      materiais: ["Bacia com água", "Copos plásticos", "Papel", "Giz de cera"],
    };
    setProposta(nova);
    responder("Estou sem caixa de som nessa sexta.", {
      autor: "assistente",
      texto: "Sem problema: troquei a música por uma história contada por você. Materiais atualizados:",
      cartao: nova,
    });
  }

  function salvar() {
    const nova = salvarAtividade(proposta);
    agendar({ atividade: nova, dia: "Sexta", momento: "Atividade principal" });
    setSalvando(false);
    setMensagens((m) => [
      ...m,
      { autor: "professora", texto: "Salvar na sexta-feira, atividade principal." },
      {
        autor: "assistente",
        texto:
          "Pronto! A atividade está no planejamento de sexta-feira e também na sua biblioteca. Quer que eu prepare a versão para imprimir?",
      },
    ]);
    toast.success("Atividade salva no planejamento de sexta-feira");
    navigate({ to: "/atividades/$id", params: { id: nova.id } });
  }

  return (
    <AppShell titulo="Assistente" subtitulo={`${professora.turma} · ${professora.idade}`}>
      <div className="space-y-4">
        {mensagens.map((m, i) => (
          <div key={i} className={m.autor === "professora" ? "flex justify-end" : ""}>
            <div className={m.autor === "professora" ? "max-w-[85%]" : "w-full"}>
              {m.autor === "assistente" ? (
                <div className="flex items-start gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <p className="min-w-0 pt-1 text-[0.98rem] leading-relaxed">{m.texto}</p>
                </div>
              ) : (
                <p className="rounded-2xl bg-primary px-4 py-2.5 text-[0.95rem] text-primary-foreground">
                  {m.texto}
                </p>
              )}
              {m.cartao ? <CartaoProposta atividade={m.cartao} /> : null}
            </div>
          </div>
        ))}

        <div className="no-print flex flex-wrap gap-2 pt-2">
          {!sugeriu && contextoAgua ? (
            <Acao onClick={sugerir}>Sugerir atividade para o Dia da Água</Acao>
          ) : null}
          {sugeriu ? (
            <>
              <Acao onClick={encurtar}>Deixar mais curta (30 min)</Acao>
              <Acao onClick={simplificarMateriais}>Usar só o que eu tenho</Acao>
              <Acao onClick={() => setSalvando(true)} destaque>
                Salvar no planejamento
              </Acao>
            </>
          ) : null}
          {!contextoAgua && !sugeriu ? (
            <>
              <Acao onClick={sugerir}>Preciso de uma atividade nova</Acao>
              <Link
                to="/atividades"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                Buscar no que já criei
              </Link>
            </>
          ) : null}
        </div>

        <div className="no-print sticky bottom-20 flex items-center gap-2 rounded-2xl border border-border bg-card p-2 lg:bottom-4">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva para o assistente..."
            className="w-full bg-transparent px-3 py-2 text-base outline-none"
          />
          <button
            onClick={() => {
              if (!texto.trim()) return;
              responder(texto, {
                autor: "assistente",
                texto: sugeriu
                  ? "Anotei! Posso ajustar o tempo, os materiais ou salvar no planejamento — é só tocar em uma das opções acima."
                  : "Posso sugerir uma atividade a partir disso. Toque em “Preciso de uma atividade nova” que eu preparo uma proposta.",
              });
              setTexto("");
            }}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"
            aria-label="Enviar"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {salvando ? (
        <div className="no-print fixed inset-0 z-30 flex items-end justify-center bg-foreground/30 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-card p-5">
            <h2 className="font-display text-xl font-semibold">Salvar onde?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sugestão: sexta-feira, atividade principal.</p>
            <div className="mt-4 rounded-xl bg-background p-3 text-sm">
              <p className="font-medium">{proposta.titulo}</p>
              <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" /> {proposta.duracao} minutos
              </p>
            </div>
            <button
              onClick={salvar}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
            >
              <Check className="h-4 w-4" /> Salvar na sexta-feira
            </button>
            <button
              onClick={() => setSalvando(false)}
              className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground"
            >
              Agora não
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

function Acao({
  children,
  onClick,
  destaque,
}: {
  children: React.ReactNode;
  onClick: () => void;
  destaque?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        destaque ? "bg-primary text-primary-foreground" : "border border-border bg-card"
      }`}
    >
      {children}
    </button>
  );
}

function CartaoProposta({ atividade }: { atividade: Atividade }) {
  return (
    <div className="ml-10 mt-3 rounded-2xl border border-border bg-card p-4">
      <h3 className="font-display text-lg font-semibold">{atividade.titulo}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{atividade.objetivo}</p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" /> {atividade.duracao} min · {atividade.faixa}
      </p>
      <ol className="mt-3 space-y-1.5 text-sm">
        {atividade.passos.map((p, i) => (
          <li key={p} className="flex gap-2">
            <span className="text-muted-foreground">{i + 1}.</span>
            {p}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {atividade.materiais.map((m) => (
          <span key={m} className="rounded-full bg-folha-suave px-2.5 py-1 text-xs">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
