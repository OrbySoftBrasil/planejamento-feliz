import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { dias, momentos, planoMensal, projetoAnual } from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/planejamento")({
  head: () => ({
    meta: [
      { title: "Planejamento anual, mensal e semanal · Planeja" },
      {
        name: "description",
        content:
          "Veja o planejamento do ano, do mês e da semana conectados, com os projetos e as atividades da turma.",
      },
      { property: "og:title", content: "Planejamento · Planeja" },
      {
        property: "og:description",
        content: "Planejamento anual, mensal e semanal da Educação Infantil em uma visão simples.",
      },
    ],
  }),
  component: Planejamento,
});

const abas = ["Semana", "Mês", "Ano"] as const;

function Planejamento() {
  const [aba, setAba] = useState<(typeof abas)[number]>("Semana");
  const { slots } = usePlanner();

  return (
    <AppShell titulo="Planejamento" subtitulo="Do ano para o mês, do mês para a semana.">
      <div className="no-print mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-1.5">
        {abas.map((a) => (
          <button
            key={a}
            onClick={() => setAba(a)}
            className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              aba === a ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {aba === "Semana" ? (
        <div className="space-y-4">
          <p className="rounded-2xl bg-agua-suave p-3.5 text-sm">
            Semana de 16 a 20 de março · Projeto <strong>{planoMensal.tema}</strong>
          </p>
          {dias.map((dia) => (
            <div key={dia} className="rounded-2xl border border-border bg-card p-4">
              <h3 className="font-display text-lg font-semibold">{dia}</h3>
              <div className="mt-3 space-y-2">
                {momentos.map((momento) => {
                  const slot = slots.find((s) => s.dia === dia && s.momento === momento);
                  return (
                    <div key={momento} className="rounded-xl bg-background p-3">
                      <p className="text-xs text-muted-foreground">{momento}</p>
                      {slot ? (
                        <div className="mt-0.5 flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                              slot.tipo === "atividade"
                                ? "bg-agua"
                                : slot.tipo === "projeto"
                                  ? "bg-folha"
                                  : "bg-sol"
                            }`}
                          />
                          <p className="min-w-0 truncate text-sm font-medium">{slot.titulo}</p>
                          {slot.atividadeId ? (
                            <Link
                              to="/atividades/$id"
                              params={{ id: slot.atividadeId }}
                              className="ml-auto shrink-0 text-xs font-medium text-primary"
                            >
                              Abrir
                            </Link>
                          ) : null}
                        </div>
                      ) : (
                        <Link
                          to="/assistente"
                          search={{ tema: "agua" }}
                          className="mt-1 flex items-center gap-2 text-sm font-medium text-primary"
                        >
                          <Plus className="h-4 w-4" /> Adicionar atividade
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {aba === "Mês" ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{planoMensal.mes} · projeto do mês</p>
            <h3 className="font-display text-2xl font-semibold">{planoMensal.tema}</h3>
            <ul className="mt-3 space-y-2">
              {planoMensal.focos.map((f) => (
                <li key={f} className="flex gap-2 text-sm">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-lg font-semibold">Datas do mês</h3>
            <div className="mt-3 space-y-2">
              {planoMensal.datas.map((d) => (
                <div key={d.titulo} className="flex items-center gap-3 rounded-xl bg-background p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sol-suave text-sm font-bold">
                    {d.dia}
                  </span>
                  <p className="min-w-0 text-sm">{d.titulo}</p>
                </div>
              ))}
            </div>
          </div>
          <Link to="/calendario" className="block text-center text-sm font-medium text-primary">
            Ver no calendário
          </Link>
        </div>
      ) : null}

      {aba === "Ano" ? (
        <div className="space-y-4">
          {projetoAnual.map((b) => (
            <div key={b.bimestre} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">{b.bimestre}</p>
              <h3 className="font-display text-xl font-semibold">{b.tema}</h3>
              <ul className="mt-3 space-y-2">
                {b.objetivos.map((o) => (
                  <li key={o} className="flex gap-2 text-sm">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {o}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {b.projetos.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-folha-suave px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}
