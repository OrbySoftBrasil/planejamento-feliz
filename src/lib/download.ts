import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

function nomeArquivo(titulo: string) {
  return titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

async function capturar(el: HTMLElement) {
  return toPng(el, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });
}

export async function baixarImagem(el: HTMLElement, titulo: string) {
  const dataUrl = await capturar(el);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${nomeArquivo(titulo)}.png`;
  a.click();
}

export async function baixarPdf(el: HTMLElement, titulo: string) {
  const dataUrl = await capturar(el);
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const largura = 210;
  const altura = (el.offsetHeight / el.offsetWidth) * largura;
  pdf.addImage(dataUrl, "PNG", 0, 0, largura, Math.min(altura, 297));
  pdf.save(`${nomeArquivo(titulo)}.pdf`);
}

export function baixarTexto(conteudo: string, titulo: string) {
  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nomeArquivo(titulo)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
