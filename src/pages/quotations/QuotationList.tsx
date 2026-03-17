import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { QuotationStatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { mockQuotations, type QuotationStatus } from "@/lib/mock-data";

const STATUS_OPTIONS: { value: QuotationStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "draft", label: "Rascunho" },
  { value: "pending", label: "Pendente" },
  { value: "dispatched", label: "Enviada" },
  { value: "proposals_received", label: "Propostas recebidas" },
  { value: "selected", label: "Selecionada" },
  { value: "completed", label: "Concluída" },
  { value: "cancelled", label: "Cancelada" },
];

export default function QuotationList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const filtered = mockQuotations.filter((q) => {
    const matchSearch =
      q.code.toLowerCase().includes(search.toLowerCase()) ||
      q.client_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title="Cotações"
        description="Gerencie as solicitações de cotação de seguro garantia"
        actions={
          <Button onClick={() => navigate("/quotations/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Cotação
          </Button>
        }
      />

      <div className="p-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-52">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhuma cotação encontrada"
            description="Comece criando uma nova demanda de cotação para um cliente."
            actionLabel="Nova Cotação"
            onAction={() => navigate("/quotations/new")}
          />
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Código</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Cliente</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Modalidade</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Cobertura</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-center font-medium text-muted-foreground">Propostas</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr
                    key={q.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => navigate(`/quotations/${q.id}`)}
                  >
                    <td className="px-5 py-3 font-medium tabular-nums">{q.code}</td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium">{q.client_name}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">{q.client_cnpj}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground max-w-[200px] truncate">{q.modality_name}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium">{formatCurrency(q.insured_amount)}</td>
                    <td className="px-5 py-3"><QuotationStatusBadge status={q.status} /></td>
                    <td className="px-5 py-3 text-center tabular-nums">{q.proposals_count}</td>
                    <td className="px-5 py-3 tabular-nums text-muted-foreground">{formatDate(q.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
