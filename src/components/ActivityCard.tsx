import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Star, Users } from "lucide-react";
import { campoCurto, type Atividade } from "@/data/mock";
import { corDoCampo } from "@/lib/ui";
import { usePlanner } from "@/lib/planner-store";

export function ActivityCard({ atividade, compacto }: { atividade: Atividade; compacto?: boolean }) {
  const { usosDaAtividade, registrosDaAtividade } = usePlanner();
  const usos = usosDaAtividade(atividade.id);
  const registros = registrosDaAtividade(atividade.id);
  const media = registros.length
    ? registros.reduce((s, r) => s + r.engajamento, 0) / registros.length
    : null;
  const cor = corDoCampo(atividade.campo);

  return (
    <Link
      to="/atividades/$id"
      params={{ id: atividade.id }}
      className="block rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-display text-lg font-semibold leading-snug">{atividade.titulo}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${cor.chip}`}>
          {campoCurto[atividade.campo]}
        </span>
      </div>
      {!compacto ? (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{atividade.objetivo}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {atividade.duracao} min
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {atividade.organizacao}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {atividade.espaco}
        </span>
        {usos > 0 ? <span>· usada {usos}x</span> : <span>· nunca usada</span>}
        {media ? (
          <span className="flex items-center gap-1 text-sol">
            <Star className="h-3.5 w-3.5 fill-current" /> {media.toFixed(1)}
          </span>
        ) : null}
        {atividade.favorita ? <Star className="h-3.5 w-3.5 fill-current text-sol" /> : null}
      </div>
    </Link>
  );
}
