import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { workspace, currentUser } from "@/mocks/data";

export function TopHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search controls, vendors, risks…" className="h-9 pl-9 bg-[var(--primary-ultra-soft)] border-transparent focus-visible:bg-card" />
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted">
          <span className="h-5 w-5 rounded bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)]" />
          <span className="font-medium">{workspace.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <button className="relative rounded-md p-2 hover:bg-muted">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
        </button>
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-white">{currentUser.initials}</div>
          <div className="hidden md:block">
            <div className="text-xs font-medium leading-tight">{currentUser.name}</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
