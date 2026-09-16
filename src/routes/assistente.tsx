import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarPlus,
  Clock,
  Download,
  MessageSquarePlus,
  PanelLeft,
  Trash2,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AgendarDialog } from "@/components/AgendarDialog";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { responder, sugestoesIniciais, type Contexto } from "@/lib/assistente";
import { usePlanner } from "@/lib/planner-store";
import {
  HOJE_ISO,
  diasUteis,
  formatarCurto,
  inicioDaSemana,
  nomeDia,
  professora,
  criancas,
  type Atividade,
} from "@/data/mock";

export const Route = createFileRoute("/assistente")({
  validateSearch: (search: Record<string, unknown>) => ({
    tema: typeof search["tema"] === "string" ? (search["tema"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Assistente de planejamento · Planeja" },
      {
        name: "description",
        content:
          "Converse em linguagem simples para planejar, adaptar uma atividade à sua turma e salvar direto no planejamento da semana.",
      },
      { property: "og:title", content: "Assistente · Planeja" },
      {
        property: "og:description",
        content: "Peça ajuda, adapte a atividade e salve no planejamento em poucos toques.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Assistente,
});

function Assistente() {
  const { tema } = Route.useSearch();
  const {
    conversas,
    criarConversa,
    adicionarMensagem,
    removerConversa,
    renomearConversa,
    carregado,
    materiais,
    planoDoMes,
    slotsDaSemana,
    salvarAtividade,
  } = usePlanner();

  const [conversaId, setConversaId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState("");
  const [pensando, setPensando] = useState(false);
  const [agendando, setAgendando] = useState<Atividade | null>(null);
  const [listaAberta, setListaAberta] = useState(false);
  const iniciou = useRef(false);

  const conversa = conversas.find((c) => c.id === conversaId) ?? conversas[0];

  const contexto: Contexto = useMemo(() => {
    const inicio = inicioDaSemana(HOJE_ISO);
    const daSemana = slotsDaSemana(inicio);
    const plano = planoDoMes(3, 2026);
    return {
      professora: professora.nome,
      turma: professora.turma,
      criancas: criancas.length,
      idade: "4 anos",
      ...(plano?.tema ? { temaMes: plano.tema } : {}),
      focosMes: plano?.focos ?? [],
      diasSemAtividade: diasUteis(inicio)
        .filter((d) => !daSemana.some((s) => s.data === d && s.momento === "Atividade principal"))
        .map((d) => ({ data: d, rotulo: `${nomeDia(d)}, ${formatarCurto(d)}` })),
      materiaisFaltando: materiais.filter((m) => m.status === "preciso").map((m) => m.nome),
      proximosEventos: [],
      particularidades: professora.particularidades,
    };
  }, [materiais, planoDoMes, slotsDaSemana]);

  // primeira conversa (idempotente)
  useEffect(() => {
    if (!carregado || iniciou.current) return;
    iniciou.current = true;
    if (conversas.length === 0) {
      const nova = criarConversa("Primeira conversa");
      setConversaId(nova.id);
      adicionarMensagem(nova.id, {
        autor: "assistente",
        texto: `Oi, ${professora.nome}! 👋\n\nSou seu assistente de planejamento. Pode escrever do jeito que você falaria com uma colega.\n\nPosso sugerir atividades, adaptar o que você já tem, montar o plano do mês e preparar folhas para imprimir.`,
      });
    } else {
      setConversaId(conversas[0]?.id ?? null);
    }
  }, [carregado, conversas, criarConversa, adicionarMensagem]);

  // atalho vindo da tela Hoje ("tema=agua")
  const usouTema = useRef(false);
  useEffect(() => {
    if (tema !== "agua" || !conversa || usouTema.current) return;
    usouTema.current = true;
    enviar("Ainda não preparei nada para o Dia da Água. Me ajuda?");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tema, conversa]);

  function enviar(texto: string) {
    const alvo = conversa ?? criarConversa();
    if (!conversa) setConversaId(alvo.id);
    adicionarMensagem(alvo.id, { autor: "professora", texto });
    if (alvo.mensagens.filter((m) => m.autor === "professora").length === 0) {
      renomearConversa(alvo.id, texto.length > 38 ? `${texto.slice(0, 38)}…` : texto);
    }
    setPensando(true);
    const resposta = responder(texto, contexto);
    window.setTimeout(() => {
      adicionarMensagem(alvo.id, {
        autor: "assistente",
        texto: resposta.texto,
        ...(resposta.sugestao ? { sugestao: resposta.sugestao } : {}),
      });
      setPensando(false);
    }, 850);
  }

  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [conversa?.id, pensando]);

  function submeter(_m: unknown, e: React.FormEvent) {
    e.preventDefault();
    const texto = rascunho.trim();
    if (!texto || pensando) return;
    setRascunho("");
    enviar(texto);
  }

  const vazia = (conversa?.mensagens.length ?? 0) <= 1;

  return (
    <AppShell titulo="Assistente" subtitulo="Escreva do seu jeito, eu ajudo a organizar">
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-4">
        {/* lista de conversas */}
        <aside
          className={`${
            listaAberta ? "block" : "hidden"
          } fixed inset-0 z-40 bg-background/95 p-4 lg:static lg:z-auto lg:block lg:w-64 lg:shrink-0 lg:bg-transparent lg:p-0`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <p className="font-display text-lg font-semibold">Suas conversas</p>
            <button onClick={() => setListaAberta(false)} className="text-sm font-semibold text-primary">
              Fechar
            </button>
          </div>
          <button
            onClick={() => {
              const nova = criarConversa();
              setConversaId(nova.id);
              setListaAberta(false);
            }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground lg:mt-0"
          >
            <MessageSquarePlus className="h-4 w-4" /> Nova conversa
          </button>
          <ul className="mt-3 space-y-1">
            {conversas.map((c) => (
              <li
                key={c.id}
                className={`flex items-center gap-1 rounded-xl px-2 ${
                  c.id === conversa?.id ? "bg-secondary" : ""
                }`}
              >
                <button
                  onClick={() => {
                    setConversaId(c.id);
                    setListaAberta(false);
                  }}
                  className="min-w-0 flex-1 truncate py-2.5 text-left text-sm"
                >
                  {c.titulo}
                </button>
                <button
                  onClick={() => {
                    removerConversa(c.id);
                    if (c.id === conversa?.id) setConversaId(null);
                  }}
                  aria-label="Apagar conversa"
                  className="p-1.5 text-muted-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* chat */}
        <section className="flex min-w-0 flex-1 flex-col rounded-3xl border border-border bg-card">
          <header className="flex items-center gap-2 border-b border-border px-4 py-3">
            <button
              onClick={() => setListaAberta(true)}
              className="rounded-lg p-1.5 lg:hidden"
              aria-label="Ver conversas"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate font-display font-semibold">{conversa?.titulo ?? "Conversa"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {professora.turma} · {criancas.length} crianças de 4 anos
              </p>
            </div>
          </header>

          <Conversation className="min-h-[46vh] flex-1">
            <ConversationContent className="gap-5 px-4 py-4">
              {conversa?.mensagens.map((m) => (
                <Message key={m.id} from={m.autor === "professora" ? "user" : "assistant"}>
                  <MessageContent>
                    <MessageResponse>{m.texto}</MessageResponse>
                    {m.sugestao ? (
                      <CartaoAtividade
                        atividade={m.sugestao}
                        onAgendar={() => {
                          salvarAtividade(m.sugestao as Atividade);
                          setAgendando(m.sugestao as Atividade);
                        }}
                        onSalvar={() => salvarAtividade(m.sugestao as Atividade)}
                      />
                    ) : null}
                  </MessageContent>
                </Message>
              ))}
              {pensando ? (
                <Message from="assistant">
                  <MessageContent>
                    <Shimmer>Pensando...</Shimmer>
                  </MessageContent>
                </Message>
              ) : null}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {vazia && !pensando ? (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {sugestoesIniciais.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <div className="border-t border-border p-3">
            <PromptInput onSubmit={submeter}>
              <PromptInputTextarea
                ref={inputRef}
                value={rascunho}
                onChange={(e) => setRascunho(e.target.value)}
                placeholder="Escreva aqui o que você precisa…"
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit
                  status={pensando ? "submitted" : "ready"}
                  disabled={!rascunho.trim() || pensando}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </section>
      </div>

      {agendando ? (
        <AgendarDialog
          atividade={agendando}
          aberto
          onFechar={() => setAgendando(null)}
          dataSugerida={contexto.diasSemAtividade[0]?.data ?? HOJE_ISO}
        />
      ) : null}
    </AppShell>
  );
}

function CartaoAtividade({
  atividade,
  onAgendar,
  onSalvar,
}: {
  atividade: Atividade;
  onAgendar: () => void;
  onSalvar: () => void;
}) {
  const [salvo, setSalvo] = useState(false);
  return (
    <div className="mt-2 w-full rounded-2xl border border-border bg-background p-4">
      <p className="font-display text-base font-semibold">{atividade.titulo}</p>
      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {atividade.duracao} min
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {atividade.organizacao}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{atividade.objetivo}</p>
      <ol className="mt-3 space-y-1 text-sm">
        {atividade.passos.slice(0, 4).map((p, i) => (
          <li key={i} className="flex gap-2">
            <span className="font-semibold text-primary">{i + 1}.</span> {p}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onAgendar}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <CalendarPlus className="h-3.5 w-3.5" /> Salvar na semana
        </button>
        <button
          onClick={() => {
            onSalvar();
            setSalvo(true);
          }}
          className="rounded-xl border border-border px-3 py-2 text-xs font-semibold"
        >
          {salvo ? "Guardada ✓" : "Guardar nas atividades"}
        </button>
        <Link
          to="/folha/$id"
          params={{ id: atividade.id }}
          onClick={onSalvar}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold"
        >
          <Download className="h-3.5 w-3.5" /> Folha para imprimir
        </Link>
      </div>
    </div>
  );
}
