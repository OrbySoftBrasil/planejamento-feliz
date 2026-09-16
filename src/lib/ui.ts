import { campoCor, type CampoExperiencia } from "@/data/mock";

const mapa: Record<string, { chip: string; ponto: string; texto: string }> = {
  agua: { chip: "bg-agua-suave", ponto: "bg-agua", texto: "text-agua" },
  folha: { chip: "bg-folha-suave", ponto: "bg-folha", texto: "text-folha" },
  sol: { chip: "bg-sol-suave", ponto: "bg-sol", texto: "text-sol" },
  coral: { chip: "bg-coral-suave", ponto: "bg-coral", texto: "text-coral" },
  primary: { chip: "bg-accent", ponto: "bg-primary", texto: "text-primary" },
};

export function corDoCampo(campo: CampoExperiencia) {
  return mapa[campoCor[campo]] ?? mapa["primary"]!;
}

export const corDoTipo: Record<string, string> = {
  rotina: "bg-muted",
  atividade: "bg-agua-suave",
  projeto: "bg-folha-suave",
  evento: "bg-sol-suave",
};

export const pontoDoTipo: Record<string, string> = {
  rotina: "bg-muted-foreground/40",
  atividade: "bg-agua",
  projeto: "bg-folha",
  evento: "bg-sol",
};
