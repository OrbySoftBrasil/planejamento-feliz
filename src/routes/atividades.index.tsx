import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { ActivityCard } from "@/components/ActivityCard";
import { AppShell } from "@/components/AppShell";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/atividades/")({
  head: () => ({
    meta: [
      { title: "Biblioteca de atividades da turma · Planeja" },
      {
        name: "description",
        content:
          "Encontre rapidamente as atividades que você já criou, filtrando por tema, duração e faixa etária.",
      },
      { property: "og:title", content: "Biblioteca de atividades · Planeja" },
      {
        property: "og:description",
        content: "Todas as atividades da professora organizadas e fáceis de reaproveitar.",
      },
    ],
  }),
  component: Biblioteca,
});

const filtros = ["Todas", "Água", "Natureza", "Identidade"];

function Biblioteca() {
  const { atividades } = usePlanner();
  const [busca, setBusca] = useState("");
  const [tema, setTema] = useState("Todas");
  const [curtas, setCurtas] = useState(false);

  const lista = atividades.filter((a) => {
    const texto = `${a.titulo} ${a.objetivo} ${a.tags.join(" ")}`.toLowerCase();
    return (
      texto.includes(busca.toLowerCase()) &&
      (tema === "Todas" || a.tema === tema) &&
      (!curtas || a.duracao <= 30)
    );
  });

  return (
    <AppShell titulo="Atividades" subtitulo="Tudo o que você já criou, pronto para usar de novo.">
      <div className="space-y-4">
        <label className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por tema, material ou palavra"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {filtros.map((f) => (
            <button
              key={f}
              onClick={() => setTema(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                tema === f ? "bg-primary text-primary-foreground" : "bg-card border border-border"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => setCurtas((v) => !v)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              curtas ? "bg-primary text-primary-foreground" : "bg-card border border-border"
            }`}
          >
            Até 30 min
          </button>
        </div>

        <Link
          to="/atividades/nova"
          className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/50 bg-accent/40 p-4 font-medium text-primary"
        >
          <Plus className="h-5 w-5 shrink-0" /> Criar nova atividade
        </Link>

        <div className="space-y-3">
          {lista.map((a) => (
            <ActivityCard key={a.id} atividade={a} />
          ))}
          {!lista.length ? (
            <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              Nada encontrado. Tente outra palavra ou crie uma atividade nova.
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
