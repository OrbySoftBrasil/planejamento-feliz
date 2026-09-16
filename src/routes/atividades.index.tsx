import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Plus, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ActivityCard } from "@/components/ActivityCard";
import { camposExperiencia, campoCurto, temas, type CampoExperiencia } from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

type Ordem = "recentes" | "melhores" | "curtas" | "nunca";

export const Route = createFileRoute("/atividades/")({
  validateSearch: (s: Record<string, unknown>): { tema?: string } =>
    typeof s["tema"] === "string" ? { tema: s["tema"] } : {},
  head: () => ({
    meta: [
      { title: "Biblioteca de atividades · Planeja" },
      {
        name: "description",
        content: "Todas as atividades da turma organizadas por tema, campo de experiência e duração.",
      },
      { property: "og:title", content: "Biblioteca de atividades · Planeja" },
      { property: "og:description", content: "Busque, filtre e reaproveite atividades já criadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Biblioteca,
});

function Biblioteca() {
  const { tema: temaInicial } = Route.useSearch();
  const { atividades, registrosDaAtividade, usosDaAtividade } = usePlanner();
  const [busca, setBusca] = useState("");
  const [tema, setTema] = useState<string | null>(temaInicial ?? null);
  const [campo, setCampo] = useState<CampoExperiencia | null>(null);
  const [maxDuracao, setMaxDuracao] = useState(60);
  const [ordem, setOrdem] = useState<Ordem>("recentes");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const base = atividades.filter((a) => {
      if (termo) {
        const alvo = `${a.titulo} ${a.objetivo} ${a.tags.join(" ")} ${a.materiais.join(" ")}`.toLowerCase();
        if (!alvo.includes(termo)) return false;
      }
      if (tema && a.tema !== tema) return false;
      if (campo && a.campo !== campo) return false;
      if (a.duracao > maxDuracao) return false;
      if (ordem === "nunca" && usosDaAtividade(a.id) > 0) return false;
      return true;
    });
    const media = (id: string) => {
      const r = registrosDaAtividade(id);
      return r.length ? r.reduce((s, x) => s + x.engajamento, 0) / r.length : 0;
    };
    return [...base].sort((a, b) => {
      if (ordem === "melhores") return media(b.id) - media(a.id);
      if (ordem === "curtas") return a.duracao - b.duracao;
      return b.criadaEm.localeCompare(a.criadaEm);
    });
  }, [atividades, busca, tema, campo, maxDuracao, ordem, registrosDaAtividade, usosDaAtividade]);

  return (
    <AppShell
      titulo="Minhas atividades"
      subtitulo={`${atividades.length} atividades guardadas · reaproveite antes de criar`}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por título, material ou tema"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <button
            onClick={() => setFiltrosAbertos((v) => !v)}
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border ${
              filtrosAbertos ? "border-primary bg-accent text-primary" : "border-border bg-card"
            }`}
            aria-label="Filtros"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ["recentes", "Mais recentes"],
              ["melhores", "Melhor avaliadas"],
              ["curtas", "Mais curtas"],
              ["nunca", "Nunca usadas"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setOrdem(id)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm ${
                ordem === id ? "border-primary bg-accent font-medium text-primary" : "border-border bg-card"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtrosAbertos ? (
          <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Tema</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {temas.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTema(tema === t ? null : t)}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      tema === t ? "border-primary bg-accent text-primary" : "border-border"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Campo de experiência</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {camposExperiencia.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCampo(campo === c ? null : c)}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      campo === c ? "border-primary bg-accent text-primary" : "border-border"
                    }`}
                  >
                    {campoCurto[c]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Duração até {maxDuracao} minutos
              </p>
              <input
                type="range"
                min={15}
                max={60}
                step={5}
                value={maxDuracao}
                onChange={(e) => setMaxDuracao(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--primary)]"
              />
            </div>
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground">
          {lista.length} {lista.length === 1 ? "atividade encontrada" : "atividades encontradas"}
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          {lista.map((a) => (
            <ActivityCard key={a.id} atividade={a} />
          ))}
        </div>

        {lista.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center">
            <p className="font-medium">Nada com esses filtros</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente outra palavra ou peça uma ideia ao assistente.
            </p>
            <Link
              to="/assistente"
              search={{ tema: "agua" }}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Sparkles className="h-4 w-4" /> Falar com o assistente
            </Link>
          </div>
        ) : null}

        <Link
          to="/atividades/nova"
          className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/50 bg-accent/40 p-4 font-medium text-primary"
        >
          <Plus className="h-5 w-5" /> Criar uma atividade nova
        </Link>
      </div>
    </AppShell>
  );
}
