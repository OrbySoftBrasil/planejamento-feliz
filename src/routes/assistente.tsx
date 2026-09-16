import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Clock, Info, MapPin, Printer, Send, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AgendarDialog } from "@/components/AgendarDialog";
import {
  campoCurto,
  formatarLongo,
  planosMensais,
  professora,
  sugestaoAgua,
  type Atividade,
} from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/assistente")({
  validateSearch: (search: Record<string, unknown>) => ({
    tema: typeof search["tema"] === "string" ? (search["tema"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Assistente de planejamento · Planeja" },
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Assistente,
});

type Mensagem = {
  id: number;
  autor: "assistente" | "professora";
  texto: string;
  cartao?: Atividade;
  nota?: string;
};

const DATA_AGUA = "2026-03-20";
let contador = 0;
const proximoId = () => ++contador;

function Assistente() {
  const { tema } = Route.useSearch();
  const navigate = useNavigate();
  const { salvarAtividade } = usePlanner();
  const contextoAgua = tema === "agua";
  const projeto = planosMensais.find((p) => p.mes === 3);

  const [proposta, setProposta] = useState<Atividade>(sugestaoAgua);
  const [etapa, setEtapa] = useState<"inicio" | "proposta" | "salva">("inicio");
  const [feitas, setFeitas] = useState<string[]>([]);
  const [digitando, setDigitando] = useState(false);
  const [texto, setTexto] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: proximoId(),
      autor: "assistente",
      texto: contextoAgua
        ? `Oi, ${professora.nome}! Olhei sua semana: a sexta-feira (Dia da Água) está sem atividade principal. Quer que eu sugira uma proposta para as 18 crianças de 4 anos?`
        : `Oi, ${professora.nome}! Posso sugerir uma atividade, adaptar uma que você já tem ou olhar a sua semana. Por onde começamos?`,
      nota: contextoAgua ? "Considerei o projeto do mês e os materiais da sua sala" : undefined,
    },
  ]);
  const fim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensagens, digitando]);

  function conversar(daProfessora: string, resposta: Omit<Mensagem, "id" | "autor">) {
    setMensagens((m) => [...m, { id: proximoId(), autor: "professora", texto: daProfessora }]);
    setDigitando(true);
    window.setTimeout(() => {
      setDigitando(false);
      setMensagens((m) => [...m, { id: proximoId(), autor: "assistente", ...resposta }]);
    }, 750);
  }

  function marcar(acao: string) {
    setFeitas((f) => [...f, acao]);
  }

  function sugerir() {
    setEtapa("proposta");
    conversar("Sim, por favor. Preciso de algo para o Dia da Água.", {
      texto: `Pensei nesta proposta, seguindo o projeto "${projeto?.titulo ?? "Água e vida"}" e usando só materiais que você já tem na sala:`,
      cartao: sugestaoAgua,
      nota: "Se quiser, eu encurto, troco os materiais ou deixo mais tranquila.",
    });
  }

  function encurtar() {
    marcar("curta");
    const nova: Atividade = {
      ...proposta,
      duracao: 30,
      passos: proposta.passos.filter((_, i) => i !== 4),
      adaptacoes: [...proposta.adaptacoes, "Versão de 30 minutos: o mural fica para a semana seguinte."],
    };
    setProposta(nova);
    conversar("Pode deixar em 30 minutos?", {
      texto: "Claro. Tirei a montagem do mural e ajustei o fechamento. Ficou em 30 minutos:",
      cartao: nova,
    });
  }

  function simplificarMateriais() {
    marcar("materiais");
    const nova: Atividade = {
      ...proposta,
      materiais: ["Bacia com água", "Copos plásticos", "Papel sulfite", "Giz de cera"],
    };
    setProposta(nova);
    conversar("Estou sem caixa de som nessa sexta.", {
      texto: "Sem problema: troquei a música por uma história contada por você. Materiais atualizados:",
      cartao: nova,
    });
  }

  function acalmar() {
    marcar("calma");
    const nova: Atividade = {
      ...proposta,
      organizacao: "Pequenos grupos",
      adaptacoes: [
        ...proposta.adaptacoes,
        "Miguel e Théo podem começar observando de perto, sem precisar mexer na água.",
      ],
    };
    setProposta(nova);
    conversar("Tenho duas crianças que se agitam com água.", {
      texto:
        "Deixei em pequenos grupos, com rodízio de 8 minutos, e incluí uma adaptação para o Miguel e o Théo começarem observando.",
      cartao: nova,
    });
  }

  return (
    <AppShell titulo="Assistente" subtitulo={`${professora.turma} · ${professora.idade} · ${professora.periodo}`}>
      <div className="space-y-4">
        <div className="no-print flex items-start gap-2 rounded-2xl border border-border bg-agua-suave/60 p-3.5 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            O assistente já conhece a sua turma, a rotina, o projeto do mês e as atividades que você guardou.
            Nada é salvo sem você confirmar.
          </p>
        </div>

        {mensagens.map((m) => (
          <div key={m.id} className={m.autor === "professora" ? "flex justify-end" : ""}>
            <div className={m.autor === "professora" ? "max-w-[85%]" : "w-full"}>
              {m.autor === "assistente" ? (
                <div className="flex items-start gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 pt-1">
                    <p className="text-[0.98rem] leading-relaxed">{m.texto}</p>
                    {m.nota ? <p className="mt-1 text-xs text-muted-foreground">{m.nota}</p> : null}
                  </div>
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

        {digitando ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            escrevendo...
          </div>
        ) : null}

        <div className="no-print flex flex-wrap gap-2 pt-2">
          {etapa === "inicio" ? (
            <>
              <Acao onClick={sugerir}>
                {contextoAgua ? "Sugerir atividade para o Dia da Água" : "Preciso de uma atividade nova"}
              </Acao>
              <Link
                to="/atividades"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                Buscar no que já criei
              </Link>
            </>
          ) : null}
          {etapa !== "inicio" ? (
            <>
              {!feitas.includes("curta") ? <Acao onClick={encurtar}>Deixar mais curta (30 min)</Acao> : null}
              {!feitas.includes("materiais") ? (
                <Acao onClick={simplificarMateriais}>Usar só o que eu tenho</Acao>
              ) : null}
              {!feitas.includes("calma") ? (
                <Acao onClick={acalmar}>Adaptar para crianças mais agitadas</Acao>
              ) : null}
              <Acao onClick={() => setSalvando(true)} destaque>
                Salvar no planejamento
              </Acao>
            </>
          ) : null}
        </div>

        <div ref={fim} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!texto.trim()) return;
            conversar(texto, {
              texto:
                etapa === "inicio"
                  ? "Posso montar uma proposta a partir disso. Toque em uma das opções acima que eu preparo."
                  : "Anotei! Posso ajustar o tempo, os materiais, a organização da turma ou salvar no planejamento.",
            });
            setTexto("");
          }}
          className="no-print sticky bottom-20 flex items-center gap-2 rounded-2xl border border-border bg-card p-2 lg:bottom-4"
        >
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva para o assistente..."
            className="w-full bg-transparent px-3 py-2 text-base outline-none"
          />
          <button
            type="submit"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"
            aria-label="Enviar"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      <AgendarDialog
        atividade={proposta}
        aberto={salvando}
        onFechar={() => setSalvando(false)}
        dataSugerida={DATA_AGUA}
      />
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
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {atividade.duracao} min
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {atividade.organizacao}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {atividade.espaco}
        </span>
        <span>{campoCurto[atividade.campo]}</span>
      </div>
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
      {atividade.adaptacoes.length ? (
        <details className="mt-3 rounded-xl bg-background p-3 text-sm">
          <summary className="cursor-pointer font-medium">Adaptações ({atividade.adaptacoes.length})</summary>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            {atividade.adaptacoes.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
