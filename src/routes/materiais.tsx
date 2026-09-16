import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Download, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { HOJE_ISO, addDias, formatarCurto, inicioDaSemana } from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";
import { baixarTexto } from "@/lib/download";

export const Route = createFileRoute("/materiais")({
  head: () => ({
    meta: [
      { title: "Lista de materiais da turma · Planeja" },
      {
        name: "description",
        content:
          "Veja os materiais das atividades da semana, marque o que já tem e organize o que precisa pedir.",
      },
      { property: "og:title", content: "Materiais · Planeja" },
      { property: "og:description", content: "Materiais da semana e lista do que falta, em um lugar só." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Materiais,
});

function Materiais() {
  const { materiais, adicionarMaterial, atualizarMaterial, removerMaterial, materiaisDaSemana } = usePlanner();
  const [novo, setNovo] = useState("");
  const [semana, setSemana] = useState(inicioDaSemana(HOJE_ISO));

  const daSemana = useMemo(() => materiaisDaSemana(semana), [materiaisDaSemana, semana]);
  const faltando = materiais.filter((m) => m.status === "preciso");

  function adicionar() {
    const nome = novo.trim();
    if (!nome) return;
    adicionarMaterial(nome);
    setNovo("");
    toast.success("Adicionado à lista do que falta.");
  }

  return (
    <AppShell titulo="Materiais" subtitulo="O que a semana pede e o que ainda falta comprar ou pedir.">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Materiais da semana</h2>
            <p className="text-sm text-muted-foreground">
              {formatarCurto(semana)} a {formatarCurto(addDias(semana, 4))} · juntados das atividades planejadas
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSemana(addDias(semana, -7))}
              className="rounded-xl border border-border px-3 py-2 text-sm"
            >
              Semana anterior
            </button>
            <button
              onClick={() => setSemana(addDias(semana, 7))}
              className="rounded-xl border border-border px-3 py-2 text-sm"
            >
              Próxima
            </button>
          </div>
        </div>

        {daSemana.length === 0 ? (
          <p className="mt-4 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            Nenhuma atividade com materiais nesta semana.{" "}
            <Link to="/planejamento" className="font-semibold text-primary">
              Abrir o planejamento
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {daSemana.map((m) => (
              <li
                key={m.nome}
                className="flex items-start gap-3 rounded-xl border border-border bg-background p-3"
              >
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                    m.tenho ? "border-folha bg-folha text-primary-foreground" : "border-border"
                  }`}
                >
                  {m.tenho ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{m.nome}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {m.atividades.join(" · ")}
                  </span>
                </span>
                {m.tenho ? (
                  <span className="shrink-0 rounded-full bg-folha-suave px-2.5 py-1 text-xs font-medium">
                    já tenho
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      adicionarMaterial(m.nome);
                      toast.success("Foi para a lista do que falta.");
                    }}
                    className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs font-medium"
                  >
                    preciso pedir
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() =>
            baixarTexto(
              `Materiais da semana de ${formatarCurto(semana)}\n\n` +
                daSemana.map((m) => `[${m.tenho ? "x" : " "}] ${m.nome} (${m.atividades.join(", ")})`).join("\n"),
              `materiais-${semana}`,
            )
          }
          className="no-print mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold"
        >
          <Download className="h-4 w-4" /> Baixar lista da semana
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Minha lista de materiais</h2>
        <p className="text-sm text-muted-foreground">
          {faltando.length} item(ns) para pedir ou comprar.
        </p>

        <div className="mt-4 flex gap-2">
          <input
            value={novo}
            onChange={(e) => setNovo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionar()}
            placeholder="Ex.: cola colorida"
            className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
          />
          <button
            onClick={adicionar}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {materiais.map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
              <button
                onClick={() =>
                  atualizarMaterial(m.id, { status: m.status === "preciso" ? "tenho" : "preciso" })
                }
                aria-label="Alternar se já tenho"
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                  m.status === "preciso" ? "border-border" : "border-folha bg-folha text-primary-foreground"
                }`}
              >
                {m.status === "preciso" ? <ShoppingBasket className="h-3.5 w-3.5" /> : <Check className="h-4 w-4" />}
              </button>
              <input
                value={m.nome}
                onChange={(e) => atualizarMaterial(m.id, { nome: e.target.value })}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
              />
              <input
                value={m.nota ?? ""}
                onChange={(e) => atualizarMaterial(m.id, { nota: e.target.value })}
                placeholder="anotação"
                className="hidden w-40 bg-transparent text-xs text-muted-foreground outline-none sm:block"
              />
              <button
                onClick={() => removerMaterial(m.id)}
                aria-label="Remover material"
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
