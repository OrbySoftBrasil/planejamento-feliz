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
  materiaisIniciais,
  modeloEscolaInicial,
  planoAnual as planoAnualInicial,
  planosMensais as planosMensaisIniciais,
  registrosIniciais,
  slotsIniciais,
  type Atividade,
  type ItemMaterial,
  type ModeloEscola,
  type Momento,
  type PlanoMensal,
  type Registro,
  type Slot,
} from "@/data/mock";

const CHAVE = "planeja:estado:v3";

export type Bimestre = (typeof planoAnualInicial)["bimestres"][number];
export type PlanoAnual = typeof planoAnualInicial;

export type Mensagem = {
  id: string;
  autor: "professora" | "assistente";
  texto: string;
  sugestao?: Atividade;
  em: string;
};

export type Conversa = {
  id: string;
  titulo: string;
  criadaEm: string;
  mensagens: Mensagem[];
};

type Persistido = {
  atividades: Atividade[];
  slots: Slot[];
  registros: Registro[];
  recadosLidos: string[];
  planoAnual: PlanoAnual;
  planosMensais: PlanoMensal[];
  materiais: ItemMaterial[];
  modeloEscola: ModeloEscola;
  conversas: Conversa[];
};

type PlannerState = Persistido & {
  hoje: string;
  carregado: boolean;
  salvarAtividade: (a: Atividade) => Atividade;
  atualizarAtividade: (id: string, patch: Partial<Atividade>) => void;
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
  /* planejamento */
  atualizarPlanoAnual: (patch: Partial<PlanoAnual>) => void;
  atualizarBimestre: (indice: number, patch: Partial<Bimestre>) => void;
  salvarPlanoMensal: (plano: PlanoMensal) => void;
  removerPlanoMensal: (mes: number, ano: number) => void;
  /* materiais */
  adicionarMaterial: (nome: string, status?: ItemMaterial["status"]) => void;
  atualizarMaterial: (id: string, patch: Partial<ItemMaterial>) => void;
  removerMaterial: (id: string) => void;
  /* modelo da escola */
  atualizarModelo: (patch: Partial<ModeloEscola>) => void;
  /* assistente */
  criarConversa: (titulo?: string) => Conversa;
  adicionarMensagem: (conversaId: string, m: Omit<Mensagem, "id" | "em">) => void;
  renomearConversa: (id: string, titulo: string) => void;
  removerConversa: (id: string) => void;
  /* seletores */
  atividadePorId: (id?: string) => Atividade | undefined;
  registrosDaAtividade: (id: string) => Registro[];
  slotsDoDia: (data: string) => Slot[];
  slotsDaSemana: (inicio: string) => Slot[];
  usosDaAtividade: (id: string) => number;
  planoDoMes: (mes: number, ano: number) => PlanoMensal | undefined;
  materiaisDaSemana: (inicio: string) => { nome: string; atividades: string[]; tenho: boolean }[];
  pendenciaAguaResolvida: boolean;
};

const PlannerContext = createContext<PlannerState | null>(null);

