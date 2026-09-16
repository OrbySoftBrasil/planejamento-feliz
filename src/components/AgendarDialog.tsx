import { useState } from "react";
import { toast } from "sonner";
import {
  HOJE_ISO,
  addDias,
  diasUteis,
  formatarCurto,
  inicioDaSemana,
  momentoHorario,
  momentos,
  nomeDia,
  parseISO,
  type Atividade,
  type Momento,
} from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AgendarDialog({
  atividade,
  aberto,
  onFechar,
  dataSugerida,
  momentoSugerido = "Atividade principal",
}: {
  atividade: Atividade;
  aberto: boolean;
  onFechar: () => void;
  dataSugerida?: string;
  momentoSugerido?: Momento;
}) {
  const { agendar, slotsDoDia } = usePlanner();
  const [semana, setSemana] = useState(inicioDaSemana(dataSugerida ?? HOJE_ISO));
  const [data, setData] = useState(dataSugerida ?? HOJE_ISO);
  const [momento, setMomento] = useState<Momento>(momentoSugerido);

  const ocupado = slotsDoDia(data).find((s) => s.momento === momento);

  return (
    <Dialog open={aberto} onOpenChange={(o) => (!o ? onFechar() : null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Colocar no planejamento</DialogTitle>
          <DialogDescription>{atividade.titulo}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between text-sm">
          <button onClick={() => setSemana(addDias(semana, -7))} className="rounded-lg px-2 py-1 hover:bg-accent">
            ‹ semana
          </button>
          <span className="text-muted-foreground">
            {formatarCurto(semana)} a {formatarCurto(addDias(semana, 4))}
          </span>
          <button onClick={() => setSemana(addDias(semana, 7))} className="rounded-lg px-2 py-1 hover:bg-accent">
            semana ›
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {diasUteis(semana).map((d) => (
            <button
              key={d}
              onClick={() => setData(d)}
              className={`rounded-xl border p-2 text-center text-sm ${
                data === d ? "border-primary bg-accent font-semibold text-primary" : "border-border"
              }`}
            >
              <span className="block text-xs text-muted-foreground">{nomeDia(d).slice(0, 3)}</span>
              {parseISO(d).getDate()}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          {momentos.map((m) => (
            <button
              key={m}
              onClick={() => setMomento(m)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm ${
                momento === m ? "border-primary bg-accent" : "border-border"
              }`}
            >
              <span className="w-11 shrink-0 text-xs text-muted-foreground">{momentoHorario[m]}</span>
              <span className="flex-1">{m}</span>
            </button>
          ))}
        </div>

        {ocupado ? (
          <p className="rounded-xl bg-sol-suave p-3 text-sm">
            Esse momento já tem <strong>{ocupado.titulo}</strong>. Salvar vai substituir.
          </p>
        ) : null}

        <button
          onClick={() => {
            agendar({ atividade, data, momento });
            toast.success(`Salvo em ${nomeDia(data).toLowerCase()}, ${formatarCurto(data)}`);
            onFechar();
          }}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
        >
          Salvar no planejamento
        </button>
      </DialogContent>
    </Dialog>
  );
}
