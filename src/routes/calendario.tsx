import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { planoMensal } from "@/data/mock";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário pedagógico de março · Planeja" },
      {
        name: "description",
        content: "Projetos, eventos da escola e datas comemorativas do mês em um calendário visual.",
      },
      { property: "og:title", content: "Calendário pedagógico · Planeja" },
      {
        property: "og:description",
        content: "Veja projetos, eventos e datas comemorativas do mês da sua turma.",
      },
    ],
  }),
  component: Calendario,
});

const cores = {
  data: "bg-sol",
  projeto: "bg-folha",
  evento: "bg-agua",
} as const;

function Calendario() {
  const [selecionado, setSelecionado] = useState<number | null>(20);
  // Março de 2026 começa num domingo e tem 31 dias.
  const celulas = Array.from({ length: 31 }, (_, i) => i + 1);
  const eventosDoDia = planoMensal.datas.filter((d) => d.dia === selecionado);

  return (
    <AppShell titulo="Calendário" subtitulo="Março de 2026 · Projeto Água e vida">
      <div className="rounded-3xl border border-border bg-card p-3 sm:p-5">
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
            <div key={i} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {celulas.map((dia) => {
            const eventos = planoMensal.datas.filter((d) => d.dia === dia);
            const ativo = selecionado === dia;
            const hoje = dia === 18;
            return (
              <button
                key={dia}
                onClick={() => setSelecionado(dia)}
                className={`aspect-square rounded-xl border p-1 text-sm transition-colors ${
                  ativo
                    ? "border-primary bg-accent font-semibold"
                    : hoje
                      ? "border-primary/40 bg-background font-semibold"
                      : "border-transparent bg-background hover:bg-accent/50"
                }`}
              >
                <span className={hoje ? "text-primary" : ""}>{dia}</span>
                <span className="mt-1 flex justify-center gap-0.5">
                  {eventos.map((e) => (
                    <span key={e.titulo} className={`h-1.5 w-1.5 rounded-full ${cores[e.tipo]}`} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sol" /> Data comemorativa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-folha" /> Projeto
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-agua" /> Evento da escola
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">
          {selecionado ? `Dia ${selecionado} de março` : "Escolha um dia"}
        </h2>
        {eventosDoDia.length ? (
          <ul className="mt-3 space-y-2">
            {eventosDoDia.map((e) => (
              <li key={e.titulo} className="flex items-center gap-3 rounded-xl bg-background p-3 text-sm">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${cores[e.tipo]}`} />
                {e.titulo}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Nenhuma data marcada neste dia.</p>
        )}
      </div>
    </AppShell>
  );
}
