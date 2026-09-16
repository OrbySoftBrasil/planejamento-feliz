import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Baby, NotebookPen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { criancas, professora } from "@/data/mock";

export const Route = createFileRoute("/turma")({
  head: () => ({
    meta: [
      { title: "Turma Girassol · Planeja" },
      {
        name: "description",
        content:
          "As 18 crianças de 4 anos da Turma Girassol, com observações rápidas que ajudam a planejar.",
      },
      { property: "og:title", content: "Turma Girassol · Planeja" },
      { property: "og:description", content: "Contexto da turma e observações que personalizam o planejamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Turma,
});

function Turma() {
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [editando, setEditando] = useState<string | null>(null);

  return (
    <AppShell
      titulo={professora.turma}
      subtitulo={`${professora.criancas} crianças de ${professora.idade} · ${professora.periodo}`}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <Mini rotulo="Crianças" valor={`${criancas.length}`} />
          <Mini rotulo="Com atenção" valor={`${criancas.filter((c) => c.atencao).length}`} />
          <Mini rotulo="Observações" valor={`${criancas.filter((c) => c.observacao).length}`} />
        </div>

        <div className="rounded-2xl border border-border bg-agua-suave/60 p-4 text-sm">
          <p className="font-medium">Contexto que o assistente considera</p>
          <p className="mt-1 text-muted-foreground">{professora.particularidades}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {criancas.map((c) => (
            <div key={c.nome} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sol-suave text-sm font-bold">
                  {c.nome.slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.nome}</p>
                  <p className="text-xs text-muted-foreground">{c.idade}</p>
                </div>
                {c.atencao ? <AlertTriangle className="ml-auto h-4 w-4 shrink-0 text-coral" /> : null}
              </div>
              {c.observacao ? (
                <p className="mt-2 flex gap-2 text-sm text-muted-foreground">
                  <Baby className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {c.observacao}
                </p>
              ) : null}
              {notas[c.nome] ? (
                <p className="mt-2 rounded-xl bg-folha-suave p-2.5 text-sm">{notas[c.nome]}</p>
              ) : null}
              {editando === c.nome ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const valor = new FormData(e.currentTarget).get("nota") as string;
                    setNotas((prev) => ({ ...prev, [c.nome]: valor }));
                    setEditando(null);
                  }}
                  className="mt-2 flex gap-2"
                >
                  <input
                    name="nota"
                    autoFocus
                    placeholder="O que você observou hoje?"
                    className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                  <button className="shrink-0 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
                    Salvar
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setEditando(c.nome)}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                >
                  <NotebookPen className="h-3.5 w-3.5" /> Anotar observação
                </button>
              )}
            </div>
          ))}
        </div>

        <Link to="/perfil" className="block text-center text-sm font-medium text-primary">
          Ver meu perfil pedagógico
        </Link>
      </div>
    </AppShell>
  );
}

function Mini({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5">
      <p className="text-xs text-muted-foreground">{rotulo}</p>
      <p className="mt-1 font-display text-xl font-semibold">{valor}</p>
    </div>
  );
}
