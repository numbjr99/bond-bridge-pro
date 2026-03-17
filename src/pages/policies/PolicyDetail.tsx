import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PolicyStatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, daysFromNow } from "@/lib/format";
import { mockPolicies } from "@/lib/mock-data";

const mockBillings = [
  { id: "1", installment: 1, amount: 7_875, due_date: "2026-02-15", status: "paid" as const },
  { id: "2", installment: 2, amount: 7_875, due_date: "2026-03-15", status: "paid" as const },
  { id: "3", installment: 3, amount: 7_875, due_date: "2026-04-15", status: "pending" as const },
  { id: "4", installment: 4, amount: 7_875, due_date: "2026-05-15", status: "pending" as const },
];

export default function PolicyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const policy = mockPolicies.find((p) => p.id === id);

  if (!policy) {
    return <div className="flex h-full items-center justify-center"><p className="text-muted-foreground">Apólice não encontrada.</p></div>;
  }

  const days = daysFromNow(policy.end_date);

  return (
    <div>
      <div className="border-b border-border bg-card px-8 py-6">
        <button onClick={() => navigate("/policies")} className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Apólices
        </button>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <Shield className="h-6 w-6 text-success" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{policy.policy_number}</h1>
                <PolicyStatusBadge status={policy.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{policy.client_name} · {policy.insurer_name} · {policy.modality_name}</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Cobertura</p>
            <p className="text-lg font-bold tabular-nums">{formatCurrency(policy.insured_amount)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Prêmio</p>
            <p className="text-lg font-bold tabular-nums">{formatCurrency(policy.premium_amount)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Vigência</p>
            <p className="text-sm font-bold tabular-nums">{formatDate(policy.start_date)} — {formatDate(policy.end_date)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Dias restantes</p>
            <p className={`text-lg font-bold tabular-nums ${days <= 30 ? "text-warning" : "text-foreground"}`}>{days}d</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold">Boletos / Parcelas</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-center font-medium text-muted-foreground">Parcela</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Valor</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Vencimento</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockBillings.map((b) => {
                const isOverdue = b.status === "pending" && daysFromNow(b.due_date) < 0;
                return (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 text-center tabular-nums font-medium">{b.installment}/{mockBillings.length}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{formatCurrency(b.amount)}</td>
                    <td className="px-5 py-3 tabular-nums">{formatDate(b.due_date)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        b.status === "paid"
                          ? "bg-success/15 text-success"
                          : isOverdue
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/15 text-warning"
                      }`}>
                        {b.status === "paid" ? "Pago" : isOverdue ? "Vencido" : "Pendente"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
