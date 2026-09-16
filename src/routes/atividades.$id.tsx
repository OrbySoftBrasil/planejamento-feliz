import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, Printer, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { professora } from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/atividades/$id")({
  head: () => ({
    meta: [
      { title: "Atividade pronta para imprimir · Planeja" },
      {
        name: "description",
        content: "Objetivo, materiais, passo a passo e adaptações da atividade, prontos para imprimir.",
      },
      { property: "og:title", content: "Atividade pronta · Planeja" },
      {
        property: "og:description",
        content: "Veja a atividade completa e registre como ela funcionou com a turma.",
      },
    ],
  }),
  component: Detalhe,
});

const humores = [
  { id: "otimo", label: "Funcionou muito bem", emoji: "😀" },
  { id: "mais_ou_menos", label: "Mais ou menos", emoji: "😐" },
  { id: "dificil", label: "Não engajou", emoji: "🙁" },
] as const;

function Detalhe() {
  const { id } = Route.useParams();
  const { atividades, registros, registrar } = usePlanner();
  const atividade = atividades.find((a) => a.id === id);
  const registro = registros.find((r) => r.atividadeId === id);
  const [humor, setHumor] = useState<(typeof humores)[number]["id"] | null>(null);
  const [comentario, setComentario] = useState("");

  if (!atividade) {
    return (
      <AppShell titulo="Atividade não encontrada">
        <Link to="/atividades" className="text-primary">
          Voltar para a biblioteca
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell titulo={atividade.titulo} subtitulo={`${atividade.tema} · ${atividade.campo}`}>
      <div className="no-print mb-4 flex items-center justify-between gap-3">
        <Link to="/atividades" className="flex items-center gap-2 text-sm font-medium text-primary">
          <ArrowLeft className="h-4 w-4" /> Biblioteca
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold"
        >
          <Printer className="h-4 w-4" /> Imprimir
        </button>
      </div>

      <article className="space-y-5">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5">
            <Clock className="h-4 w-4" /> {atividade.duracao} minutos
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5">
            <Users className="h-4 w-4" /> {atividade.faixa} · {professora.criancas} crianças
          </span>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Objetivo</h2>
          <p className="mt-2 text-[0.98rem] leading-relaxed">{atividade.objetivo}</p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Materiais</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {atividade.materiais.map((m) => (
              <li key={m} className="rounded-full bg-background px-3 py-1.5 text-sm">
                {m}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Passo a passo</h2>
          <ol className="mt-3 space-y-3">
            {atividade.passos.map((p, i) => (
              <li key={p} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-agua-suave text-sm font-bold text-agua">
                  {i + 1}
                </span>
                <span className="text-[0.98rem] leading-relaxed">{p}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-border bg-folha-suave p-5">
          <h2 className="font-display text-lg font-semibold">Adaptações</h2>
          <ul className="mt-2 space-y-2">
            {atividade.adaptacoes.map((a) => (
              <li key={a} className="flex gap-2 text-sm">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-folha" />
                {a}
              </li>
            ))}
          </ul>
        </section>
      </article>

      <section className="no-print mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Como foi?</h2>
        {registro ? (
          <div className="mt-3 rounded-xl bg-background p-4 text-sm">
            <p className="font-medium">
              {humores.find((h) => h.id === registro.humor)?.emoji}{" "}
              {humores.find((h) => h.id === registro.humor)?.label} · {registro.duracaoReal} min ·{" "}
              {registro.data}
            </p>
            <p className="mt-1 text-muted-foreground">{registro.comentario}</p>
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              Um toque agora ajuda o assistente a sugerir melhor depois.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {humores.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setHumor(h.id)}
                  className={`rounded-xl border p-3 text-sm ${
                    humor === h.id ? "border-primary bg-accent font-semibold" : "border-border bg-background"
                  }`}
                >
                  <span className="mr-1 text-lg">{h.emoji}</span>
                  {h.label}
                </button>
              ))}
            </div>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={2}
              placeholder="Quer anotar algo? (opcional)"
              className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
            />
            <button
              disabled={!humor}
              onClick={() => {
                if (!humor) return;
                registrar({
                  atividadeId: atividade.id,
                  humor,
                  duracaoReal: atividade.duracao,
                  comentario: comentario || "Sem observações.",
                  data: "18 de março",
                });
                toast.success("Registro salvo. Obrigado!");
              }}
              className="mt-3 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50"
            >
              Salvar registro
            </button>
          </>
        )}
      </section>
    </AppShell>
  );
}
