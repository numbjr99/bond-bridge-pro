import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, BarChart3, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuotationStatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { mockQuotations, mockActivity } from "@/lib/mock-data";
import { toast } from "sonner";

const mockProposals = [
  { id: "1", insurer: "Pottencial Seguradora", status: "quoted" as const, rate: 0.7, gross_premium: 36_400, net_premium: 33_000, iof: 2_548, commission: 25, installments: 4, payment_type: "Boleto", conditions: "Sem ressalvas" },
  { id: "2", insurer: "Tokio Marine", status: "quoted" as const, rate: 0.65, gross_premium: 33_800, net_premium: 30_600, iof: 2_360, commission: 22, installments: 3, payment_type: "Boleto", conditions: "Exige contragarantia pessoal" },
  { id: "3", insurer: "Porto Seguro", status: "pending" as const, rate: 0, gross_premium: 0, net_premium: 0, iof: 0, commission: 0, installments: 0, payment_type: "", conditions: "" },
  { id: "4", insurer: "Essor Seguros", status: "declined" as const, rate: 0, gross_premium: 0, net_premium: 0, iof: 0, commission: 0, installments: 0, payment_type: "", conditions: "Risco não aceito" },
];

const proposalStatusConfig = {
  quoted: { label: "Cotada", icon: CheckCircle, className: "text-success" },
  pending: { label: "Aguardando", icon: Clock, className: "text-warning" },
  declined: { label: "Recusada", icon: XCircle, className: "text-destructive" },
  error: { label: "Erro", icon: AlertCircle, className: "text-destructive" },
};

export default function QuotationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quotation = mockQuotations.find((q) => q.id === id);

  if (!quotation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Cotação não encontrada.</p>
      </div>
    );
  }

  const quotedProposals = mockProposals.filter((p) => p.status === "quoted");
  const bestRate = quotedProposals.length > 0 ? Math.min(...quotedProposals.map((p) => p.rate)) : null;
  const bestPremium = quotedProposals.length > 0 ? Math.min(...quotedProposals.map((p) => p.gross_premium)) : null;

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <button onClick={() => navigate("/quotations")} className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cotações
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{quotation.code}</h1>
              <QuotationStatusBadge status={quotation.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {quotation.client_name} · {quotation.modality_name}
            </p>
          </div>
          <div className="flex gap-3">
            {quotation.status === "draft" && (
              <Button onClick={() => toast.success("Cotação disparada para seguradoras!")}>
                <Send className="mr-2 h-4 w-4" />
                Disparar para Seguradoras
              </Button>
            )}
            {quotation.status === "proposals_received" && (
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Comparar Propostas
              </Button>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Valor de Cobertura</p>
            <p className="text-lg font-bold tabular-nums">{formatCurrency(quotation.insured_amount)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Propostas</p>
            <p className="text-lg font-bold tabular-nums">{quotation.proposals_count}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Criada em</p>
            <p className="text-lg font-bold tabular-nums">{formatDate(quotation.created_at)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Melhor Taxa</p>
            <p className="text-lg font-bold tabular-nums text-success">{bestRate ? `${bestRate}%` : "—"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-8">
        {/* Proposals */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold">Propostas Recebidas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Seguradora</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Taxa</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Prêmio Bruto</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Prêmio Líquido</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">IOF</th>
                  <th className="px-5 py-3 text-center font-medium text-muted-foreground">Comissão</th>
                  <th className="px-5 py-3 text-center font-medium text-muted-foreground">Parcelas</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Ação</th>
                </tr>
              </thead>
              <tbody>
                {mockProposals.map((p) => {
                  const statusCfg = proposalStatusConfig[p.status];
                  const StatusIcon = statusCfg.icon;
                  const isBestRate = p.status === "quoted" && p.rate === bestRate;
                  const isBestPremium = p.status === "quoted" && p.gross_premium === bestPremium;

                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium">{p.insurer}</td>
                      <td className="px-5 py-3">
                        <div className={`flex items-center gap-1.5 ${statusCfg.className}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-xs font-medium">{statusCfg.label}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        {p.status === "quoted" ? (
                          <span className={isBestRate ? "rounded bg-success/15 px-2 py-0.5 font-semibold text-success" : ""}>
                            {p.rate}%
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        {p.status === "quoted" ? (
                          <span className={isBestPremium ? "rounded bg-success/15 px-2 py-0.5 font-semibold text-success" : ""}>
                            {formatCurrency(p.gross_premium)}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">{p.status === "quoted" ? formatCurrency(p.net_premium) : "—"}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{p.status === "quoted" ? formatCurrency(p.iof) : "—"}</td>
                      <td className="px-5 py-3 text-center tabular-nums">{p.status === "quoted" ? `${p.commission}%` : "—"}</td>
                      <td className="px-5 py-3 text-center tabular-nums">{p.status === "quoted" ? `${p.installments}x` : "—"}</td>
                      <td className="px-5 py-3">
                        {p.status === "quoted" && (
                          <Button size="sm" variant="outline" onClick={() => toast.success(`Proposta da ${p.insurer} selecionada!`)}>
                            Selecionar
                          </Button>
                        )}
                        {p.status === "pending" && (
                          <span className="inline-flex items-center gap-1 text-xs text-warning">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-warning" />
                            Aguardando
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 text-base font-semibold">Timeline</h2>
          <div className="relative ml-3 border-l-2 border-border pl-6 space-y-6">
            {mockActivity.slice(0, 5).map((event, idx) => (
              <div key={event.id} className="relative">
                <div className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-border bg-card">
                  <div className={`h-2 w-2 rounded-full ${idx === 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                </div>
                <p className="text-sm text-foreground">{event.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">{formatDateTime(event.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
