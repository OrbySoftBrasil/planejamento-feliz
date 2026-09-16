import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  atividades as atividadesIniciais,
  registrosIniciais,
  slotsIniciais,
  type Atividade,
  type Registro,
  type Slot,
} from "@/data/mock";

type PlannerState = {
  atividades: Atividade[];
  slots: Slot[];
  registros: Registro[];
  pendenciaAguaResolvida: boolean;
  salvarAtividade: (a: Atividade) => Atividade;
  agendar: (args: { atividade: Atividade; dia: string; momento: string }) => void;
  registrar: (r: Registro) => void;
};

const PlannerContext = createContext<PlannerState | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [atividades, setAtividades] = useState<Atividade[]>(atividadesIniciais);
  const [slots, setSlots] = useState<Slot[]>(slotsIniciais);
  const [registros, setRegistros] = useState<Registro[]>(registrosIniciais);
  const [pendenciaAguaResolvida, setPendencia] = useState(false);

  const salvarAtividade = useCallback((a: Atividade) => {
    const nova = { ...a, id: a.id === "nova-agua" || !a.id ? `n${Date.now()}` : a.id };
    setAtividades((prev) =>
      prev.some((p) => p.id === nova.id) ? prev.map((p) => (p.id === nova.id ? nova : p)) : [nova, ...prev],
    );
    return nova;
  }, []);

  const agendar = useCallback(
    ({ atividade, dia, momento }: { atividade: Atividade; dia: string; momento: string }) => {
      setSlots((prev) => {
        const outros = prev.filter((s) => !(s.dia === dia && s.momento === momento));
        return [
          ...outros,
          {
            id: `s${Date.now()}`,
            dia,
            momento,
            titulo: atividade.titulo,
            atividadeId: atividade.id,
            tipo: "atividade",
          },
        ];
      });
      if (atividade.tema === "Água") setPendencia(true);
    },
    [],
  );

  const registrar = useCallback((r: Registro) => {
    setRegistros((prev) => [r, ...prev.filter((p) => p.atividadeId !== r.atividadeId)]);
  }, []);

  const value = useMemo(
    () => ({ atividades, slots, registros, pendenciaAguaResolvida, salvarAtividade, agendar, registrar }),
    [atividades, slots, registros, pendenciaAguaResolvida, salvarAtividade, agendar, registrar],
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner precisa estar dentro de PlannerProvider");
  return ctx;
}
