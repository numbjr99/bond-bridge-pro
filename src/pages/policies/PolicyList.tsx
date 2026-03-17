import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { PolicyStatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, daysFromNow } from "@/lib/format";
import { mockPolicies, type PolicyStatus } from "@/lib/mock-data";

const STATUS_OPTIONS: { value: PolicyStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "active", label: "Ativa" },
  { value: "pending_emission", label: "Aguardando emissão" },
  { value: "emitted", label: "Emitida" },
  { value: "expired", label: "Vencida" },
  { value: "cancelled", label: "Cancelada" },
];

export default function PolicyList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockPolicies.filter((p) => {
    const matchSearch =
      p.policy_number.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageHeader title="Apólices" description="Gerencie as apólices de seguro garantia emitidas" />

      <div className="p-8">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nº apólice ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="Nenhuma apólice encontrada" description="As apólices emitidas aparecerão aqui após a conclusão do fluxo de cotação." />
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Nº Apólice</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Cliente</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Seguradora</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Modalidade</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Cobertura</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Prêmio</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Vigência</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => navigate(`/policies/${p.id}`)}>
                    <td className="px-5 py-3 font-medium tabular-nums">{p.policy_number}</td>
                    <td className="px-5 py-3">{p.client_name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.insurer_name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.modality_name}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium">{formatCurrency(p.insured_amount)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{formatCurrency(p.premium_amount)}</td>
                    <td className="px-5 py-3 tabular-nums text-muted-foreground">{formatDate(p.start_date)} — {formatDate(p.end_date)}</td>
                    <td className="px-5 py-3"><PolicyStatusBadge status={p.status} /></td>
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
