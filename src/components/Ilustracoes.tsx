import type { ReactElement, ReactNode } from "react";

/* Ilustrações em traço (vetor) usadas nas folhas de atividade.
   Traço preto, sem preenchimento: dá para imprimir, colorir e baixar. */

export type IlustracaoId =
  | "gotinha"
  | "nuvem"
  | "torneira"
  | "peixe"
  | "planta"
  | "sol"
  | "borboleta"
  | "casa"
  | "regador"
  | "copo";

type Props = { className: string };

const svg = {
  width: "100%",
  height: "100%",
} as const;

function Base({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      {...svg}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const ilustracoes: { id: IlustracaoId; nome: string; desenho: (p: Props) => ReactElement }[] = [
  {
    id: "gotinha",
    nome: "Gotinha",
    desenho: ({ className }) => (
      <Base className={className}>
        <path d="M100 25c26 34 42 56 42 76a42 42 0 0 1-84 0c0-20 16-42 42-76Z" />
        <circle cx="86" cy="98" r="5" />
        <circle cx="116" cy="98" r="5" />
        <path d="M84 120c9 10 23 10 32 0" />
        <path d="M66 110c-6 4-9 10-9 16" />
      </Base>
    ),
  },
  {
    id: "nuvem",
    nome: "Nuvem de chuva",
    desenho: ({ className }) => (
      <Base className={className}>
        <path d="M58 104a26 26 0 0 1 4-51 36 36 0 0 1 68-6 28 28 0 0 1 8 55Z" />
        <path d="M70 126l-8 20M100 126l-8 20M130 126l-8 20M85 152l-6 16M116 152l-6 16" />
      </Base>
    ),
  },
  {
    id: "torneira",
    nome: "Torneira",
    desenho: ({ className }) => (
      <Base className={className}>
        <path d="M40 70h60v28H40z" />
        <path d="M100 84h28v34h-14" />
        <path d="M70 70V52h24" />
        <path d="M82 44h28M96 44v8" />
        <path d="M114 124c0 6 4 8 4 14a8 8 0 1 1-16 0c0-6 4-8 4-14" />
        <path d="M46 150h108" />
      </Base>
    ),
  },
  {
    id: "peixe",
    nome: "Peixinho",
    desenho: ({ className }) => (
      <Base className={className}>
        <path d="M32 100c24-34 72-44 104-24 12 8 20 16 32 24-12 8-20 16-32 24-32 20-80 10-104-24Z" />
        <path d="M168 100c-14-4-22-16-22-28M168 100c-14 4-22 16-22 28" />
        <circle cx="66" cy="92" r="5" />
        <path d="M86 116c10 8 24 8 34 0" />
        <path d="M112 76c8 10 8 38 0 48" />
      </Base>
    ),
  },
  {
    id: "planta",
    nome: "Plantinha",
    desenho: ({ className }) => (
      <Base className={className}>
        <path d="M100 168V80" />
        <path d="M100 116c-30 0-44-18-44-40 26 0 44 14 44 40Z" />
        <path d="M100 96c0-26 18-42 46-42 0 24-16 42-46 42Z" />
        <path d="M66 168h68l-8 18H74z" />
      </Base>
    ),
  },
  {
    id: "sol",
    nome: "Sol",
    desenho: ({ className }) => (
      <Base className={className}>
        <circle cx="100" cy="100" r="40" />
        <path d="M100 30V12M100 188v-18M30 100H12M188 100h-18M50 50 38 38M150 150l12 12M150 50l12-12M50 150l-12 12" />
        <circle cx="86" cy="94" r="4" />
        <circle cx="114" cy="94" r="4" />
        <path d="M86 116c8 8 20 8 28 0" />
      </Base>
    ),
  },
  {
    id: "borboleta",
    nome: "Borboleta",
    desenho: ({ className }) => (
      <Base className={className}>
        <path d="M100 60v84" />
        <path d="M100 74c-14-26-56-34-62-6-5 24 26 34 62 22Z" />
        <path d="M100 118c-14 26-52 32-58 8-5-20 24-26 58-14Z" />
        <path d="M100 74c14-26 56-34 62-6 5 24-26 34-62 22Z" />
        <path d="M100 118c14 26 52 32 58 8 5-20-24-26-58-14Z" />
        <path d="M100 60c-4-12-12-16-18-18M100 60c4-12 12-16 18-18" />
      </Base>
    ),
  },
  {
    id: "casa",
    nome: "Casinha",
    desenho: ({ className }) => (
      <Base className={className}>
        <path d="M40 96 100 48l60 48" />
        <path d="M54 92v68h92V92" />
        <path d="M86 160v-38h28v38" />
        <path d="M120 74V58h16v29" />
      </Base>
    ),
  },
  {
    id: "regador",
    nome: "Regador",
    desenho: ({ className }) => (
      <Base className={className}>
        <path d="M56 86h64v66a10 10 0 0 1-10 10H66a10 10 0 0 1-10-10z" />
        <path d="M120 100l38-22v44" />
        <path d="M150 62h22v20" />
        <path d="M70 86c0-18 24-18 24 0" />
        <path d="M164 96c0 8 4 10 4 16a6 6 0 1 1-12 0c0-6 4-8 4-16" />
      </Base>
    ),
  },
  {
    id: "copo",
    nome: "Copo com água",
    desenho: ({ className }) => (
      <Base className={className}>
        <path d="M64 50h72l-10 112a8 8 0 0 1-8 8H82a8 8 0 0 1-8-8z" />
        <path d="M70 100c10 6 20-6 30 0s20 6 28 0" />
        <path d="M100 26c8 8 12 12 12 17a12 12 0 0 1-24 0c0-5 4-9 12-17Z" />
      </Base>
    ),
  },
];

export function Ilustracao({ id, className }: { id: IlustracaoId; className?: string }) {
  const item = ilustracoes.find((i) => i.id === id) ?? ilustracoes[0]!;
  return item.desenho({ className: className ?? "" });
}
