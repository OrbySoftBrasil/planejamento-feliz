import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Printer, RotateCcw, Star } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  campoCurto,
  camposExperiencia,
  formatarCurto,
  planoAnual,
  professora,
} from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil e minha turma · Planeja" },
      {
        name: "description",
        content: "Informações da professora, da turma e das preferências que o assistente usa para planejar.",
      },
      { property: "og:title", content: "Meu perfil · Planeja" },
      { property: "og:description", content: "Suas preferências pedagógicas e o contexto da Turma Girassol." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { atividades, registros, slots, restaurarDemo, materiais, modeloEscola, atualizarModelo } =
    usePlanner();
  const [confirmando, setConfirmando] = useState(false);

  const feitos = slots.filter((s) => s.status === "feito").length;
  const media = registros.length
    ? (registros.reduce((s, r) => s + r.engajamento, 0) / registros.length).toFixed(1)
    : "—";
  const favoritas = atividades.filter((a) => a.favorita).length;

  const porCampo = camposExperiencia.map((c) => ({
    campo: c,
    total: slots.filter((s) => {
      const a = atividades.find((x) => x.id === s.atividadeId);
      return a?.campo === c;
    }).length,
  }));
  const maior = Math.max(1, ...porCampo.map((p) => p.total));

  return (
    <AppShell titulo="Meu perfil" subtitulo={`${professora.escola} · ${professora.turma}`}>
      <div className="space-y-5">
        <section className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-sol-suave font-display text-xl font-bold">
            {professora.iniciais}
          </span>
          <div className="min-w-0">
            <p className="font-display text-xl font-semibold">{professora.nome} {professora.sobrenome}</p>
            <p className="text-sm text-muted-foreground">
              {professora.turma} · {professora.criancas} crianças de {professora.idade}
            </p>
            <p className="text-sm text-muted-foreground">{professora.periodo}</p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Mini rotulo="Atividades" valor={`${atividades.length}`} />
          <Mini rotulo="Momentos feitos" valor={`${feitos}`} />
          <Mini rotulo="Registros" valor={`${registros.length}`} />
          <Mini rotulo="Engajamento" valor={media} />
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Equilíbrio entre os campos</h2>
          <p className="text-sm text-muted-foreground">O que você mais trabalhou nas semanas planejadas.</p>
          <div className="mt-4 space-y-2.5">
            {porCampo.map((p) => (
              <div key={p.campo} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">{campoCurto[p.campo]}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(p.total / maior) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-xs font-medium">{p.total}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Projeto do ano</h2>
          <p className="mt-1 font-medium">{planoAnual.titulo}</p>
          <p className="mt-1 text-sm text-muted-foreground">{planoAnual.intencao}</p>
          <Link
            to="/planejamento"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            Ver o planejamento anual <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Como eu gosto de trabalhar</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {professora.preferencias.map((p) => (
              <li key={p} className="flex gap-2">
                <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sol" /> {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">{professora.particularidades}</p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Materiais em falta na escola</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {materiais
              .filter((m) => m.status === "preciso")
              .map((m) => (
                <span key={m.id} className="rounded-full bg-coral-suave px-3 py-1.5 text-sm">
                  {m.nome}
                </span>
              ))}
            {materiais.every((m) => m.status !== "preciso") ? (
              <span className="text-sm text-muted-foreground">Nada faltando agora.</span>
            ) : null}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            O assistente evita sugerir atividades que dependam desses materiais.
          </p>
          <Link
            to="/materiais"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            Editar a lista de materiais <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Modelo de folha da escola</h2>
          <p className="text-sm text-muted-foreground">
            Vale para todas as atividades ilustradas que você baixar ou imprimir.
          </p>

          <div className="mt-4 space-y-3">
            <label className="block text-sm font-semibold">
              Nome da escola
              <input
                value={modeloEscola.escola}
                onChange={(e) => atualizarModelo({ escola: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Marca d'água
                <input
                  value={modeloEscola.marcaDagua}
                  onChange={(e) => atualizarModelo({ marcaDagua: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal"
                />
              </label>
              <label className="block text-sm font-semibold">
                Sigla do logo
                <input
                  value={modeloEscola.logoTexto}
                  maxLength={3}
                  onChange={(e) => atualizarModelo({ logoTexto: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal"
                />
              </label>
            </div>
            <label className="block text-sm font-semibold">
              Rodapé
              <input
                value={modeloEscola.rodape}
                onChange={(e) => atualizarModelo({ rodape: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-normal"
              />
            </label>

            <div>
              <p className="text-sm font-semibold">Campos na folha</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {([
                  ["mostrarNome", "Nome da criança"],
                  ["mostrarTurma", "Turma"],
                  ["mostrarData", "Data"],
                ] as const).map(([chave, rotulo]) => (
                  <button
                    key={chave}
                    onClick={() => atualizarModelo({ [chave]: !modeloEscola[chave] })}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      modeloEscola[chave] ? "bg-primary text-primary-foreground" : "border border-border"
                    }`}
                  >
                    {rotulo}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Cor da borda</p>
              <div className="mt-2 flex gap-2">
                {(["agua", "sol", "folha", "coral"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => atualizarModelo({ cor: c })}
                    aria-label={`Cor ${c}`}
                    className={`h-9 w-9 rounded-full border-2 ${
                      modeloEscola.cor === c ? "border-foreground" : "border-transparent"
                    } bg-${c}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Minha turma</h2>
          <p className="text-sm text-muted-foreground">
            {professora.criancas} crianças, com observações que ajudam a adaptar as atividades.
          </p>
          <Link
            to="/turma"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            Ver a Turma Girassol <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        {registros.length ? (
          <section className="rounded-3xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Últimos registros</h2>
            <ul className="mt-3 space-y-2">
              {[...registros]
                .sort((a, b) => b.data.localeCompare(a.data))
                .slice(0, 4)
                .map((r) => {
                  const a = atividades.find((x) => x.id === r.atividadeId);
                  return (
                    <li key={r.id} className="rounded-xl bg-background p-3 text-sm">
                      <p className="font-medium">{a?.titulo ?? "Atividade"}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatarCurto(r.data)} · engajamento {r.engajamento}/5
                      </p>
                      <p className="mt-1 text-muted-foreground">{r.comentario}</p>
                    </li>
                  );
                })}
            </ul>
          </section>
        ) : null}

        <section className="space-y-2">
          <button
            onClick={() => window.print()}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left font-medium"
          >
            <Printer className="h-5 w-5 text-primary" /> Imprimir esta página
          </button>
          <button
            onClick={() => {
              if (!confirmando) {
                setConfirmando(true);
                return;
              }
              restaurarDemo();
              setConfirmando(false);
              toast.success("Tudo voltou ao exemplo inicial");
            }}
            className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left font-medium ${
              confirmando ? "border-coral bg-coral-suave" : "border-border bg-card"
            }`}
          >
            <RotateCcw className="h-5 w-5 text-coral" />
            {confirmando ? "Tem certeza? Toque de novo para restaurar" : "Voltar ao exemplo inicial"}
          </button>
          <p className="px-1 text-xs text-muted-foreground">
            Protótipo de demonstração. Tudo o que você faz fica guardado apenas neste navegador.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

function Mini({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{rotulo}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{valor}</p>
    </div>
  );
}
