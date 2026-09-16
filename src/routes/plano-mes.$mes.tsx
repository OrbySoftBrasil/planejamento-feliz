import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Copy, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  campoCurto,
  camposExperiencia,
  nomeMes,
  type CampoExperiencia,
  type PlanoMensal,
} from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/plano-mes/$mes")({
  head: () => ({
    meta: [
      { title: "Criar e editar o planejamento do mês · Planeja" },
      {
        name: "description",
        content: "Defina o tema do mês, os focos de trabalho, os campos de experiência e a mostra final.",
      },
      { property: "og:title", content: "Planejamento do mês · Planeja" },
      { property: "og:description", content: "Tema, focos e campos de experiência do mês da sua turma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanoMes,
});

function PlanoMes() {
  const { mes: param } = Route.useParams();
  const navigate = useNavigate();
  const { planosMensais, salvarPlanoMensal, removerPlanoMensal, planoAnual } = usePlanner();

  const [anoStr, mesStr] = param.split("-");
  const ano = Number(anoStr) || planoAnual.ano;
  const numMes = Number(mesStr) || 1;
  const existente = planosMensais.find((p) => p.mes === numMes && p.ano === ano);
  const anterior = planosMensais.find((p) => p.mes === numMes - 1 && p.ano === ano);

  const [plano, setPlano] = useState<PlanoMensal>(
    existente ?? {
      mes: numMes,
      ano,
      tema: "",
      bimestre: planoAnual.bimestres[0]?.bimestre ?? "1º bimestre",
      status: "rascunho",
      focos: [],
      camposPrioritarios: [],
    },
  );
  const [novoFoco, setNovoFoco] = useState("");

  function mudar(patch: Partial<PlanoMensal>) {
    setPlano((p) => ({ ...p, ...patch }));
  }

  function salvar() {
    if (!plano.tema.trim()) {
      toast.error("Escreva o tema do mês.");
      return;
    }
    salvarPlanoMensal(plano);
    toast.success(`${nomeMes(plano.mes - 1)} salvo no planejamento.`);
    navigate({ to: "/planejamento", search: { aba: "mes" } });
  }

  return (
    <AppShell
      titulo={`${nomeMes(numMes - 1)} de ${ano}`}
      subtitulo={existente ? "Edite o plano deste mês." : "Monte o plano deste mês."}
    >
      <Link to="/planejamento" className="no-print mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar ao planejamento
      </Link>

      <section className="space-y-5 rounded-2xl border border-border bg-card p-5">
        <div>
          <label className="text-sm font-semibold">Tema do mês</label>
          <input
            value={plano.tema}
            onChange={(e) => mudar({ tema: e.target.value })}
            placeholder="Ex.: Água e vida"
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Bimestre</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {planoAnual.bimestres.map((b) => (
              <button
                key={b.bimestre}
                onClick={() => mudar({ bimestre: b.bimestre })}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  plano.bimestre === b.bimestre ? "bg-primary text-primary-foreground" : "border border-border"
                }`}
              >
                {b.bimestre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">O que a turma vai investigar</label>
          <ul className="mt-2 space-y-2">
            {plano.focos.map((f, i) => (
              <li key={`${f}-${i}`} className="flex items-center gap-2">
                <input
                  value={f}
                  onChange={(e) => mudar({ focos: plano.focos.map((x, j) => (j === i ? e.target.value : x)) })}
                  className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
                <button onClick={() => mudar({ focos: plano.focos.filter((_, j) => j !== i) })} aria-label="Remover">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <input
              value={novoFoco}
              onChange={(e) => setNovoFoco(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && novoFoco.trim()) {
                  mudar({ focos: [...plano.focos, novoFoco.trim()] });
                  setNovoFoco("");
                }
              }}
              placeholder="Ex.: De onde vem a água que usamos"
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                if (!novoFoco.trim()) return;
                mudar({ focos: [...plano.focos, novoFoco.trim()] });
                setNovoFoco("");
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Incluir
            </button>
          </div>
          {anterior && plano.focos.length === 0 ? (
            <button
              onClick={() => {
                mudar({ focos: anterior.focos, camposPrioritarios: anterior.camposPrioritarios });
                toast.success("Copiei os focos do mês anterior. Ajuste como quiser.");
              }}
              className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-primary"
            >
              <Copy className="h-3.5 w-3.5" /> Copiar de {nomeMes(anterior.mes - 1)}
            </button>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-semibold">Campos de experiência em foco</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {camposExperiencia.map((c) => {
              const ativo = plano.camposPrioritarios.includes(c);
              return (
                <button
                  key={c}
                  onClick={() =>
                    mudar({
                      camposPrioritarios: ativo
                        ? plano.camposPrioritarios.filter((x) => x !== c)
                        : [...plano.camposPrioritarios, c as CampoExperiencia],
                    })
                  }
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    ativo ? "bg-primary text-primary-foreground" : "border border-border"
                  }`}
                >
                  {campoCurto[c]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Como o mês termina (opcional)</label>
          <input
            value={plano.saida ?? ""}
            onChange={(e) => mudar({ saida: e.target.value })}
            placeholder="Ex.: Mostra de desenhos do projeto, dia 30"
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Situação</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["rascunho", "planejado", "em andamento", "concluído"] as const).map((s) => (
              <button
                key={s}
                onClick={() => mudar({ status: s })}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  plano.status === s ? "bg-primary text-primary-foreground" : "border border-border"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={salvar}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Salvar mês
          </button>
          {existente ? (
            <button
              onClick={() => {
                removerPlanoMensal(numMes, ano);
                toast.success("Mês removido do planejamento.");
                navigate({ to: "/planejamento", search: { aba: "mes" } });
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-coral"
            >
              <Trash2 className="h-4 w-4" /> Excluir mês
            </button>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
