import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FileText, Users, Shield, LayoutDashboard, Plus } from "lucide-react";
import { mockClients, mockQuotations } from "@/lib/mock-data";

interface CommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandBar({ open, onOpenChange }: CommandBarProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar clientes, cotações, apólices..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Ações rápidas">
          <CommandItem onSelect={() => go("/quotations/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Cotação
          </CommandItem>
          <CommandItem onSelect={() => go("/clients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/quotations")}>
            <FileText className="mr-2 h-4 w-4" />
            Cotações
          </CommandItem>
          <CommandItem onSelect={() => go("/clients")}>
            <Users className="mr-2 h-4 w-4" />
            Clientes
          </CommandItem>
          <CommandItem onSelect={() => go("/policies")}>
            <Shield className="mr-2 h-4 w-4" />
            Apólices
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Clientes">
          {mockClients.slice(0, 5).map((c) => (
            <CommandItem key={c.id} onSelect={() => go(`/clients/${c.id}`)}>
              <Users className="mr-2 h-4 w-4" />
              {c.company_name}
              <span className="ml-auto text-xs text-muted-foreground">{c.cnpj}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Cotações recentes">
          {mockQuotations.slice(0, 5).map((q) => (
            <CommandItem key={q.id} onSelect={() => go(`/quotations/${q.id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              {q.code} — {q.client_name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
