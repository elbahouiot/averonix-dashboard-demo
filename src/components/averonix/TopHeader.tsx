import { Search, Bell, ChevronDown } from "lucide-react";
import { workspace, currentUser } from "@/mocks/data";

export function TopHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
      <div className="relative w-64">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search…"
          className="h-7 w-full rounded-md border border-transparent bg-[var(--primary-ultra-soft)] pl-8 pr-2 text-xs outline-none focus:bg-card focus:border-border"
        />
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-muted">
          <span className="h-4 w-4 rounded bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)]" />
          <span className="font-medium">{workspace.name}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
        <button className="relative rounded-md p-1.5 hover:bg-muted">
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
        </button>
        <div className="flex items-center gap-1.5 rounded-md pl-1 pr-2 py-0.5 hover:bg-muted">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-semibold text-white">{currentUser.initials}</div>
          <div className="hidden md:block leading-tight">
            <div className="text-[11px] font-medium">{currentUser.name}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