const estadoInicial: Persistido = {
  atividades: atividadesIniciais,
  slots: slotsIniciais,
  registros: registrosIniciais,
  recadosLidos: [],
  planoAnual: planoAnualInicial,
  planosMensais: planosMensaisIniciais,
  materiais: materiaisIniciais,
  modeloEscola: modeloEscolaInicial,
  conversas: [],
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

  const atualizarAtividade = useCallback((id: string, patch: Partial<Atividade>) => {
    setEstado((prev) => ({
      ...prev,
      atividades: prev.atividades.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
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

  const atualizarPlanoAnual = useCallback((patch: Partial<PlanoAnual>) => {
    setEstado((prev) => ({ ...prev, planoAnual: { ...prev.planoAnual, ...patch } }));
  }, []);

  const atualizarBimestre = useCallback((indice: number, patch: Partial<Bimestre>) => {
    setEstado((prev) => ({
      ...prev,
      planoAnual: {
        ...prev.planoAnual,
        bimestres: prev.planoAnual.bimestres.map((b, i) => (i === indice ? { ...b, ...patch } : b)),
      },
    }));
  }, []);

  const salvarPlanoMensal = useCallback((plano: PlanoMensal) => {
    setEstado((prev) => {
      const existe = prev.planosMensais.some((p) => p.mes === plano.mes && p.ano === plano.ano);
      const lista = existe
        ? prev.planosMensais.map((p) => (p.mes === plano.mes && p.ano === plano.ano ? plano : p))
        : [...prev.planosMensais, plano];
      return { ...prev, planosMensais: lista.sort((a, b) => a.ano - b.ano || a.mes - b.mes) };
    });
  }, []);

  const removerPlanoMensal = useCallback((mes: number, ano: number) => {
    setEstado((prev) => ({
      ...prev,
      planosMensais: prev.planosMensais.filter((p) => !(p.mes === mes && p.ano === ano)),
    }));
  }, []);

  const adicionarMaterial = useCallback((nome: string, status: ItemMaterial["status"] = "preciso") => {
    setEstado((prev) => ({
      ...prev,
      materiais: [{ id: `mt${Date.now()}`, nome, status }, ...prev.materiais],
    }));
  }, []);

  const atualizarMaterial = useCallback((id: string, patch: Partial<ItemMaterial>) => {
    setEstado((prev) => ({
      ...prev,
      materiais: prev.materiais.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }, []);

  const removerMaterial = useCallback((id: string) => {
    setEstado((prev) => ({ ...prev, materiais: prev.materiais.filter((m) => m.id !== id) }));
  }, []);

  const atualizarModelo = useCallback((patch: Partial<ModeloEscola>) => {
    setEstado((prev) => ({ ...prev, modeloEscola: { ...prev.modeloEscola, ...patch } }));
  }, []);

  const criarConversa = useCallback((titulo = "Nova conversa") => {
    const nova: Conversa = {
      id: `c${Date.now()}`,
      titulo,
      criadaEm: new Date().toISOString(),
      mensagens: [],
    };
    setEstado((prev) => ({ ...prev, conversas: [nova, ...prev.conversas] }));
    return nova;
  }, []);

  const adicionarMensagem = useCallback((conversaId: string, m: Omit<Mensagem, "id" | "em">) => {
    setEstado((prev) => ({
      ...prev,
      conversas: prev.conversas.map((c) =>
        c.id === conversaId
          ? {
              ...c,
              titulo:
                c.mensagens.length === 0 && m.autor === "professora"
                  ? m.texto.slice(0, 40)
                  : c.titulo,
              mensagens: [
                ...c.mensagens,
                { ...m, id: `ms${Date.now()}${Math.random().toString(16).slice(2, 6)}`, em: new Date().toISOString() },
              ],
            }
          : c,
      ),
    }));
  }, []);

  const renomearConversa = useCallback((id: string, titulo: string) => {
    setEstado((prev) => ({
      ...prev,
      conversas: prev.conversas.map((c) => (c.id === id ? { ...c, titulo } : c)),
    }));
  }, []);

  const removerConversa = useCallback((id: string) => {
    setEstado((prev) => ({ ...prev, conversas: prev.conversas.filter((c) => c.id !== id) }));
  }, []);

  const value = useMemo<PlannerState>(() => {
    const { atividades, slots, registros, materiais, planosMensais } = estado;
    const atividadePorId = (id?: string) => (id ? atividades.find((a) => a.id === id) : undefined);
    const slotsDaSemana = (inicio: string) =>
      slots.filter((s) => s.data >= inicio && s.data <= addISO(inicio, 4));

    return {
      ...estado,
      hoje: HOJE_ISO,
      carregado,
      salvarAtividade,
      atualizarAtividade,
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
      atualizarPlanoAnual,
      atualizarBimestre,
      salvarPlanoMensal,
      removerPlanoMensal,
      adicionarMaterial,
      atualizarMaterial,
      removerMaterial,
      atualizarModelo,
      criarConversa,
      adicionarMensagem,
      renomearConversa,
      removerConversa,
      atividadePorId,
      registrosDaAtividade: (id: string) => registros.filter((r) => r.atividadeId === id),
      slotsDoDia: (data: string) => slots.filter((s) => s.data === data),
      slotsDaSemana,
      usosDaAtividade: (id: string) => slots.filter((s) => s.atividadeId === id).length,
      planoDoMes: (mes: number, ano: number) =>
        planosMensais.find((p) => p.mes === mes && p.ano === ano),
      materiaisDaSemana: (inicio: string) => {
        const mapa = new Map<string, string[]>();
        slotsDaSemana(inicio).forEach((s) => {
          const a = atividadePorId(s.atividadeId);
          if (!a) return;
          a.materiais.forEach((m) => {
            const atual = mapa.get(m) ?? [];
            if (!atual.includes(a.titulo)) atual.push(a.titulo);
            mapa.set(m, atual);
          });
        });
        return Array.from(mapa.entries())
          .map(([nome, ativs]) => ({
            nome,
            atividades: ativs,
            tenho: materiais.some(
              (m) => m.status !== "preciso" && m.nome.toLowerCase().includes(nome.toLowerCase().split(" ")[0] ?? ""),
            ),
          }))
          .sort((a, b) => a.nome.localeCompare(b.nome));
      },
      pendenciaAguaResolvida: slots.some(
        (s) => s.data === "2026-03-20" && s.momento === "Atividade principal",
      ),
    };
  }, [
    estado,
    carregado,
    salvarAtividade,
    atualizarAtividade,
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
    atualizarPlanoAnual,
    atualizarBimestre,
    salvarPlanoMensal,
    removerPlanoMensal,
    adicionarMaterial,
    atualizarMaterial,
    removerMaterial,
    atualizarModelo,
    criarConversa,
    adicionarMensagem,
    renomearConversa,
    removerConversa,
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
