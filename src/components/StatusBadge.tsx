import { cn } from "@/lib/utils";
import type { QuotationStatus, PolicyStatus } from "@/lib/mock-data";

const QUOTATION_STATUS_MAP: Record<QuotationStatus, { label: string; className: string }> = {
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  pending: { label: "Pendente", className: "bg-warning/15 text-warning" },
  dispatched: { label: "Enviada", className: "bg-primary/10 text-primary" },
  proposals_received: { label: "Propostas recebidas", className: "bg-success/15 text-success" },
  selected: { label: "Selecionada", className: "bg-success/15 text-success" },
  completed: { label: "Concluída", className: "bg-success/15 text-success" },
  cancelled: { label: "Cancelada", className: "bg-destructive/10 text-destructive" },
};

const POLICY_STATUS_MAP: Record<PolicyStatus, { label: string; className: string }> = {
  pending_emission: { label: "Aguardando emissão", className: "bg-warning/15 text-warning" },
  emitted: { label: "Emitida", className: "bg-primary/10 text-primary" },
  active: { label: "Ativa", className: "bg-success/15 text-success" },
  expired: { label: "Vencida", className: "bg-destructive/10 text-destructive" },
  cancelled: { label: "Cancelada", className: "bg-muted text-muted-foreground" },
};

export function QuotationStatusBadge({ status }: { status: QuotationStatus }) {
  const config = QUOTATION_STATUS_MAP[status];
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}

export function PolicyStatusBadge({ status }: { status: PolicyStatus }) {
  const config = POLICY_STATUS_MAP[status];
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}
