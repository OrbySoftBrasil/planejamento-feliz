import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { hoje, planoMensal, professora } from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hoje · Planeja — assistente de planejamento na Educação Infantil" },
      {
        name: "description",
        content:
          "Veja o dia, a semana, as atividades preparadas e as datas importantes da sua turma em um só lugar.",
      },
      { property: "og:title", content: "Hoje · Planeja" },
      {
        property: "og:description",
        content: "O dia da professora organizado: atividades, pendências e datas importantes.",
      },
    ],
  }),
  component: Hoje,
});

const semana = [
  { dia: "Seg", num: 16 },
  { dia: "Ter", num: 17 },
  { dia: "Qua", num: 18 },
  { dia: "Qui", num: 19 },
  { dia: "Sex", num: 20 },
];

function Hoje() {
  const { slots, pendenciaAguaResolvida } = usePlanner();
  const doDia = slots.filter((s) => s.dia === "Quarta");

  return (
    <AppShell titulo={`Bom dia, ${professora.nome}!`} subtitulo={hoje.dataLonga}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-border bg-card p-4 sm:p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="min-w-0 truncate font-display text-lg font-semibold">Sua semana</h2>
            <Link to="/planejamento" className="shrink-0 text-sm font-medium text-primary">
              Ver planejamento
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {semana.map((d) => {
              const atual = d.num === 18;
              return (
                <div
                  key={d.num}
                  className={`rounded-2xl border p-2 text-center ${
                    atual ? "border-primary bg-accent" : "border-border bg-background"
                  }`}
                >
                  <div className="text-xs text-muted-foreground">{d.dia}</div>
                  <div className={`text-lg font-semibold ${atual ? "text-primary" : ""}`}>{d.num}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Atividades de hoje</h2>
          <div className="mt-3 space-y-3">
            {doDia.map((s) => (
              <div key={s.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-agua-suave">
                  <Clock className="h-4 w-4 text-agua" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{s.momento}</p>
                  <p className="font-medium leading-snug">{s.titulo}</p>
                </div>
                {s.atividadeId ? (
                  <Link
                    to="/atividades/$id"
                    params={{ id: s.atividadeId }}
                    className="ml-auto shrink-0 self-center text-sm font-medium text-primary"
                  >
                    Abrir
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Pendências</h2>
          <div className="mt-3 space-y-3">
            {pendenciaAguaResolvida ? (
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-folha-suave p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-folha" />
                <div className="min-w-0">
                  <p className="font-medium">Atividade do Dia da Água já está no planejamento</p>
                  <p className="text-sm text-muted-foreground">Tudo pronto para sexta-feira.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-coral-suave p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
                  <div className="min-w-0">
                    <p className="font-medium">Dia da Água (sexta, 20/03) ainda sem atividade</p>
                    <p className="text-sm text-muted-foreground">
                      A escola vai celebrar a data e a manhã de sexta está vazia.
                    </p>
                  </div>
                </div>
                <Link
                  to="/assistente"
                  search={{ tema: "agua" }}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <Sparkles className="h-4 w-4" /> Pedir ajuda ao assistente
                </Link>
              </div>
            )}
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-sol" />
              <div className="min-w-0">
                <p className="font-medium">Registrar como foi "Flutua ou afunda?"</p>
                <p className="text-sm text-muted-foreground">Feito na segunda-feira.</p>
              </div>
              <Link
                to="/atividades/$id"
                params={{ id: "a1" }}
                className="ml-auto shrink-0 self-center text-sm font-medium text-primary"
              >
                Registrar
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="min-w-0 truncate font-display text-lg font-semibold">Datas importantes</h2>
            <Link to="/calendario" className="shrink-0 text-sm font-medium text-primary">
              Ver calendário
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {planoMensal.datas
              .filter((d) => d.dia >= 18)
              .map((d) => (
                <div
                  key={d.titulo}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sol-suave text-sm font-bold">
                    {d.dia}
                  </span>
                  <p className="min-w-0 text-sm font-medium">{d.titulo}</p>
                  <CalendarDays className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              ))}
          </div>
        </section>

        <Link
          to="/atividades/nova"
          className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/50 bg-accent/40 p-4 font-medium text-primary"
        >
          <Sparkles className="h-5 w-5 shrink-0" /> Criar uma nova atividade
          <ArrowRight className="ml-auto h-4 w-4 shrink-0" />
        </Link>
      </div>
    </AppShell>
  );
}
