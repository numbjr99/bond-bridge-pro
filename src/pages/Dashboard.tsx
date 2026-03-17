import { TrendingUp, TrendingDown, Shield, FileText, AlertTriangle, DollarSign, Clock, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { QuotationStatusBadge, PolicyStatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, daysFromNow } from "@/lib/format";
import { mockDashboard, mockQuotations, mockPolicies, mockActivity, formatDateTime as fmtDT } from "@/lib/mock-data";

const pipelineData = [
  { name: "Rascunho", count: 3, status: "draft" },
  { name: "Pendente", count: 2, status: "pending" },
  { name: "Enviada", count: 4, status: "dispatched" },
  { name: "Propostas", count: 3, status: "proposals_received" },
  { name: "Selecionada", count: 1, status: "selected" },
  { name: "Concluída", count: 5, status: "completed" },
];

const pipelineColors: Record<string, string> = {
  draft: "hsl(var(--muted-foreground))",
  pending: "hsl(var(--warning))",
  dispatched: "hsl(var(--primary))",
  proposals_received: "hsl(var(--primary))",
  selected: "hsl(var(--primary))",
  completed: "hsl(var(--success))",
};

const activityIcons: Record<string, typeof FileText> = {
  quotation_created: FileText,
  proposal_received: CheckCircle,
  policy_emitted: Shield,
  policy_expiring: AlertTriangle,
  client_created: TrendingUp,
};

export default function Dashboard() {
  const navigate = useNavigate();

  const kpis = [
    {
      label: "Cotações Ativas",
      value: mockDashboard.pending_quotations,
      change: "+12%",
      positive: true,
      icon: FileText,
    },
    {
      label: "Apólices Vigentes",
      value: mockDashboard.active_policies,
      change: "+8%",
      positive: true,
      icon: Shield,
    },
    {
      label: "Vencendo em 30 dias",
      value: mockDashboard.expiring_30d,
      change: mockDashboard.expiring_30d > 3 ? "Atenção" : "OK",
      positive: mockDashboard.expiring_30d <= 3,
      icon: AlertTriangle,
      highlight: mockDashboard.expiring_30d > 3,
    },
    {
      label: "Cobertura Total",
      value: formatCurrency(mockDashboard.total_coverage),
      change: "+15%",
      positive: true,
      icon: DollarSign,
      isCurrency: true,
    },
  ];

  const expiringPolicies = mockPolicies.filter(() => true).slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral da operação" />

      <div className="space-y-6 p-8">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated ${
                kpi.highlight ? "border-warning/30" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
                <kpi.icon
                  className={`h-5 w-5 ${kpi.highlight ? "text-warning" : "text-muted-foreground/50"}`}
                  strokeWidth={1.5}
                />
              </div>
              <div className="mt-2">
                <span className={`text-2xl font-bold tabular-nums ${kpi.isCurrency ? "text-lg" : ""}`}>
                  {kpi.isCurrency ? kpi.value : kpi.value}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                {kpi.positive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={`text-xs font-medium ${kpi.positive ? "text-success" : "text-destructive"}`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-muted-foreground">vs mês anterior</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pipeline */}
          <div className="col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="mb-4 text-base font-semibold">Pipeline de Cotações</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineData} layout="vertical" margin={{ left: 0, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "var(--shadow-elevated)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} cursor="pointer" onClick={(data) => navigate(`/quotations?status=${data.status}`)}>
                  {pipelineData.map((entry) => (
                    <Cell key={entry.status} fill={pipelineColors[entry.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Feed */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="mb-4 text-base font-semibold">Atividade Recente</h2>
            <div className="space-y-4">
              {mockActivity.slice(0, 6).map((item) => {
                const Icon = activityIcons[item.type] || Clock;
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground leading-snug">{item.description}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{fmtDT(item.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expiring Policies */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold">Apólices Vencendo em Breve</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Nº Apólice</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Cliente</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Seguradora</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Cobertura</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Vencimento</th>
                  <th className="px-5 py-3 text-center font-medium text-muted-foreground">Dias</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {expiringPolicies.map((p) => {
                  const days = daysFromNow(p.end_date);
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => navigate(`/policies/${p.id}`)}>
                      <td className="px-5 py-3 font-medium tabular-nums">{p.policy_number}</td>
                      <td className="px-5 py-3">{p.client_name}</td>
                      <td className="px-5 py-3">{p.insurer_name}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatCurrency(p.insured_amount)}</td>
                      <td className="px-5 py-3 tabular-nums">{formatDate(p.end_date)}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium tabular-nums ${days <= 15 ? "bg-destructive/10 text-destructive" : days <= 30 ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"}`}>
                          {days}d
                        </span>
                      </td>
                      <td className="px-5 py-3"><PolicyStatusBadge status={p.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
