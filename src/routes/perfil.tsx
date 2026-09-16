import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, School, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { professora } from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil pedagógico e minha turma · Planeja" },
      {
        name: "description",
        content:
          "Jeito de ensinar, preferências, materiais disponíveis e contexto da turma usados nas sugestões.",
      },
      { property: "og:title", content: "Meu perfil · Planeja" },
      {
        property: "og:description",
        content: "O contexto da professora e da turma que personaliza cada sugestão.",
      },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { registros } = usePlanner();

  return (
    <AppShell titulo="Meu perfil" subtitulo="É com isso que o assistente entende sua realidade.">
      <div className="space-y-5">
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-sol-suave text-lg font-bold">
              AL
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-semibold">{professora.nome}</p>
              <p className="truncate text-sm text-muted-foreground">{professora.escola}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Users className="h-5 w-5 text-agua" /> Minha turma
          </h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <Info termo="Turma" valor={professora.turma} />
            <Info termo="Idade" valor={professora.idade} />
            <Info termo="Crianças" valor={`${professora.criancas}`} />
            <Info termo="Período" valor={professora.periodo} />
          </dl>
          <p className="mt-3 rounded-xl bg-background p-3 text-sm text-muted-foreground">
            {professora.particularidades}
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Heart className="h-5 w-5 text-coral" /> Meu jeito de ensinar
          </h2>
          <p className="mt-2 text-sm">{professora.estilo}</p>
          <ul className="mt-3 space-y-2">
            {professora.preferencias.map((p) => (
              <li key={p} className="flex gap-2 text-sm">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <School className="h-5 w-5 text-folha" /> Materiais que tenho
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {professora.materiais.map((m) => (
              <span key={m} className="rounded-full bg-folha-suave px-3 py-1.5 text-sm">
                {m}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">O que já registrei</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {registros.length} registro(s). Quanto mais você conta, melhores ficam as sugestões.
          </p>
          <Link to="/atividades" className="mt-3 inline-block text-sm font-medium text-primary">
            Ver atividades
          </Link>
        </section>
      </div>
    </AppShell>
  );
}

function Info({ termo, valor }: { termo: string; valor: string }) {
  return (
    <div className="rounded-xl bg-background p-3">
      <dt className="text-xs text-muted-foreground">{termo}</dt>
      <dd className="font-medium">{valor}</dd>
    </div>
  );
}
