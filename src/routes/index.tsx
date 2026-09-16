import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Droplets,
  Sparkles,
  Undo2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  HOJE_ISO,
  addDias,
  diasCurtos,
  diasUteis,
  eventos,
  formatarCurto,
  formatarLongo,
  inicioDaSemana,
  momentoHorario,
  momentos,
  parseISO,
  planosMensais,
  professora,
  recados,
} from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";
import { pontoDoTipo } from "@/lib/ui";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Hoje,
});

function Hoje() {
  const {
    slotsDoDia,
    slots,
    atividadePorId,
    alterarStatus,
    registros,
    recadosLidos,
    marcarRecadoLido,
    pendenciaAguaResolvida,
  } = usePlanner();

  const inicio = inicioDaSemana(HOJE_ISO);
  const semana = diasUteis(inicio);
  const doDia = momentos
    .map((m) => slotsDoDia(HOJE_ISO).find((s) => s.momento === m))
    .filter(Boolean) as ReturnType<typeof slotsDoDia>;

  const minutosPlanejados = doDia.reduce(
    (t, s) => t + (atividadePorId(s.atividadeId)?.duracao ?? 20),
    0,
  );
  const feitos = doDia.filter((s) => s.status === "feito").length;
  const mes = planosMensais.find((p) => p.mes === parseISO(HOJE_ISO).getMonth() + 1);

  const semRegistro = slots
    .filter((s) => s.atividadeId && s.data < HOJE_ISO && s.data >= addDias(HOJE_ISO, -7))
    .filter((s) => !registros.some((r) => r.atividadeId === s.atividadeId && r.data === s.data))
    .slice(0, 2);

  const proximosEventos = eventos
    .filter((e) => e.data >= HOJE_ISO)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 4);

  const recadosAbertos = recados.filter((r) => !recadosLidos.includes(r.id));

  return (
    <AppShell titulo={`Bom dia, ${professora.nome}!`} subtitulo={formatarLongo(HOJE_ISO)}>
      <div className="space-y-6">
        {/* resumo do dia */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Resumo rotulo="Atividades hoje" valor={`${feitos}/${doDia.length}`} detalhe="já realizadas" />
          <Resumo rotulo="Tempo planejado" valor={`${minutosPlanejados} min`} detalhe="da manhã" />
          <Resumo rotulo="Projeto do mês" valor={mes?.tema ?? "—"} detalhe={mes?.status ?? ""} />
          <Resumo
            rotulo="Pendências"
            valor={`${(pendenciaAguaResolvida ? 0 : 1) + semRegistro.length}`}
            detalhe="para resolver"
            alerta={!pendenciaAguaResolvida}
          />
        </section>

        {/* semana */}
        <section className="rounded-3xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">
              Semana de {formatarCurto(inicio)} a {formatarCurto(addDias(inicio, 4))}
            </h2>
            <Link to="/planejamento" search={{ aba: "semana" }} className="shrink-0 text-sm font-medium text-primary">
              Abrir planejamento
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {semana.map((data) => {
              const doDiaSlots = slotsDoDia(data);
              const atual = data === HOJE_ISO;
              return (
                <Link
                  key={data}
                  to="/planejamento"
                  search={{ aba: "semana" }}
                  className={`rounded-2xl border p-2 text-center transition-colors ${
                    atual ? "border-primary bg-accent" : "border-border bg-background hover:bg-accent/40"
                  }`}
                >
                  <div className="text-xs text-muted-foreground">{diasCurtos[parseISO(data).getDay()]}</div>
                  <div className={`text-lg font-semibold ${atual ? "text-primary" : ""}`}>
                    {parseISO(data).getDate()}
                  </div>
                  <div className="mt-1 flex justify-center gap-0.5">
                    {doDiaSlots.slice(0, 4).map((s) => (
                      <span key={s.id} className={`h-1.5 w-1.5 rounded-full ${pontoDoTipo[s.tipo]}`} />
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* rotina de hoje */}
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">A manhã de hoje</h2>
            <span className="text-xs text-muted-foreground">toque para marcar como feito</span>
          </div>
          <ol className="mt-3 space-y-2">
            {doDia.map((s) => {
              const ativ = atividadePorId(s.atividadeId);
              const feito = s.status === "feito";
              return (
                <li
                  key={s.id}
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 transition-colors ${
                    feito ? "border-folha/40 bg-folha-suave/50" : "border-border bg-card"
                  }`}
                >
                  <button
                    onClick={() => alterarStatus(s.id, feito ? "planejado" : "feito")}
                    aria-label={feito ? "Desmarcar" : "Marcar como feito"}
                    className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${
                      feito ? "border-folha bg-folha text-primary-foreground" : "border-border bg-background"
                    }`}
                  >
                    {feito ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[0.7rem] font-semibold">{momentoHorario[s.momento].slice(0, 2)}</span>}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      {momentoHorario[s.momento]} · {s.momento}
                    </p>
                    <p className={`font-medium leading-snug ${feito ? "line-through opacity-70" : ""}`}>
                      {s.titulo}
                    </p>
                    {ativ ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {ativ.duracao} min · {ativ.organizacao} · {ativ.espaco}
                      </p>
                    ) : null}
                  </div>
                  {s.atividadeId ? (
                    <Link
                      to="/atividades/$id"
                      params={{ id: s.atividadeId }}
                      className="shrink-0 self-center rounded-xl border border-border px-3 py-1.5 text-sm font-medium text-primary"
                    >
                      Abrir
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* pendências */}
        <section>
          <h2 className="font-display text-lg font-semibold">Pendências</h2>
          <div className="mt-3 space-y-3">
            {pendenciaAguaResolvida ? (
              <div className="flex items-start gap-3 rounded-2xl border border-folha/40 bg-folha-suave p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-folha" />
                <div className="min-w-0">
                  <p className="font-medium">Dia da Água resolvido</p>
                  <p className="text-sm text-muted-foreground">
                    A atividade já está no planejamento de sexta-feira.
                  </p>
                </div>
                <Link
                  to="/planejamento"
                  search={{ aba: "semana" }}
                  className="ml-auto shrink-0 self-center text-sm font-medium text-primary"
                >
                  Ver
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-coral/30 bg-coral-suave p-4">
                <div className="flex items-start gap-3">
                  <Droplets className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
                  <div className="min-w-0">
                    <p className="font-medium">Sexta, 20/03 · Dia da Água sem atividade principal</p>
                    <p className="text-sm text-muted-foreground">
                      A escola vai celebrar às 10h no pátio e sua manhã de sexta ainda está aberta.
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to="/assistente"
                    search={{ tema: "agua" }}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    <Sparkles className="h-4 w-4" /> Pedir ajuda ao assistente
                  </Link>
                  <Link
                    to="/atividades"
                    search={{ tema: "Água" }}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold"
                  >
                    Ver o que já tenho
                  </Link>
                </div>
              </div>
            )}

            {semRegistro.map((s) => (
              <div key={s.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-sol" />
                <div className="min-w-0">
                  <p className="font-medium">Registrar como foi “{s.titulo}”</p>
                  <p className="text-sm text-muted-foreground">Feito em {formatarCurto(s.data)}.</p>
                </div>
                <Link
                  to="/atividades/$id"
                  params={{ id: s.atividadeId! }}
                  className="ml-auto shrink-0 self-center text-sm font-medium text-primary"
                >
                  Registrar
                </Link>
              </div>
            ))}
            {semRegistro.length === 0 && pendenciaAguaResolvida ? (
              <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                Nada pendente. Sua semana está em dia.
              </p>
            ) : null}
          </div>
        </section>

        {/* recados */}
        {recadosAbertos.length ? (
          <section>
            <h2 className="font-display text-lg font-semibold">Recados da escola</h2>
            <div className="mt-3 space-y-2">
              {recadosAbertos.map((r) => (
                <div key={r.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-agua" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {r.de} · {formatarCurto(r.data)}
                    </p>
                    <p className="text-sm">{r.texto}</p>
                  </div>
                  <button
                    onClick={() => marcarRecadoLido(r.id)}
                    className="ml-auto shrink-0 self-center text-sm font-medium text-primary"
                  >
                    Ok
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* datas */}
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Próximas datas</h2>
            <Link to="/calendario" className="shrink-0 text-sm font-medium text-primary">
              Ver calendário
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {proximosEventos.map((e) => (
              <div key={e.data + e.titulo} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sol-suave text-center text-sm font-bold leading-none">
                  {parseISO(e.data).getDate()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.titulo}</p>
                  {e.detalhe ? <p className="truncate text-xs text-muted-foreground">{e.detalhe}</p> : null}
                </div>
                <CalendarDays className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/atividades/nova"
            className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/50 bg-accent/40 p-4 font-medium text-primary"
          >
            <Sparkles className="h-5 w-5 shrink-0" /> Criar uma atividade
            <ArrowRight className="ml-auto h-4 w-4 shrink-0" />
          </Link>
          <Link
            to="/turma"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 font-medium"
          >
            <Undo2 className="h-5 w-5 shrink-0 text-muted-foreground" /> Ver a Turma Girassol
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Resumo({
  rotulo,
  valor,
  detalhe,
  alerta,
}: {
  rotulo: string;
  valor: string;
  detalhe: string;
  alerta?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-3.5 ${alerta ? "border-coral/40 bg-coral-suave" : "border-border bg-card"}`}>
      <p className="text-xs text-muted-foreground">{rotulo}</p>
      <p className="mt-1 truncate font-display text-lg font-semibold leading-tight">{valor}</p>
      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
        {alerta ? <AlertCircle className="h-3 w-3 text-coral" /> : null}
        {detalhe}
      </p>
    </div>
  );
}
