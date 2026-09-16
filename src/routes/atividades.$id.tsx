import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarPlus,
  Clock,
  Download,
  Plus,
  X,
  MapPin,
  Printer,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AgendarDialog } from "@/components/AgendarDialog";
import { ActivityCard } from "@/components/ActivityCard";
import {
  HOJE_ISO,
  campoCurto,
  formatarCurto,
  momentoHorario,
  nomeDia,
  professora,
} from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";
import { corDoCampo } from "@/lib/ui";

export const Route = createFileRoute("/atividades/$id")({
  head: () => ({
    meta: [
      { title: "Atividade pronta · Planeja" },
      {
        name: "description",
        content: "Passo a passo, materiais, adaptações e histórico de uso da atividade, pronta para imprimir.",
      },
      { property: "og:title", content: "Atividade pronta · Planeja" },
      { property: "og:description", content: "Uma atividade completa da Educação Infantil, pronta para a turma." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Detalhe,
});

const abas = ["Passo a passo", "Adaptar", "Histórico"] as const;

function Detalhe() {
  const { id } = Route.useParams();
  const {
    atividadePorId,
    atividades,
    registrosDaAtividade,
    registrar,
    alternarFavorita,
    atualizarAtividade,
    slots,
  } = usePlanner();
  const atividade = atividadePorId(id);
  const [aba, setAba] = useState<(typeof abas)[number]>("Passo a passo");
  const [agendando, setAgendando] = useState(false);
  const [registrando, setRegistrando] = useState(false);

  if (!atividade) throw notFound();

  const registros = registrosDaAtividade(atividade.id);
  const agendamentos = slots
    .filter((s) => s.atividadeId === atividade.id)
    .sort((a, b) => a.data.localeCompare(b.data));
  const media = registros.length
    ? registros.reduce((s, r) => s + r.engajamento, 0) / registros.length
    : null;
  const parecidas = atividades
    .filter((a) => a.id !== atividade.id && (a.tema === atividade.tema || a.campo === atividade.campo))
    .slice(0, 2);
  const cor = corDoCampo(atividade.campo);

  return (
    <AppShell titulo={atividade.titulo} subtitulo={`${atividade.tema} · ${campoCurto[atividade.campo]}`}>
      <div className="space-y-5">
        <Link to="/atividades" className="no-print inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar para a biblioteca
        </Link>

        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${cor.chip}`}>
              {campoCurto[atividade.campo]}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {atividade.duracao} min
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> {atividade.organizacao}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {atividade.espaco}
            </span>
            {media ? (
              <span className="flex items-center gap-1 text-xs text-sol">
                <Star className="h-3.5 w-3.5 fill-current" /> {media.toFixed(1)} de 5
              </span>
            ) : null}
            <button
              onClick={() => alternarFavorita(atividade.id)}
              className="no-print ml-auto inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium"
            >
              <Star className={`h-3.5 w-3.5 ${atividade.favorita ? "fill-current text-sol" : ""}`} />
              {atividade.favorita ? "Favorita" : "Favoritar"}
            </button>
          </div>

          <p className="mt-4 text-sm leading-relaxed">
            <strong>Objetivo: </strong>
            {atividade.objetivo}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Turma {professora.turma} · {atividade.faixa} · criada em {formatarCurto(atividade.criadaEm)} (
            {atividade.origem === "assistente" ? "com o assistente" : atividade.origem === "escola" ? "material da escola" : "sua"})
          </p>

          <div className="no-print mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setAgendando(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <CalendarPlus className="h-4 w-4" /> Colocar no planejamento
            </button>
            <Link
              to="/folha/$id"
              params={{ id: atividade.id }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold"
            >
              <Download className="h-4 w-4" /> Folha ilustrada e download
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold"
            >
              <Printer className="h-4 w-4" /> Imprimir
            </button>
            <button
              onClick={() => setRegistrando((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold"
            >
              Como foi?
            </button>
          </div>
        </section>

        {registrando ? (
          <FormularioRegistro
            onSalvar={(dados) => {
              registrar({ atividadeId: atividade.id, data: HOJE_ISO, ...dados });
              setRegistrando(false);
              toast.success("Registro salvo. Isso melhora as próximas sugestões.");
            }}
            onCancelar={() => setRegistrando(false)}
          />
        ) : null}

        <div className="no-print grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-1.5">
          {abas.map((a) => (
            <button
              key={a}
              onClick={() => setAba(a)}
              className={`rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors ${
                aba === a ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {aba === "Passo a passo" ? (
          <section className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-lg font-semibold">Materiais</h2>
                <Link to="/materiais" className="no-print text-xs font-semibold text-primary">
                  Minha lista de materiais
                </Link>
              </div>
              <ul className="mt-3 space-y-2">
                {atividade.materiais.map((m, i) => (
                  <li key={`${m}-${i}`} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <input
                      value={m}
                      onChange={(e) =>
                        atualizarAtividade(atividade.id, {
                          materiais: atividade.materiais.map((x, j) => (j === i ? e.target.value : x)),
                        })
                      }
                      className="min-w-0 flex-1 bg-transparent outline-none"
                    />
                    <button
                      onClick={() =>
                        atualizarAtividade(atividade.id, {
                          materiais: atividade.materiais.filter((_, j) => j !== i),
                        })
                      }
                      aria-label="Remover material"
                      className="no-print text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  atualizarAtividade(atividade.id, { materiais: [...atividade.materiais, "Novo material"] })
                }
                className="no-print mt-3 inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar material
              </button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-semibold">Como conduzir</h2>
              <ol className="mt-3 space-y-3">
                {atividade.passos.map((p, i) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
            {atividade.observacaoProfessora ? (
              <p className="rounded-2xl bg-sol-suave p-4 text-sm">
                <strong>Sua anotação:</strong> {atividade.observacaoProfessora}
              </p>
            ) : null}
          </section>
        ) : null}

        {aba === "Adaptar" ? (
          <section className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-semibold">Adaptações sugeridas</h2>
              <ul className="mt-3 space-y-2">
                {atividade.adaptacoes.map((a) => (
                  <li key={a} className="flex gap-2 text-sm">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-folha" /> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-semibold">Objetivos de aprendizagem</h2>
              <ul className="mt-3 space-y-2">
                {atividade.objetivosBncc.map((o) => (
                  <li key={o.codigo} className="rounded-xl bg-background p-3 text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{o.codigo}</span>
                    <p>{o.texto}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/assistente"
              search={{ tema: "agua" }}
              className="no-print block rounded-2xl border border-dashed border-primary/50 bg-accent/40 p-4 text-center text-sm font-semibold text-primary"
            >
              Pedir ao assistente uma versão mais curta ou com outros materiais
            </Link>
          </section>
        ) : null}

        {aba === "Histórico" ? (
          <section className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-semibold">Quando usei</h2>
              {agendamentos.length ? (
                <ul className="mt-3 space-y-2">
                  {agendamentos.map((s) => (
                    <li key={s.id} className="flex items-center gap-3 rounded-xl bg-background p-3 text-sm">
                      <span className="text-xs text-muted-foreground">{momentoHorario[s.momento]}</span>
                      <span className="min-w-0 flex-1">
                        {nomeDia(s.data)}, {formatarCurto(s.data)}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                          s.status === "feito" ? "bg-folha-suave text-folha" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Ainda não usei com a turma.</p>
              )}
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-semibold">Como funcionou</h2>
              {registros.length ? (
                <ul className="mt-3 space-y-2">
                  {registros.map((r) => (
                    <li key={r.id} className="rounded-xl bg-background p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {r.humor === "otimo" ? "😀" : r.humor === "mais_ou_menos" ? "😐" : "😕"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatarCurto(r.data)} · durou {r.duracaoReal} min · engajamento {r.engajamento}/5
                        </span>
                      </div>
                      <p className="mt-1">{r.comentario}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Nenhum registro ainda.</p>
              )}
            </div>
          </section>
        ) : null}

        {parecidas.length ? (
          <section className="no-print">
            <h2 className="font-display text-lg font-semibold">Parecidas com esta</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {parecidas.map((a) => (
                <ActivityCard key={a.id} atividade={a} compacto />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <AgendarDialog atividade={atividade} aberto={agendando} onFechar={() => setAgendando(false)} />
    </AppShell>
  );
}

function FormularioRegistro({
  onSalvar,
  onCancelar,
}: {
  onSalvar: (dados: {
    humor: "otimo" | "mais_ou_menos" | "dificil";
    duracaoReal: number;
    engajamento: number;
    comentario: string;
  }) => void;
  onCancelar: () => void;
}) {
  const [humor, setHumor] = useState<"otimo" | "mais_ou_menos" | "dificil">("otimo");
  const [duracaoReal, setDuracao] = useState(30);
  const [engajamento, setEngajamento] = useState(4);
  const [comentario, setComentario] = useState("");

  return (
    <section className="no-print rounded-2xl border border-primary/30 bg-accent/30 p-5">
      <h2 className="font-display text-lg font-semibold">Como foi com a turma?</h2>
      <p className="text-sm text-muted-foreground">Leva menos de um minuto e melhora as próximas sugestões.</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {(
          [
            ["otimo", "😀", "Foi ótimo"],
            ["mais_ou_menos", "😐", "Mais ou menos"],
            ["dificil", "😕", "Foi difícil"],
          ] as const
        ).map(([id, emoji, label]) => (
          <button
            key={id}
            onClick={() => setHumor(id)}
            className={`rounded-2xl border p-3 text-center ${
              humor === id ? "border-primary bg-card" : "border-border bg-card/60"
            }`}
          >
            <span className="block text-2xl">{emoji}</span>
            <span className="mt-1 block text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      <label className="mt-4 block text-sm font-medium">
        Quanto tempo durou? <span className="text-muted-foreground">{duracaoReal} min</span>
        <input
          type="range"
          min={10}
          max={60}
          step={5}
          value={duracaoReal}
          onChange={(e) => setDuracao(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--primary)]"
        />
      </label>

      <div className="mt-3">
        <p className="text-sm font-medium">As crianças se envolveram?</p>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setEngajamento(n)} aria-label={`${n} de 5`}>
              <Star className={`h-7 w-7 ${n <= engajamento ? "fill-current text-sol" : "text-muted-foreground/40"}`} />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={2}
        placeholder="Algo que você quer lembrar na próxima vez"
        className="mt-3 w-full rounded-xl border border-border bg-card p-3 text-sm"
      />

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onSalvar({ humor, duracaoReal, engajamento, comentario })}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Salvar registro
        </button>
        <button onClick={onCancelar} className="rounded-xl px-4 py-2.5 text-sm text-muted-foreground">
          Agora não
        </button>
      </div>
    </section>
  );
}
