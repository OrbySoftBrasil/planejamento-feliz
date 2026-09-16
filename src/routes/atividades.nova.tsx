import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Download, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AgendarDialog } from "@/components/AgendarDialog";
import { FolhaAtividade, rotulosFolha } from "@/components/FolhaAtividade";
import { ilustracoes, type IlustracaoId } from "@/components/Ilustracoes";
import {
  HOJE_ISO,
  camposExperiencia,
  campoCurto,
  momentos,
  temas,
  type Atividade,
  type CampoExperiencia,
  tiposFolha,
  type Folha,
  type Momento,
  type TipoFolha,
} from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/atividades/nova")({
  head: () => ({
    meta: [
      { title: "Criar atividade · Planeja" },
      {
        name: "description",
        content: "Monte uma atividade em três passos simples: o que quer trabalhar, o tempo que tem e o material disponível.",
      },
      { property: "og:title", content: "Criar atividade · Planeja" },
      { property: "og:description", content: "Três passos para uma atividade pronta para a turma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Nova,
});

const materiaisComuns = [
  "Papel sulfite",
  "Giz de cera",
  "Tinta guache",
  "Bacia com água",
  "Potes plásticos",
  "Tecidos",
  "Sucata",
  "Livros de imagem",
  "Música",
  "Barbante",
];

function Nova() {
  const navigate = useNavigate();
  const { atividades, salvarAtividade, modeloEscola } = usePlanner();
  const [passo, setPasso] = useState(1);
  const [tema, setTema] = useState(temas[0] ?? "Água");
  const [campo, setCampo] = useState<CampoExperiencia>(camposExperiencia[0]!);
  const [duracao, setDuracao] = useState(30);
  const [momento, setMomento] = useState<Momento>("Atividade principal");
  const [organizacao, setOrganizacao] = useState<Atividade["organizacao"]>("Pequenos grupos");
  const [espaco, setEspaco] = useState<Atividade["espaco"]>("Sala");
  const [materiais, setMateriais] = useState<string[]>(["Papel sulfite"]);
  const [titulo, setTitulo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [passos, setPassos] = useState<string[]>([]);
  const [tipoFolha, setTipoFolha] = useState<TipoFolha>("colorir");
  const [ilustracao, setIlustracao] = useState<IlustracaoId>("gotinha");
  const [enunciado, setEnunciado] = useState("Pinte o desenho com as cores que você quiser.");
  const [recado, setRecado] = useState("Converse em casa sobre o que você aprendeu hoje.");
  const [salva, setSalva] = useState<Atividade | null>(null);
  const [agendando, setAgendando] = useState(false);

  const parecidas = useMemo(
    () => atividades.filter((a) => a.tema === tema || a.campo === campo).slice(0, 3),
    [atividades, tema, campo],
  );

  function gerarRascunho() {
    setTitulo(titulo || `Explorando ${tema.toLowerCase()} com as mãos`);
    setObjetivo(
      objetivo ||
        `Vivenciar ${tema.toLowerCase()} por meio da exploração sensorial, ampliando o vocabulário e a curiosidade das crianças de 4 anos.`,
    );
    setPassos(
      passos.length
        ? passos
        : [
            `Roda inicial: mostrar os materiais (${materiais.slice(0, 2).join(", ") || "os materiais"}) e perguntar o que as crianças já sabem sobre ${tema.toLowerCase()}.`,
            `Exploração em ${organizacao.toLowerCase()} no espaço "${espaco.toLowerCase()}", com tempo livre para manipular e observar.`,
            "Registro coletivo: cada criança conta uma descoberta enquanto você escreve num cartaz.",
            "Fechamento: guardar os materiais juntos e combinar o que continuar amanhã.",
          ],
    );
    setPasso(3);
  }

  function salvar() {
    const nova: Atividade = {
      id: `a-${Date.now()}`,
      titulo,
      tema,
      campo,
      faixa: "4 anos",
      duracao,
      espaco,
      organizacao,
      materiais,
      objetivo,
      objetivosBncc: [
        {
          codigo: "EI03ET01",
          texto: "Estabelecer relações de comparação entre objetos, observando suas propriedades.",
        },
      ],
      passos,
      adaptacoes: [
        "Para quem não quiser participar, ofereça o papel de observador e registrador.",
        `Se tiver menos tempo, faça só os dois primeiros passos (cerca de ${Math.max(15, duracao - 15)} min).`,
      ],
      tags: [tema.toLowerCase(), momento.toLowerCase()],
      origem: "minha",
      criadaEm: HOJE_ISO,
      favorita: false,
      folha: { tipo: tipoFolha, ilustracao, enunciado, recado },
    };
    salvarAtividade(nova);
    setSalva(nova);
    toast.success("Atividade guardada na sua biblioteca");
  }

  return (
    <AppShell titulo="Criar atividade" subtitulo="Três passos curtos. Você pode mudar tudo depois.">
      <div className="space-y-5">
        <Link to="/atividades" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full ${passo >= n ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {passo === 1 ? (
          <section className="space-y-5 rounded-3xl border border-border bg-card p-5">
            <div>
              <h2 className="font-display text-lg font-semibold">1. O que você quer trabalhar?</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {temas.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTema(t)}
                    className={`rounded-full border px-3.5 py-2 text-sm ${
                      tema === t ? "border-primary bg-accent font-medium text-primary" : "border-border"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Campo de experiência</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {camposExperiencia.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCampo(c)}
                    className={`rounded-full border px-3.5 py-2 text-sm ${
                      campo === c ? "border-primary bg-accent font-medium text-primary" : "border-border"
                    }`}
                  >
                    {campoCurto[c]}
                  </button>
                ))}
              </div>
            </div>
            {parecidas.length ? (
              <div className="rounded-2xl bg-agua-suave/60 p-4">
                <p className="text-sm font-medium">Você já tem algo parecido</p>
                <ul className="mt-2 space-y-1.5">
                  {parecidas.map((a) => (
                    <li key={a.id}>
                      <Link
                        to="/atividades/$id"
                        params={{ id: a.id }}
                        className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                      >
                        {a.titulo} · {a.duracao} min
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <button
              onClick={() => setPasso(2)}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Continuar
            </button>
          </section>
        ) : null}

        {passo === 2 ? (
          <section className="space-y-5 rounded-3xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">2. Como vai acontecer?</h2>
            <label className="block text-sm font-medium">
              Tempo disponível <span className="text-muted-foreground">{duracao} min</span>
              <input
                type="range"
                min={15}
                max={60}
                step={5}
                value={duracao}
                onChange={(e) => setDuracao(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--primary)]"
              />
            </label>
            <div>
              <p className="text-sm font-medium">Momento da rotina</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {momentos.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMomento(m)}
                    className={`rounded-full border px-3.5 py-2 text-sm ${
                      momento === m ? "border-primary bg-accent font-medium text-primary" : "border-border"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Organização</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["Turma toda", "Pequenos grupos", "Duplas", "Individual"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOrganizacao(o)}
                      className={`rounded-full border px-3 py-1.5 text-sm ${
                        organizacao === o ? "border-primary bg-accent text-primary" : "border-border"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Espaço</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["Sala", "Pátio", "Parque", "Refeitório", "Corredor"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setEspaco(o)}
                      className={`rounded-full border px-3 py-1.5 text-sm ${
                        espaco === o ? "border-primary bg-accent text-primary" : "border-border"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Materiais que você tem</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {materiaisComuns.map((m) => {
                  const ativo = materiais.includes(m);
                  return (
                    <button
                      key={m}
                      onClick={() =>
                        setMateriais((prev) => (ativo ? prev.filter((x) => x !== m) : [...prev, m]))
                      }
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
                        ativo ? "border-primary bg-accent text-primary" : "border-border"
                      }`}
                    >
                      {ativo ? <Check className="h-3.5 w-3.5" /> : null}
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPasso(1)} className="rounded-xl px-4 py-3 text-sm text-muted-foreground">
                Voltar
              </button>
              <button
                onClick={gerarRascunho}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                <Wand2 className="h-4 w-4" /> Montar rascunho
              </button>
            </div>
          </section>
        ) : null}

        {passo === 3 ? (
          <section className="space-y-4 rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">3. Revise e ajuste</h2>
            </div>
            <label className="block text-sm font-medium">
              Título
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block text-sm font-medium">
              Objetivo
              <textarea
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
            </label>
            <FolhaEditor
              atividade={{
                id: "previa",
                titulo: titulo || "Sua atividade",
                tema,
                campo,
                faixa: "4 anos",
                duracao,
                espaco,
                organizacao,
                materiais,
                objetivo,
                objetivosBncc: [],
                passos,
                adaptacoes: [],
                tags: [],
                origem: "minha",
                criadaEm: HOJE_ISO,
                favorita: false,
              }}
              folha={{ tipo: tipoFolha, ilustracao, enunciado, recado }}
              modelo={modeloEscola}
              onTipo={setTipoFolha}
              onIlustracao={setIlustracao}
              onEnunciado={setEnunciado}
              onRecado={setRecado}
            />

            <div>
              <p className="text-sm font-medium">Passo a passo</p>
              <div className="mt-2 space-y-2">
                {passos.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="mt-2.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <textarea
                      value={p}
                      rows={2}
                      onChange={(e) =>
                        setPassos((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))
                      }
                      className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => setPassos((prev) => prev.filter((_, j) => j !== i))}
                      className="shrink-0 self-start px-2 py-2 text-sm text-muted-foreground"
                      aria-label="Remover passo"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setPassos((prev) => [...prev, ""])}
                  className="text-sm font-medium text-primary"
                >
                  + Adicionar passo
                </button>
              </div>
            </div>

            {salva ? (
              <div className="space-y-2 rounded-2xl bg-folha-suave p-4">
                <p className="text-sm font-medium">Atividade guardada na biblioteca.</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setAgendando(true)}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    Colocar no planejamento
                  </button>
                  <button
                    onClick={() => navigate({ to: "/folha/$id", params: { id: salva.id } })}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold"
                  >
                    <Download className="h-4 w-4" /> Baixar a folha
                  </button>
                  <button
                    onClick={() => navigate({ to: "/atividades/$id", params: { id: salva.id } })}
                    className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold"
                  >
                    Ver atividade
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setPasso(2)} className="rounded-xl px-4 py-3 text-sm text-muted-foreground">
                  Voltar
                </button>
                <button
                  onClick={salvar}
                  disabled={!titulo.trim()}
                  className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  Guardar atividade
                </button>
              </div>
            )}
          </section>
        ) : null}
      </div>

      {salva ? (
        <AgendarDialog
          atividade={salva}
          aberto={agendando}
          onFechar={() => setAgendando(false)}
          momentoSugerido={momento}
        />
      ) : null}
    </AppShell>
  );
}

function FolhaEditor({
  atividade,
  folha,
  modelo,
  onTipo,
  onIlustracao,
  onEnunciado,
  onRecado,
}: {
  atividade: Atividade;
  folha: Folha;
  modelo: Parameters<typeof FolhaAtividade>[0]["modelo"];
  onTipo: (t: TipoFolha) => void;
  onIlustracao: (i: IlustracaoId) => void;
  onEnunciado: (v: string) => void;
  onRecado: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="font-display text-base font-semibold">Folha da atividade</p>
      <p className="text-xs text-muted-foreground">
        É a folha ilustrada que as crianças recebem. Você pode baixar em PDF depois.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {tiposFolha.map((t) => (
          <button
            key={t}
            onClick={() => onTipo(t)}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              folha.tipo === t ? "border-primary bg-accent text-primary" : "border-border"
            }`}
          >
            {rotulosFolha[t]}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {ilustracoes.map((i) => (
          <button
            key={i.id}
            onClick={() => onIlustracao(i.id)}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              folha.ilustracao === i.id ? "border-primary bg-accent text-primary" : "border-border"
            }`}
          >
            {i.nome}
          </button>
        ))}
      </div>

      <input
        value={folha.enunciado}
        onChange={(e) => onEnunciado(e.target.value)}
        placeholder="O que a criança deve fazer"
        className="mt-3 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
      />
      <input
        value={folha.recado}
        onChange={(e) => onRecado(e.target.value)}
        placeholder="Recado para a família"
        className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <FolhaAtividade atividade={atividade} folha={folha} modelo={modelo} />
      </div>
    </div>
  );
}
