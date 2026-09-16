import { forwardRef } from "react";
import { Ilustracao, type IlustracaoId } from "@/components/Ilustracoes";
import type { Atividade, Folha, ModeloEscola, TipoFolha } from "@/data/mock";

const corHex: Record<ModeloEscola["cor"], string> = {
  agua: "#2c8ca3",
  sol: "#d79a24",
  folha: "#4f9a58",
  coral: "#d9694f",
};

export function folhaPadrao(atividade: Atividade): Folha {
  if (atividade.folha) return atividade.folha;
  const tema = atividade.tema.toLowerCase();
  const ilustracao: IlustracaoId = tema.includes("água")
    ? "gotinha"
    : tema.includes("natureza") || tema.includes("planta")
      ? "planta"
      : tema.includes("corpo") || tema.includes("movimento")
        ? "sol"
        : tema.includes("bicho") || tema.includes("animal")
          ? "borboleta"
          : "casa";
  return {
    tipo: "colorir",
    ilustracao,
    enunciado: `Pinte o desenho e conte para a professora o que você descobriu sobre ${atividade.tema.toLowerCase()}.`,
    recado: atividade.objetivo,
  };
}

function Linhas({ n = 3 }: { n?: number }) {
  return (
    <div className="mt-6 space-y-7">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="h-0 border-b-2 border-dashed border-neutral-300" />
      ))}
    </div>
  );
}

function Miolo({ folha, cor }: { folha: Folha; cor: string }) {
  const ilus = folha.ilustracao as IlustracaoId;

  if (folha.tipo === "colorir") {
    return (
      <div className="flex h-full items-center justify-center py-2">
        <div className="h-[80%] w-[80%] text-neutral-800">
          <Ilustracao id={ilus} className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (folha.tipo === "ligar") {
    return (
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-4 py-2">
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center justify-end gap-3">
              <div className="h-20 w-20 text-neutral-800">
                <Ilustracao id={ilus} className="h-full w-full" />
              </div>
              <span className="h-3 w-3 rounded-full bg-neutral-800" />
            </div>
          ))}
        </div>
        <div className="h-full w-px bg-neutral-200" />
        <div className="space-y-6">
          {["1", "2", "3"].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-neutral-800" />
              <span className="grid h-20 w-20 place-items-center rounded-2xl border-2 border-neutral-800 text-4xl font-bold">
                {n}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (folha.tipo === "contar") {
    return (
      <div className="flex h-full flex-col justify-center gap-6 py-2">
        {[2, 3, 4].map((qtd) => (
          <div key={qtd} className="flex items-center gap-4 border-b-2 border-dashed border-neutral-200 pb-4">
            <div className="flex flex-1 gap-2">
              {Array.from({ length: qtd }).map((_, i) => (
                <div key={i} className="h-16 w-16 text-neutral-800">
                  <Ilustracao id={ilus} className="h-full w-full" />
                </div>
              ))}
            </div>
            <span className="h-16 w-16 shrink-0 rounded-xl border-2 border-neutral-800" />
          </div>
        ))}
      </div>
    );
  }

  if (folha.tipo === "recortar") {
    return (
      <div className="grid h-full grid-cols-2 gap-4 py-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid place-items-center rounded-lg border-2 border-dashed p-2"
            style={{ borderColor: cor }}
          >
            <div className="h-full w-full max-h-[150px] text-neutral-800">
              <Ilustracao id={ilus} className="h-full w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (folha.tipo === "tracado") {
    return (
      <div className="flex h-full flex-col justify-center gap-8 py-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="h-4 w-4 rounded-full" style={{ background: cor }} />
            <span className="h-0 flex-1 border-b-4 border-dotted border-neutral-400" />
            <div className="h-20 w-20 text-neutral-800">
              <Ilustracao id={ilus} className="h-full w-full" />
            </div>
          </div>
        ))}
        <Linhas n={2} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col py-2">
      <div className="flex-1 rounded-2xl border-2 border-neutral-300" />
      <Linhas n={2} />
    </div>
  );
}

export const FolhaAtividade = forwardRef<
  HTMLDivElement,
  { atividade: Atividade; folha?: Folha; modelo: ModeloEscola }
>(function FolhaAtividade({ atividade, folha, modelo }, ref) {
  const f = folha ?? folhaPadrao(atividade);
  const cor = corHex[modelo.cor];

  return (
    <div
      ref={ref}
      className="relative mx-auto flex aspect-[210/297] w-full max-w-[760px] flex-col overflow-hidden bg-white p-8 text-neutral-900"
      style={{ border: `6px solid ${cor}`, borderRadius: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* marca d'água */}
      {modelo.marcaDagua ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span
            className="whitespace-nowrap text-5xl font-bold uppercase tracking-[0.3em] opacity-[0.07]"
            style={{ transform: "rotate(-28deg)", color: cor }}
          >
            {modelo.marcaDagua}
          </span>
        </div>
      ) : null}

      <header className="relative flex items-center gap-3 border-b-2 pb-3" style={{ borderColor: cor }}>
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-bold text-white"
          style={{ background: cor }}
        >
          {modelo.logoTexto}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold uppercase tracking-wide" style={{ color: cor }}>
            {modelo.escola}
          </p>
          <p className="truncate text-xs text-neutral-500">{atividade.tema} · {atividade.faixa}</p>
        </div>
      </header>

      <div className="relative mt-3 grid grid-cols-3 gap-3 text-[11px] text-neutral-600">
        {modelo.mostrarNome ? (
          <span className="col-span-2 border-b border-neutral-400 pb-1">Nome:</span>
        ) : null}
        {modelo.mostrarData ? <span className="border-b border-neutral-400 pb-1">Data: ___/___/____</span> : null}
        {modelo.mostrarTurma ? (
          <span className="col-span-3 border-b border-neutral-400 pb-1">Turma:</span>
        ) : null}
      </div>

      <h2 className="relative mt-5 font-semibold leading-tight" style={{ fontSize: 22 }}>
        {atividade.titulo}
      </h2>
      <p className="relative mt-1 text-[15px] leading-snug text-neutral-700">{f.enunciado}</p>

      <div className="relative min-h-0 flex-1">
        <Miolo folha={f} cor={cor} />
      </div>

      <footer className="relative mt-2 flex items-end justify-between gap-4 border-t pt-2 text-[10px] text-neutral-500" style={{ borderColor: cor }}>
        <span className="max-w-[70%] truncate">{modelo.rodape}</span>
        {f.recado ? <span className="max-w-[45%] truncate italic">{f.recado}</span> : null}
      </footer>
    </div>
  );
});

export const rotulosFolha: Record<TipoFolha, string> = {
  colorir: "Colorir",
  ligar: "Ligar os pontos",
  contar: "Contar e marcar",
  recortar: "Recortar e colar",
  tracado: "Traçado",
  desenho: "Desenho livre",
};
