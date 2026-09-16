import { Link } from "@tanstack/react-router";
import { CalendarDays, Home, Layers, MessageCircleHeart, Sparkles, User } from "lucide-react";
import type { ReactNode } from "react";
import { professora } from "@/data/mock";
import { cn } from "@/lib/utils";

const itens = [
  { to: "/", label: "Hoje", icon: Home },
  { to: "/planejamento", label: "Planejamento", icon: Layers },
  { to: "/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/atividades", label: "Atividades", icon: Sparkles },
  { to: "/assistente", label: "Assistente", icon: MessageCircleHeart },
] as const;

export function AppShell({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="no-print fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
        <div className="flex items-center gap-2 px-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold">Planeja</span>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {itens.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-accent text-accent-foreground font-semibold" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] text-foreground/80 transition-colors hover:bg-accent/60"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/perfil"
          activeProps={{ className: "bg-accent" }}
          className="mt-auto flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent/60"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sol-suave text-sm font-bold text-foreground">
            AL
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{professora.nome}</span>
            <span className="block truncate text-xs text-muted-foreground">{professora.turma}</span>
          </span>
        </Link>
      </aside>

      <div className="lg:pl-60">
        <header className="no-print border-b border-border bg-card/70 px-5 py-5 backdrop-blur sm:px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{titulo}</h1>
              {subtitulo ? (
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitulo}</p>
              ) : null}
            </div>
            <Link
              to="/perfil"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sol-suave text-sm font-bold lg:hidden"
              aria-label="Meu perfil"
            >
              AL
            </Link>
          </div>
        </header>

        <main className="print-area mx-auto max-w-4xl px-5 pb-28 pt-6 sm:px-8 lg:pb-16">{children}</main>
      </div>

      <nav className="no-print fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {itens.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            activeProps={{ className: "text-primary" }}
            className={cn("flex flex-col items-center gap-1 px-1 py-2.5 text-[0.7rem] text-muted-foreground")}
          >
            <item.icon className="h-5 w-5" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function TagIcon() {
  return <User className="h-4 w-4" />;
}
