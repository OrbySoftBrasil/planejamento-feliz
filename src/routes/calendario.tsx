import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  HOJE_ISO,
  diasCurtos,
  eventos,
  formatarCurto,
  momentoHorario,
  momentos,
  nomeDia,
  nomeMes,
  parseISO,
  planosMensais,
  toISO,
} from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";
import { pontoDoTipo } from "@/lib/ui";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário pedagógico · Planeja" },
      {
        name: "description",
        content: "Projetos, eventos da escola e datas comemorativas do mês em um calendário visual.",
      },
      { property: "og:title", content: "Calendário pedagógico · Planeja" },
      {
        property: "og:description",
        content: "Veja projetos, eventos e datas comemorativas do mês da sua turma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Calendario,
});

const coresEvento: Record<string, string> = {
  data: "bg-sol",
  projeto: "bg-folha",
  evento: "bg-agua",
  escola: "bg-coral",
};

function Calendario() {
  const { slotsDoDia, atividadePorId } = usePlanner();
  const [mes, setMes] = useState(parseISO(HOJE_ISO).getMonth());
  const [ano] = useState(parseISO(HOJE_ISO).getFullYear());
  const [selecionado, setSelecionado] = useState<string>("2026-03-20");

  const primeiro = new Date(ano, mes, 1);
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const vazios = primeiro.getDay();
  const plano = planosMensais.find((p) => p.mes === mes + 1);

  const eventosDoDia = eventos.filter((e) => e.data === selecionado);
  const slotsSelecionados = momentos
    .map((m) => slotsDoDia(selecionado).find((s) => s.momento === m))
    .filter(Boolean);

  return (
    <AppShell
      titulo="Calendário"
      subtitulo={`${nomeMes(mes)} de ${ano}${plano ? ` · Projeto ${plano.tema}` : ""}`}
    >
      <div className="rounded-3xl border border-border bg-card p-3 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => setMes((m) => Math.max(0, m - 1))}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-accent"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="font-display text-lg font-semibold">
            {nomeMes(mes)} {ano}
          </p>
          <button
            onClick={() => setMes((m) => Math.min(11, m + 1))}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-accent"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {diasCurtos.map((d, i) => (
            <div key={i} className="py-1">
              {d.slice(0, 1)}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: vazios }, (_, i) => (
            <div key={`v${i}`} />
          ))}
          {Array.from({ length: totalDias }, (_, i) => i + 1).map((dia) => {
            const iso = toISO(new Date(ano, mes, dia));
            const doDia = eventos.filter((e) => e.data === iso);
            const planejadas = slotsDoDia(iso).filter((s) => s.atividadeId).length;
            const ativo = selecionado === iso;
            const ehHoje = iso === HOJE_ISO;
            const fimDeSemana = [0, 6].includes(new Date(ano, mes, dia).getDay());
            return (
              <button
                key={dia}
                onClick={() => setSelecionado(iso)}
                className={`aspect-square rounded-xl border p-1 text-sm transition-colors ${
                  ativo
                    ? "border-primary bg-accent font-semibold"
                    : ehHoje
                      ? "border-primary/40 bg-background font-semibold"
                      : `border-transparent ${fimDeSemana ? "bg-muted/40 text-muted-foreground" : "bg-background"} hover:bg-accent/50`
                }`}
              >
                <span className={ehHoje ? "text-primary" : ""}>{dia}</span>
                <span className="mt-1 flex justify-center gap-0.5">
                  {doDia.slice(0, 3).map((e) => (
                    <span key={e.titulo} className={`h-1.5 w-1.5 rounded-full ${coresEvento[e.tipo]}`} />
                  ))}
                </span>
                {planejadas > 0 ? (
                  <span className="mt-0.5 block text-[0.6rem] text-muted-foreground">{planejadas} ativ.</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sol" /> Data comemorativa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-folha" /> Projeto
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-agua" /> Passeio ou evento
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-coral" /> Escola e prazos
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">
            {nomeDia(selecionado)}, {formatarCurto(selecionado)}
          </h2>
          <Link to="/planejamento" search={{ aba: "semana" }} className="shrink-0 text-sm font-medium text-primary">
            Planejar
          </Link>
        </div>

        {eventosDoDia.length ? (
          <ul className="mt-3 space-y-2">
            {eventosDoDia.map((e) => (
              <li key={e.titulo} className="rounded-xl bg-background p-3 text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${coresEvento[e.tipo]}`} />
                  {e.titulo}
                </span>
                {e.detalhe ? <p className="mt-1 pl-4.5 text-muted-foreground">{e.detalhe}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Nenhuma data marcada neste dia.</p>
        )}

        <h3 className="mt-5 text-sm font-semibold">Planejamento do dia</h3>
        {slotsSelecionados.length ? (
          <ul className="mt-2 space-y-1.5">
            {slotsSelecionados.map((s) => {
              const ativ = atividadePorId(s!.atividadeId);
              return (
                <li key={s!.id} className="flex items-center gap-2 rounded-xl bg-background p-3 text-sm">
                  <span className="w-11 shrink-0 text-xs text-muted-foreground">
                    {momentoHorario[s!.momento]}
                  </span>
                  <span className={`h-2 w-2 shrink-0 rounded-full ${pontoDoTipo[s!.tipo]}`} />
                  <span className="min-w-0 flex-1 truncate">{s!.titulo}</span>
                  {ativ ? (
                    <Link
                      to="/atividades/$id"
                      params={{ id: ativ.id }}
                      className="shrink-0 text-xs font-medium text-primary"
                    >
                      Abrir
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> Dia ainda sem planejamento.
          </div>
        )}
      </div>
    </AppShell>
  );
}
