import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  HOJE_ISO,
  atividades as atividadesIniciais,
  registrosIniciais,
  slotsIniciais,
  type Atividade,
  type Momento,
  type Registro,
  type Slot,
} from "@/data/mock";

const CHAVE = "planeja:estado:v2";

type Persistido = {
  atividades: Atividade[];
  slots: Slot[];
  registros: Registro[];
  recadosLidos: string[];
};

type PlannerState = Persistido & {
  hoje: string;
  carregado: boolean;
  salvarAtividade: (a: Atividade) => Atividade;
  agendar: (args: { atividade: Atividade; data: string; momento: Momento; nota?: string }) => void;
  adicionarSlotLivre: (args: { data: string; momento: Momento; titulo: string }) => void;
  moverSlot: (id: string, data: string, momento: Momento) => void;
  removerSlot: (id: string) => void;
  alterarStatus: (id: string, status: Slot["status"]) => void;
  anotarSlot: (id: string, nota: string) => void;
  registrar: (r: Omit<Registro, "id">) => void;
  alternarFavorita: (id: string) => void;
  marcarRecadoLido: (id: string) => void;
  restaurarDemo: () => void;
  atividadePorId: (id?: string) => Atividade | undefined;
  registrosDaAtividade: (id: string) => Registro[];
  slotsDoDia: (data: string) => Slot[];
  slotsDaSemana: (inicio: string) => Slot[];
  usosDaAtividade: (id: string) => number;
  pendenciaAguaResolvida: boolean;
};

const PlannerContext = createContext<PlannerState | null>(null);

const estadoInicial: Persistido = {
  atividades: atividadesIniciais,
  slots: slotsIniciais,
  registros: registrosIniciais,
  recadosLidos: [],
};

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Persistido>(estadoInicial);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const bruto = window.localStorage.getItem(CHAVE);
      if (bruto) setEstado({ ...estadoInicial, ...(JSON.parse(bruto) as Persistido) });
    } catch {
      /* ignora */
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch {
      /* ignora */
    }
  }, [estado, carregado]);

  const salvarAtividade = useCallback((a: Atividade) => {
    const nova: Atividade = {
      ...a,
      id: !a.id || a.id === "nova-agua" ? `n${Date.now()}` : a.id,
    };
    setEstado((prev) => ({
      ...prev,
      atividades: prev.atividades.some((p) => p.id === nova.id)
        ? prev.atividades.map((p) => (p.id === nova.id ? nova : p))
        : [nova, ...prev.atividades],
    }));
    return nova;
  }, []);

  const agendar = useCallback(
    ({
      atividade,
      data,
      momento,
      nota,
    }: {
      atividade: Atividade;
      data: string;
      momento: Momento;
      nota?: string;
    }) => {
      setEstado((prev) => {
        const slot: Slot = {
          id: `s${Date.now()}`,
          data,
          momento,
          titulo: atividade.titulo,
          atividadeId: atividade.id,
          tipo: atividade.tags.includes("projeto") ? "projeto" : "atividade",
          status: "planejado",
        };
        if (nota) slot.nota = nota;
        return {
          ...prev,
          slots: [...prev.slots.filter((s) => !(s.data === data && s.momento === momento)), slot],
        };
      });
    },
    [],
  );

  const adicionarSlotLivre = useCallback(
    ({ data, momento, titulo }: { data: string; momento: Momento; titulo: string }) => {
      setEstado((prev) => ({
        ...prev,
        slots: [
          ...prev.slots.filter((s) => !(s.data === data && s.momento === momento)),
          { id: `s${Date.now()}`, data, momento, titulo, tipo: "rotina", status: "planejado" },
        ],
      }));
    },
    [],
  );

  const moverSlot = useCallback((id: string, data: string, momento: Momento) => {
    setEstado((prev) => {
      const alvo = prev.slots.find((s) => s.id === id);
      if (!alvo) return prev;
      const outros = prev.slots.filter((s) => s.id !== id && !(s.data === data && s.momento === momento));
      return { ...prev, slots: [...outros, { ...alvo, data, momento }] };
    });
  }, []);

  const removerSlot = useCallback((id: string) => {
    setEstado((prev) => ({ ...prev, slots: prev.slots.filter((s) => s.id !== id) }));
  }, []);

  const alterarStatus = useCallback((id: string, status: Slot["status"]) => {
    setEstado((prev) => ({
      ...prev,
      slots: prev.slots.map((s) => (s.id === id ? { ...s, status } : s)),
    }));
  }, []);

  const anotarSlot = useCallback((id: string, nota: string) => {
    setEstado((prev) => ({
      ...prev,
      slots: prev.slots.map((s) => (s.id === id ? { ...s, nota } : s)),
    }));
  }, []);

  const registrar = useCallback((r: Omit<Registro, "id">) => {
    setEstado((prev) => ({
      ...prev,
      registros: [{ ...r, id: `rg${Date.now()}` }, ...prev.registros],
    }));
  }, []);

  const alternarFavorita = useCallback((id: string) => {
    setEstado((prev) => ({
      ...prev,
      atividades: prev.atividades.map((a) => (a.id === id ? { ...a, favorita: !a.favorita } : a)),
    }));
  }, []);

  const marcarRecadoLido = useCallback((id: string) => {
    setEstado((prev) => ({
      ...prev,
      recadosLidos: prev.recadosLidos.includes(id) ? prev.recadosLidos : [...prev.recadosLidos, id],
    }));
  }, []);

  const restaurarDemo = useCallback(() => setEstado(estadoInicial), []);

  const value = useMemo<PlannerState>(() => {
    const { atividades, slots, registros } = estado;
    return {
      ...estado,
      hoje: HOJE_ISO,
      carregado,
      salvarAtividade,
      agendar,
      adicionarSlotLivre,
      moverSlot,
      removerSlot,
      alterarStatus,
      anotarSlot,
      registrar,
      alternarFavorita,
      marcarRecadoLido,
      restaurarDemo,
      atividadePorId: (id?: string) => (id ? atividades.find((a) => a.id === id) : undefined),
      registrosDaAtividade: (id: string) => registros.filter((r) => r.atividadeId === id),
      slotsDoDia: (data: string) => slots.filter((s) => s.data === data),
      slotsDaSemana: (inicio: string) =>
        slots.filter((s) => s.data >= inicio && s.data <= addISO(inicio, 4)),

      usosDaAtividade: (id: string) => slots.filter((s) => s.atividadeId === id).length,
      pendenciaAguaResolvida: slots.some(
        (s) => s.data === "2026-03-20" && s.momento === "Atividade principal",
      ),
    };
  }, [
    estado,
    carregado,
    salvarAtividade,
    agendar,
    adicionarSlotLivre,
    moverSlot,
    removerSlot,
    alterarStatus,
    anotarSlot,
    registrar,
    alternarFavorita,
    marcarRecadoLido,
    restaurarDemo,
  ]);

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

function addISO(iso: string, n: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner precisa estar dentro de PlannerProvider");
  return ctx;
}
