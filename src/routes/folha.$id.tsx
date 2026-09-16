import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Download, FileImage, Printer, Save } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { FolhaAtividade, folhaPadrao, rotulosFolha } from "@/components/FolhaAtividade";
import { ilustracoes } from "@/components/Ilustracoes";
import { tiposFolha, type Folha, type TipoFolha } from "@/data/mock";
import { usePlanner } from "@/lib/planner-store";
import { baixarImagem, baixarPdf } from "@/lib/download";

export const Route = createFileRoute("/folha/$id")({
  head: () => ({
    meta: [
      { title: "Folha ilustrada da atividade · Planeja" },
      {
        name: "description",
        content:
          "Monte a folha ilustrada da atividade com o modelo da sua escola e baixe em PDF ou imagem.",
      },
      { property: "og:title", content: "Folha da atividade · Planeja" },
      { property: "og:description", content: "Folha ilustrada com marca d'água e campos da escola." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FolhaPage,
});

function FolhaPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { atividadePorId, modeloEscola, atualizarAtividade } = usePlanner();
  const atividade = atividadePorId(id);
  const folhaRef = useRef<HTMLDivElement>(null);
  const [folha, setFolha] = useState<Folha>(() =>
    atividade ? folhaPadrao(atividade) : { tipo: "colorir", ilustracao: "gotinha", enunciado: "" },
  );
  const [baixando, setBaixando] = useState(false);

  if (!atividade) {
    return (
      <AppShell titulo="Atividade não encontrada">
        <Link to="/atividades" className="font-semibold text-primary">
          Voltar para as atividades
        </Link>
      </AppShell>
    );
  }

  async function baixar(tipo: "pdf" | "png") {
    if (!folhaRef.current || !atividade) return;
    setBaixando(true);
    try {
      if (tipo === "pdf") await baixarPdf(folhaRef.current, atividade.titulo);
      else await baixarImagem(folhaRef.current, atividade.titulo);
      toast.success(tipo === "pdf" ? "PDF baixado." : "Imagem baixada.");
    } catch {
      toast.error("Não consegui gerar o arquivo. Tente de novo.");
    } finally {
      setBaixando(false);
    }
  }

  return (
    <AppShell titulo="Folha da atividade" subtitulo={atividade.titulo}>
      <button
        onClick={() => navigate({ to: "/atividades/$id", params: { id: atividade.id } })}
        className="no-print mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para a atividade
      </button>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <section className="no-print space-y-5 rounded-2xl border border-border bg-card p-5">
          <div>
            <h2 className="font-display text-lg font-semibold">Tipo de folha</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {tiposFolha.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFolha((f) => ({ ...f, tipo: t.id as TipoFolha }))}
                  className={`rounded-xl border p-2.5 text-left text-xs font-semibold transition-colors ${
                    folha.tipo === t.id ? "border-primary bg-accent" : "border-border hover:bg-accent/60"
                  }`}
                >
                  {t.nome}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold">Ilustração</h2>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {ilustracoes.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setFolha((f) => ({ ...f, ilustracao: i.id }))}
                  title={i.nome}
                  className={`aspect-square rounded-xl border p-1.5 ${
                    folha.ilustracao === i.id ? "border-primary bg-accent" : "border-border"
                  }`}
                >
                  {i.desenho({ className: "h-full w-full" })}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Enunciado para a criança</label>
            <textarea
              value={folha.enunciado}
              onChange={(e) => setFolha((f) => ({ ...f, enunciado: e.target.value }))}
              rows={3}
              className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Recado no rodapé (opcional)</label>
            <input
              value={folha.recado ?? ""}
              onChange={(e) => setFolha((f) => ({ ...f, recado: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={() => baixar("pdf")}
              disabled={baixando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> Baixar PDF
            </button>
            <button
              onClick={() => baixar("png")}
              disabled={baixando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              <FileImage className="h-4 w-4" /> Baixar imagem
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold"
            >
              <Printer className="h-4 w-4" /> Imprimir
            </button>
            <button
              onClick={() => {
                atualizarAtividade(atividade.id, { folha });
                toast.success("Folha salva na atividade.");
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold"
            >
              <Save className="h-4 w-4" /> Salvar esta folha
            </button>
            <Link
              to="/perfil"
              className="block pt-1 text-center text-xs text-muted-foreground underline"
            >
              Mudar o modelo da escola (marca d'água, logo, campos)
            </Link>
          </div>
        </section>

        <section className="print-area">
          <p className="no-print mb-2 text-xs text-muted-foreground">
            Pré-visualização · {rotulosFolha[folha.tipo]} · modelo {modeloEscola.escola}
          </p>
          <FolhaAtividade ref={folhaRef} atividade={atividade} folha={folha} modelo={modeloEscola} />
        </section>
      </div>
    </AppShell>
  );
}
