import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Plus, Building2, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatCNPJ, formatDate } from "@/lib/format";
import { mockClients } from "@/lib/mock-data";

const mockDocuments = [
  { id: "1", type: "Contrato Social", name: "contrato_social_v3.pdf", version: 3, uploaded_at: "2026-02-15", status: "valid" },
  { id: "2", type: "Balanço Patrimonial", name: "balanco_2025.pdf", version: 1, uploaded_at: "2026-01-10", status: "valid" },
  { id: "3", type: "Certidão Negativa Federal", name: "cnd_federal.pdf", version: 2, uploaded_at: "2025-12-20", status: "expired" },
];

const mockInsurers = [
  { id: "1", name: "Pottencial Seguradora", capacity_total: 10_000_000, capacity_used: 4_500_000, commission: 25, ccg_expiry: "2027-01-15", status: "approved" },
  { id: "2", name: "Tokio Marine", capacity_total: 8_000_000, capacity_used: 750_000, commission: 22, ccg_expiry: "2026-11-30", status: "approved" },
  { id: "3", name: "Porto Seguro", capacity_total: 5_000_000, capacity_used: 280_000, commission: 20, ccg_expiry: "2026-08-15", status: "pending" },
];

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = mockClients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Cliente não encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <button onClick={() => navigate("/clients")} className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Clientes
        </button>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{client.company_name}</h1>
              <p className="text-sm text-muted-foreground">CNPJ: {formatCNPJ(client.cnpj)} · {client.trade_name}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(`/quotations/new?client_id=${client.id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              Nova Cotação
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-5 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Apólices Ativas</p>
            <p className="text-lg font-bold tabular-nums">{client.active_policies}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Cobertura Total</p>
            <p className="text-lg font-bold tabular-nums">{formatCurrency(client.total_coverage)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Cliente desde</p>
            <p className="text-lg font-bold tabular-nums">{formatDate(client.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-8">
        <Tabs defaultValue="data" className="space-y-6">
          <TabsList>
            <TabsTrigger value="data">Dados</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="insurers">Seguradoras</TabsTrigger>
          </TabsList>

          <TabsContent value="data">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Razão Social</p>
                  <p className="mt-1 text-sm font-medium">{client.company_name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Nome Fantasia</p>
                  <p className="mt-1 text-sm font-medium">{client.trade_name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">CNPJ</p>
                  <p className="mt-1 text-sm font-medium tabular-nums">{formatCNPJ(client.cnpj)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">E-mail</p>
                  <p className="mt-1 text-sm font-medium">{client.contact_email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Telefone</p>
                  <p className="mt-1 text-sm font-medium tabular-nums">{client.contact_phone}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="rounded-xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="font-semibold">Documentos</h3>
                <Button size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Arquivo</th>
                    <th className="px-5 py-3 text-center font-medium text-muted-foreground">Versão</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Data Upload</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium">{doc.type}</td>
                      <td className="px-5 py-3 text-muted-foreground">{doc.name}</td>
                      <td className="px-5 py-3 text-center tabular-nums">v{doc.version}</td>
                      <td className="px-5 py-3 tabular-nums">{formatDate(doc.uploaded_at)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${doc.status === "valid" ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>
                          {doc.status === "valid" ? "Válido" : "Vencido"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="insurers">
            <div className="rounded-xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="font-semibold">Seguradoras Vinculadas</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Vincular Seguradora
                </Button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Seguradora</th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">Capacidade Total</th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">Utilizada</th>
                    <th className="px-5 py-3 text-center font-medium text-muted-foreground">Comissão</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">CCG</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInsurers.map((ins) => (
                    <tr key={ins.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium">{ins.name}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatCurrency(ins.capacity_total)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatCurrency(ins.capacity_used)}</td>
                      <td className="px-5 py-3 text-center tabular-nums">{ins.commission}%</td>
                      <td className="px-5 py-3 tabular-nums">{formatDate(ins.ccg_expiry)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${ins.status === "approved" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                          {ins.status === "approved" ? "Aprovada" : "Pendente"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
