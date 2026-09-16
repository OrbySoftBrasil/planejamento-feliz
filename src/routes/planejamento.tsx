import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarRange,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Plus,
  Printer,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  HOJE_ISO,
  addDias,
  camposExperiencia,
  campoCurto,
  diasCurtos,
  diasUteis,
  eventos,
  formatarCurto,
  inicioDaSemana,
  momentoHorario,
  momentos,
  nomeDia,
  nomeMes,
  parseISO,
  planoAnual,
  planosMensais,
  type Momento,
  type Slot,
} from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";
import { corDoCampo, pontoDoTipo } from "@/lib/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Aba = "semana" | "mes" | "ano";

export const Route = createFileRoute("/planejamento")({
  validateSearch: (s: Record<string, unknown>): { aba?: Aba } => {
    const aba = s["aba"];
    return aba === "semana" || aba === "mes" || aba === "ano" ? { aba } : {};
  },
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Planejamento,
});

function Planejamento() {
  const { aba: abaInicial } = Route.useSearch();
  const [aba, setAba] = useState<Aba>(abaInicial ?? "semana");
  const [inicio, setInicio] = useState(inicioDaSemana(HOJE_ISO));

  return (
    <AppShell titulo="Planejamento" subtitulo="Do ano para o mês, do mês para a semana.">
      <div className="no-print mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-1.5">
        {(
          [
            ["semana", "Semana"],
            ["mes", "Mês"],
            ["ano", "Ano"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              aba === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {aba === "semana" ? <Semana inicio={inicio} setInicio={setInicio} /> : null}
      {aba === "mes" ? <Mes irParaSemana={(i) => { setInicio(i); setAba("semana"); }} /> : null}
      {aba === "ano" ? <Ano /> : null}
    </AppShell>
  );
}

/* --------------------------------------------------------------- semana */

function Semana({ inicio, setInicio }: { inicio: string; setInicio: (v: string) => void }) {
  const { slotsDaSemana, atividadePorId, alterarStatus } = usePlanner();
  const [edicao, setEdicao] = useState<{ data: string; momento: Momento } | null>(null);
  const dias = diasUteis(inicio);
  const slots = slotsDaSemana(inicio);
  const mes = planosMensais.find((p) => p.mes === parseISO(inicio).getMonth() + 1);

  const atividadesDaSemana = slots
    .map((s) => atividadePorId(s.atividadeId))
    .filter(Boolean) as NonNullable<ReturnType<typeof atividadePorId>>[];

  const minutos = atividadesDaSemana.reduce((t, a) => t + a.duracao, 0);
  const camposCobertos = new Set(atividadesDaSemana.map((a) => a.campo));
  const materiais = Array.from(new Set(atividadesDaSemana.flatMap((a) => a.materiais)));

  const achar = (data: string, momento: Momento) =>
    slots.find((s) => s.data === data && s.momento === momento);

  return (
    <div className="space-y-5">
      <div className="no-print flex items-center justify-between gap-2 rounded-2xl border border-border bg-card p-2">
        <button
          onClick={() => setInicio(addDias(inicio, -7))}
          className="grid h-10 w-10 place-items-center rounded-xl hover:bg-accent"
          aria-label="Semana anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 text-center">
          <p className="truncate text-sm font-semibold">
            {formatarCurto(inicio)} a {formatarCurto(addDias(inicio, 4))}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Projeto {mes?.tema ?? "—"} · {nomeMes(parseISO(inicio).getMonth())}
          </p>
        </div>
        <button
          onClick={() => setInicio(addDias(inicio, 7))}
          className="grid h-10 w-10 place-items-center rounded-xl hover:bg-accent"
          aria-label="Próxima semana"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="no-print grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Mini rotulo="Atividades" valor={`${atividadesDaSemana.length}`} />
        <Mini rotulo="Tempo total" valor={`${Math.round(minutos / 60)}h${minutos % 60 ? ` ${minutos % 60}min` : ""}`} />
        <Mini rotulo="Campos cobertos" valor={`${camposCobertos.size}/5`} />
        <Mini rotulo="Materiais" valor={`${materiais.length}`} />
      </div>

      {/* grade */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="hidden lg:block">
          <div className="grid grid-cols-[8rem_repeat(5,minmax(0,1fr))] border-b border-border bg-background/60">
            <div className="p-3 text-xs text-muted-foreground">Momento</div>
            {dias.map((d) => (
              <div key={d} className={`p-3 text-center ${d === HOJE_ISO ? "bg-accent" : ""}`}>
                <p className="text-xs text-muted-foreground">{diasCurtos[parseISO(d).getDay()]}</p>
                <p className="font-semibold">{parseISO(d).getDate()}</p>
              </div>
            ))}
          </div>
          {momentos.map((m) => (
            <div key={m} className="grid grid-cols-[8rem_repeat(5,minmax(0,1fr))] border-b border-border last:border-0">
              <div className="p-3">
                <p className="text-sm font-medium leading-tight">{m}</p>
                <p className="text-xs text-muted-foreground">{momentoHorario[m]}</p>
              </div>
              {dias.map((d) => (
                <Celula
                  key={d + m}
                  slot={achar(d, m)}
                  onAbrir={() => setEdicao({ data: d, momento: m })}
                  onStatus={alterarStatus}
                />
              ))}
            </div>
          ))}
        </div>

        {/* mobile: por dia */}
        <div className="divide-y divide-border lg:hidden">
          {dias.map((d) => (
            <div key={d} className="p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg font-semibold">
                  {nomeDia(d)} <span className="text-muted-foreground">{parseISO(d).getDate()}</span>
                </h3>
                {d === HOJE_ISO ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-primary">hoje</span>
                ) : null}
              </div>
              <div className="mt-2 space-y-1.5">
                {momentos.map((m) => (
                  <LinhaMobile
                    key={m}
                    momento={m}
                    slot={achar(d, m)}
                    onAbrir={() => setEdicao({ data: d, momento: m })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* apoio */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">Campos de experiência da semana</h3>
          <ul className="mt-3 space-y-2">
            {camposExperiencia.map((c) => {
              const qtd = atividadesDaSemana.filter((a) => a.campo === c).length;
              return (
                <li key={c} className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${corDoCampo(c).ponto}`} />
                  <span className="min-w-0 flex-1 truncate text-sm">{campoCurto[c]}</span>
                  <span className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                    <span
                      className={`block h-full ${corDoCampo(c).ponto}`}
                      style={{ width: `${Math.min(100, qtd * 34)}%` }}
                    />
                  </span>
                  <span className="w-4 text-right text-xs text-muted-foreground">{qtd}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">Lista de materiais</h3>
          <p className="text-xs text-muted-foreground">Separe antes de segunda-feira.</p>
          <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {materiais.map((m) => (
              <li key={m} className="flex items-center gap-2 text-sm">
                <Circle className="h-3 w-3 text-muted-foreground" /> {m}
              </li>
            ))}
            {materiais.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nenhuma atividade planejada ainda.</li>
            ) : null}
          </ul>
          <button
            onClick={() => window.print()}
            className="no-print mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold"
          >
            <Printer className="h-4 w-4" /> Imprimir a semana
          </button>
        </div>
      </div>

      <div className="no-print rounded-2xl border border-border bg-agua-suave/60 p-4 text-sm">
        <p className="font-medium">Eventos desta semana</p>
        <ul className="mt-2 space-y-1">
          {eventos
            .filter((e) => e.data >= inicio && e.data <= addDias(inicio, 4))
            .map((e) => (
              <li key={e.titulo}>
                {formatarCurto(e.data)} — {e.titulo}
              </li>
            ))}
          {eventos.filter((e) => e.data >= inicio && e.data <= addDias(inicio, 4)).length === 0 ? (
            <li className="text-muted-foreground">Nenhum evento marcado.</li>
          ) : null}
        </ul>
      </div>

      {edicao ? (
        <EditorSlot
          data={edicao.data}
          momento={edicao.momento}
          slot={achar(edicao.data, edicao.momento)}
          onFechar={() => setEdicao(null)}
        />
      ) : null}
    </div>
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

function Celula({
  slot,
  onAbrir,
  onStatus,
}: {
  slot?: Slot | undefined;
  onAbrir: () => void;
  onStatus: (id: string, s: Slot["status"]) => void;
}) {
  if (!slot)
    return (
      <button
        onClick={onAbrir}
        className="group m-1.5 grid min-h-16 place-items-center rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/60 hover:bg-accent/40"
      >
        <Plus className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </button>
    );
  return (
    <div className="m-1.5 min-h-16 rounded-xl border border-border bg-background p-2 text-left">
      <button onClick={onAbrir} className="block w-full text-left">
        <span className="flex items-center gap-1.5">
          <span className={`h-2 w-2 shrink-0 rounded-full ${pontoDoTipo[slot.tipo]}`} />
          <span
            className={`line-clamp-2 text-xs font-medium leading-tight ${
              slot.status === "feito" ? "line-through opacity-60" : ""
            }`}
          >
            {slot.titulo}
          </span>
        </span>
      </button>
      <button
        onClick={() => onStatus(slot.id, slot.status === "feito" ? "planejado" : "feito")}
        className="mt-1.5 inline-flex items-center gap-1 text-[0.65rem] text-muted-foreground hover:text-foreground"
      >
        <Check className={`h-3 w-3 ${slot.status === "feito" ? "text-folha" : ""}`} />
        {slot.status === "feito" ? "feito" : "marcar"}
      </button>
    </div>
  );
}

function LinhaMobile({ momento, slot, onAbrir }: { momento: Momento; slot?: Slot; onAbrir: () => void }) {
  return (
    <button
      onClick={onAbrir}
      className="flex w-full items-center gap-2 rounded-xl bg-background p-3 text-left"
    >
      <span className="w-12 shrink-0 text-[0.7rem] text-muted-foreground">{momentoHorario[momento]}</span>
      {slot ? (
        <>
          <span className={`h-2 w-2 shrink-0 rounded-full ${pontoDoTipo[slot.tipo]}`} />
          <span className={`min-w-0 flex-1 truncate text-sm ${slot.status === "feito" ? "line-through opacity-60" : ""}`}>
            {slot.titulo}
          </span>
        </>
      ) : (
        <span className="flex flex-1 items-center gap-1.5 text-sm text-primary">
          <Plus className="h-4 w-4" /> Planejar {momento.toLowerCase()}
        </span>
      )}
    </button>
  );
}

function EditorSlot({
  data,
  momento,
  slot,
  onFechar,
}: {
  data: string;
  momento: Momento;
  slot?: Slot | undefined;
  onFechar: () => void;
}) {
  const { atividades, agendar, removerSlot, alterarStatus, anotarSlot, atividadePorId, registrosDaAtividade } =
    usePlanner();
  const [busca, setBusca] = useState("");
  const [nota, setNota] = useState(slot?.nota ?? "");
  const ativ = atividadePorId(slot?.atividadeId);

  const sugeridas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const base = atividades.filter(
      (a) =>
        !termo ||
        a.titulo.toLowerCase().includes(termo) ||
        a.tema.toLowerCase().includes(termo) ||
        a.tags.some((t) => t.includes(termo)),
    );
    return base
      .sort((a, b) => {
        const notaA = registrosDaAtividade(a.id).length + (a.favorita ? 2 : 0);
        const notaB = registrosDaAtividade(b.id).length + (b.favorita ? 2 : 0);
        return notaB - notaA;
      })
      .slice(0, 6);
  }, [atividades, busca, registrosDaAtividade]);

  return (
    <Dialog open onOpenChange={(o) => (!o ? onFechar() : null)}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {nomeDia(data)}, {formatarCurto(data)}
          </DialogTitle>
          <DialogDescription>
            {momento} · {momentoHorario[data === data ? momento : momento]}
          </DialogDescription>
        </DialogHeader>

        {slot ? (
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="font-medium">{slot.titulo}</p>
            {ativ ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {ativ.duracao} min · {ativ.organizacao} · {campoCurto[ativ.campo]}
              </p>
            ) : null}
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              onBlur={() => anotarSlot(slot.id, nota)}
              placeholder="Anotação para esse momento (ex.: separar bacias na véspera)"
              className="mt-3 w-full rounded-xl border border-border bg-card p-3 text-sm"
              rows={2}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  alterarStatus(slot.id, slot.status === "feito" ? "planejado" : "feito");
                  toast.success(slot.status === "feito" ? "Marcado como planejado" : "Marcado como feito");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium"
              >
                <Check className="h-4 w-4" /> {slot.status === "feito" ? "Desmarcar" : "Marcar feito"}
              </button>
              {slot.atividadeId ? (
                <Link
                  to="/atividades/$id"
                  params={{ id: slot.atividadeId }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
                >
                  Abrir atividade
                </Link>
              ) : null}
              <button
                onClick={() => {
                  removerSlot(slot.id);
                  toast("Removido do planejamento");
                  onFechar();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Remover
              </button>
            </div>
          </div>
        ) : null}

        <div>
          <p className="mb-2 text-sm font-semibold">
            {slot ? "Trocar por outra atividade" : "Escolher da minha biblioteca"}
          </p>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por tema, material ou título"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <div className="mt-2 space-y-1.5">
            {sugeridas.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  agendar({ atividade: a, data, momento });
                  toast.success(`“${a.titulo}” em ${nomeDia(data).toLowerCase()}`);
                  onFechar();
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-background p-3 text-left hover:bg-accent/50"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${corDoCampo(a.campo).ponto}`} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{a.titulo}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {a.duracao} min · {campoCurto[a.campo]}
                  </span>
                </span>
                <Plus className="h-4 w-4 shrink-0 text-primary" />
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/assistente"
              search={{ tema: "agua" }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              Pedir ideia ao assistente
            </Link>
            <Link
              to="/atividades/nova"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold"
            >
              Criar atividade
            </Link>
            <button
              onClick={onFechar}
              className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-muted-foreground"
            >
              <X className="h-4 w-4" /> Fechar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ mês */

function Mes({ irParaSemana }: { irParaSemana: (inicio: string) => void }) {
  const [indice, setIndice] = useState(planosMensais.findIndex((p) => p.mes === 3));
  const plano = planosMensais[Math.max(0, indice)]!;
  const { slots, atividadePorId } = usePlanner();

  const doMes = slots.filter((s) => parseISO(s.data).getMonth() + 1 === plano.mes);
  const atividadesMes = doMes.map((s) => atividadePorId(s.atividadeId)).filter(Boolean);
  const semanas = Array.from(new Set(doMes.map((s) => inicioDaSemana(s.data)))).sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card p-2">
        <button
          onClick={() => setIndice((i) => Math.max(0, i - 1))}
          className="grid h-10 w-10 place-items-center rounded-xl hover:bg-accent"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold">
            {nomeMes(plano.mes - 1)} de {plano.ano}
          </p>
          <p className="text-xs text-muted-foreground">{plano.bimestre} · {plano.status}</p>
        </div>
        <button
          onClick={() => setIndice((i) => Math.min(planosMensais.length - 1, i + 1))}
          className="grid h-10 w-10 place-items-center rounded-xl hover:bg-accent"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">Projeto do mês</p>
        <h3 className="font-display text-2xl font-semibold">{plano.tema}</h3>
        <ul className="mt-3 space-y-2">
          {plano.focos.map((f) => (
            <li key={f} className="flex gap-2 text-sm">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {f}
            </li>
          ))}
        </ul>
        {plano.saida ? (
          <p className="mt-4 rounded-xl bg-folha-suave p-3 text-sm">
            <strong>Fecho do projeto:</strong> {plano.saida}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {plano.camposPrioritarios.map((c) => (
            <span key={c} className={`rounded-full px-3 py-1 text-xs font-medium ${corDoCampo(c).chip}`}>
              {campoCurto[c]}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display text-lg font-semibold">Semanas do mês</h3>
        <p className="text-xs text-muted-foreground">
          {atividadesMes.length} atividades planejadas em {nomeMes(plano.mes - 1).toLowerCase()}.
        </p>
        <div className="mt-3 space-y-2">
          {semanas.map((s) => {
            const qtd = doMes.filter((x) => inicioDaSemana(x.data) === s && x.atividadeId).length;
            return (
              <button
                key={s}
                onClick={() => irParaSemana(s)}
                className="flex w-full items-center gap-3 rounded-xl bg-background p-3 text-left hover:bg-accent/50"
              >
                <CalendarRange className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {formatarCurto(s)} a {formatarCurto(addDias(s, 4))}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{qtd} atividades</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            );
          })}
          {semanas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ainda sem semanas planejadas neste mês.</p>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display text-lg font-semibold">Datas do mês</h3>
        <div className="mt-3 space-y-2">
          {eventos
            .filter((e) => parseISO(e.data).getMonth() + 1 === plano.mes)
            .sort((a, b) => a.data.localeCompare(b.data))
            .map((e) => (
              <div key={e.titulo} className="flex items-center gap-3 rounded-xl bg-background p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sol-suave text-sm font-bold">
                  {parseISO(e.data).getDate()}
                </span>
                <p className="min-w-0 text-sm">{e.titulo}</p>
              </div>
            ))}
        </div>
        <Link to="/calendario" className="mt-3 block text-center text-sm font-medium text-primary">
          Ver no calendário
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ ano */

function Ano() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">Projeto do ano · {planoAnual.ano}</p>
        <h3 className="font-display text-2xl font-semibold">{planoAnual.titulo}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{planoAnual.intencao}</p>
      </div>
      {planoAnual.bimestres.map((b) => (
        <div key={b.bimestre} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {b.bimestre} · {b.periodo}
              </p>
              <h3 className="font-display text-xl font-semibold">{b.tema}</h3>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                b.status === "em andamento"
                  ? "bg-agua-suave text-agua"
                  : b.status === "planejado"
                    ? "bg-sol-suave"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {b.status}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: `${b.progresso}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{b.progresso}% do período percorrido</p>
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
              <span key={p} className="rounded-full bg-folha-suave px-3 py-1 text-xs font-medium">
                {p}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
