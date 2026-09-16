import { Link } from "@tanstack/react-router";
import { Clock, Users } from "lucide-react";
import type { Atividade } from "@/data/mock";

export function ActivityCard({ atividade }: { atividade: Atividade }) {
  return (
    <Link
      to="/atividades/$id"
      params={{ id: atividade.id }}
      className="block rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-display text-lg font-semibold leading-snug">{atividade.titulo}</h3>
        <span className="shrink-0 rounded-full bg-agua-suave px-2.5 py-1 text-xs font-medium text-foreground">
          {atividade.tema}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{atividade.objetivo}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {atividade.duracao} min
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {atividade.faixa}
        </span>
      </div>
    </Link>
  );
}
