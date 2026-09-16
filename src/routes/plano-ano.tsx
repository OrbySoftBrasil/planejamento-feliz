import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { usePlanner, type Bimestre } from "@/lib/planner-store";

export const Route = createFileRoute("/plano-ano")({
  head: () => ({
    meta: [
      { title: "Criar e editar o planejamento anual · Planeja" },
      {
        name: "description",
        content: "Escreva o projeto do ano, os objetivos de cada bimestre e conecte com os meses da turma.",
      },
      { property: "og:title", content: "Planejamento anual · Planeja" },
      { property: "og:description", content: "Edite o projeto do ano e os quatro bimestres da sua turma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanoAno,
});

function PlanoAno() {
  const { planoAnual, atualizarPlanoAnual, atualizarBimestre } = usePlanner();
  const [editando, setEditando] = useState<number | null>(null);

  return (
    <AppShell titulo="Planejamento do ano" subtitulo="O projeto que guia o ano todo e os quatro bimestres.">
      <Link to="/planejamento" className="no-print mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar ao planejamento
      </Link>

      <section className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">Projeto do ano · {planoAnual.ano}</p>
        <input
          value={planoAnual.titulo}
          onChange={(e) => atualizarPlanoAnual({ titulo: e.target.value })}
          className="mt-1 w-full bg-transparent font-display text-2xl font-semibold outline-none"
        />
        <textarea
          value={planoAnual.intencao}
          onChange={(e) => atualizarPlanoAnual({ intencao: e.target.value })}
          rows={3}
          className="mt-3 w-full rounded-xl border border-border bg-background p-3 text-sm"
        />
        <p className="mt-2 text-xs text-muted-foreground">Tudo o que você escreve aqui é salvo sozinho.</p>
      </section>

      <div className="mt-6 space-y-4">
        {planoAnual.bimestres.map((b, i) => (
          <CartaoBimestre
            key={b.bimestre}
            bimestre={b}
            aberto={editando === i}
            onAbrir={() => setEditando(editando === i ? null : i)}
            onMudar={(patch) => atualizarBimestre(i, patch)}
          />
        ))}
      </div>
    </AppShell>
  );
}

function CartaoBimestre({
  bimestre,
  aberto,
  onAbrir,
  onMudar,
}: {
  bimestre: Bimestre;
  aberto: boolean;
  onAbrir: () => void;
  onMudar: (patch: Partial<Bimestre>) => void;
}) {
  const [novoObjetivo, setNovoObjetivo] = useState("");
  const [novoProjeto, setNovoProjeto] = useState("");

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {bimestre.bimestre} · {bimestre.periodo}
          </p>
          {aberto ? (
            <input
              value={bimestre.tema}
              onChange={(e) => onMudar({ tema: e.target.value })}
              className="mt-1 w-full bg-transparent font-display text-xl font-semibold outline-none"
            />
          ) : (
            <h2 className="mt-1 font-display text-xl font-semibold">{bimestre.tema}</h2>
          )}
        </div>
        <button
          onClick={onAbrir}
          className="shrink-0 rounded-xl border border-border px-3 py-2 text-sm font-semibold"
        >
          {aberto ? "Pronto" : "Editar"}
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold">Objetivos</p>
        <ul className="mt-2 space-y-1.5">
          {bimestre.objetivos.map((o, i) => (
            <li key={o} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-folha" />
              {aberto ? (
                <>
                  <input
                    value={o}
                    onChange={(e) =>
                      onMudar({
                        objetivos: bimestre.objetivos.map((x, j) => (j === i ? e.target.value : x)),
                      })
                    }
                    className="min-w-0 flex-1 border-b border-dashed border-border bg-transparent outline-none"
                  />
                  <button
                    onClick={() => onMudar({ objetivos: bimestre.objetivos.filter((_, j) => j !== i) })}
                    aria-label="Remover objetivo"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </>
              ) : (
                <span>{o}</span>
              )}
            </li>
          ))}
        </ul>
        {aberto ? (
          <div className="mt-3 flex gap-2">
            <input
              value={novoObjetivo}
              onChange={(e) => setNovoObjetivo(e.target.value)}
              placeholder="Novo objetivo"
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                if (!novoObjetivo.trim()) return;
                onMudar({ objetivos: [...bimestre.objetivos, novoObjetivo.trim()] });
                setNovoObjetivo("");
                toast.success("Objetivo adicionado.");
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Incluir
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold">Projetos do bimestre</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {bimestre.projetos.map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5 rounded-full bg-folha-suave px-3 py-1 text-xs font-medium">
              {p}
              {aberto ? (
                <button
                  onClick={() => onMudar({ projetos: bimestre.projetos.filter((x) => x !== p) })}
                  aria-label="Remover projeto"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              ) : null}
            </span>
          ))}
        </div>
        {aberto ? (
          <div className="mt-3 flex gap-2">
            <input
              value={novoProjeto}
              onChange={(e) => setNovoProjeto(e.target.value)}
              placeholder="Novo projeto"
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                if (!novoProjeto.trim()) return;
                onMudar({ projetos: [...bimestre.projetos, novoProjeto.trim()] });
                setNovoProjeto("");
              }}
              className="shrink-0 rounded-xl border border-border px-3 py-2 text-sm font-semibold"
            >
              Incluir
            </button>
          </div>
        ) : null}
      </div>

      {aberto ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Situação:</span>
          {(["rascunho", "planejado", "em andamento"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onMudar({ status: s as Bimestre["status"] })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                bimestre.status === s ? "bg-primary text-primary-foreground" : "border border-border"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-xs text-muted-foreground">Situação: {bimestre.status}</p>
      )}
    </section>
  );
}
