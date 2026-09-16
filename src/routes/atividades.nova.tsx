import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { ActivityCard } from "@/components/ActivityCard";
import { AppShell } from "@/components/AppShell";
import { professora } from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/atividades/nova")({
  head: () => ({
    meta: [
      { title: "Criar atividade para a turma · Planeja" },
      {
        name: "description",
        content:
          "Antes de criar, veja atividades parecidas que você já tem e monte uma proposta adaptada à sua turma.",
      },
      { property: "og:title", content: "Criar atividade · Planeja" },
      {
        property: "og:description",
        content: "Monte uma atividade nova em poucos campos, com sugestões do que já existe.",
      },
    ],
  }),
  component: NovaAtividade,
});

function NovaAtividade() {
  const { atividades, salvarAtividade } = usePlanner();
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [tema, setTema] = useState("");
  const [duracao, setDuracao] = useState(30);
  const [objetivo, setObjetivo] = useState("");
  const [materiais, setMateriais] = useState<string[]>([professora.materiais[0]]);

  const parecidas = tema
    ? atividades
        .filter((a) => `${a.titulo} ${a.tema} ${a.tags.join(" ")}`.toLowerCase().includes(tema.toLowerCase()))
        .slice(0, 3)
    : [];

  function criar() {
    const nova = salvarAtividade({
      id: "",
      titulo: tema || "Atividade nova",
      tema: tema || "Geral",
      campo: "Espaços, tempos, quantidades, relações e transformações",
      faixa: professora.idade,
      duracao,
      materiais,
      objetivo: objetivo || "Explorar o tema com a turma de forma lúdica.",
      passos: [
        "Roda de conversa para apresentar o tema.",
        "Proposta principal em pequenos grupos.",
        "Registro em desenho e conversa final.",
      ],
      adaptacoes: ["Dividir em dois momentos se o grupo estiver agitado."],
      tags: [tema.toLowerCase()],
    });
    toast.success("Atividade criada!");
    navigate({ to: "/atividades/$id", params: { id: nova.id } });
  }

  return (
    <AppShell titulo="Criar atividade" subtitulo="Dois passos rápidos, sem complicação.">
      <button
        onClick={() => (etapa === 2 ? setEtapa(1) : navigate({ to: "/atividades" }))}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      {etapa === 1 ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <label className="block text-sm font-semibold">Sobre o que é a atividade?</label>
            <input
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex.: água, cores, nome próprio"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
            />
          </div>

          {parecidas.length ? (
            <div className="rounded-2xl border border-border bg-sol-suave p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4" /> Você já tem atividades parecidas
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Talvez dê para reaproveitar em vez de começar do zero.
              </p>
              <div className="mt-3 space-y-3">
                {parecidas.map((a) => (
                  <ActivityCard key={a.id} atividade={a} />
                ))}
              </div>
            </div>
          ) : null}

          <button
            onClick={() => setEtapa(2)}
            className="w-full rounded-2xl bg-primary px-4 py-3.5 font-semibold text-primary-foreground"
          >
            Continuar e criar nova
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <label className="block text-sm font-semibold">O que as crianças vão aprender?</label>
            <textarea
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              rows={3}
              placeholder="Escreva com suas palavras"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold">Quanto tempo você tem?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[20, 30, 45].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuracao(d)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    duracao === d ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                  }`}
                >
                  {d} minutos
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold">Materiais disponíveis</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {professora.materiais.map((m) => {
                const ativo = materiais.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() =>
                      setMateriais((prev) => (ativo ? prev.filter((x) => x !== m) : [...prev, m]))
                    }
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      ativo ? "bg-folha-suave border border-folha" : "border border-border bg-background"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={criar}
            className="w-full rounded-2xl bg-primary px-4 py-3.5 font-semibold text-primary-foreground"
          >
            Criar atividade
          </button>
        </div>
      )}
    </AppShell>
  );
}
