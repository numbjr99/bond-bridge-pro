import { useState } from "react";
import { Plus, CheckCircle, XCircle, Shield, KeyRound, Users, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

const mockCredentials = [
  { id: "1", insurer: "Pottencial Seguradora", auth_method: "OAuth2", broker_code: "BRK-4521", status: "active", last_verified: "2026-03-15T10:00:00Z" },
  { id: "2", insurer: "Tokio Marine", auth_method: "API Key", broker_code: "TM-8834", status: "active", last_verified: "2026-03-10T14:30:00Z" },
  { id: "3", insurer: "Porto Seguro", auth_method: "Basic Auth", broker_code: "PS-1122", status: "inactive", last_verified: null },
];

const mockUsers = [
  { id: "1", name: "Carlos Silva", email: "carlos@alpha.garantia.app", role: "admin", last_login: "2026-03-17T09:00:00Z", is_active: true },
  { id: "2", name: "Ana Oliveira", email: "ana@alpha.garantia.app", role: "operador", last_login: "2026-03-16T15:30:00Z", is_active: true },
  { id: "3", name: "João Santos", email: "joao@alpha.garantia.app", role: "visualizador", last_login: "2026-03-14T08:00:00Z", is_active: true },
];

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  operador: "Operador",
  visualizador: "Visualizador",
};

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Configurações" description="Gerencie credenciais, usuários e dados da corretora" />

      <div className="p-8">
        <Tabs defaultValue="credentials" className="space-y-6">
          <TabsList>
            <TabsTrigger value="credentials">
              <KeyRound className="mr-2 h-4 w-4" />
              Credenciais
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="brokerage">
              <Building2 className="mr-2 h-4 w-4" />
              Corretora
            </TabsTrigger>
          </TabsList>

          {/* Credentials */}
          <TabsContent value="credentials">
            <div className="rounded-xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="font-semibold">Credenciais de Seguradoras</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Credencial
                </Button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Seguradora</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Método</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Cód. Corretora</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Verificação</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCredentials.map((cred) => (
                    <tr key={cred.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium">{cred.insurer}</td>
                      <td className="px-5 py-3 text-muted-foreground">{cred.auth_method}</td>
                      <td className="px-5 py-3 tabular-nums text-muted-foreground">{cred.broker_code}</td>
                      <td className="px-5 py-3">
                        <div className={`flex items-center gap-1.5 ${cred.status === "active" ? "text-success" : "text-muted-foreground"}`}>
                          {cred.status === "active" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          <span className="text-xs font-medium">{cred.status === "active" ? "Ativo" : "Inativo"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 tabular-nums text-muted-foreground">{cred.last_verified ? formatDate(cred.last_verified) : "—"}</td>
                      <td className="px-5 py-3">
                        <Button size="sm" variant="outline" onClick={() => toast.success(`Conexão com ${cred.insurer} verificada!`)}>
                          Verificar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <div className="rounded-xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="font-semibold">Usuários</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Nome</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">E-mail</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Perfil</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Último Login</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium">{u.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          u.role === "admin" ? "bg-primary/10 text-primary" : u.role === "operador" ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {roleLabels[u.role]}
                        </span>
                      </td>
                      <td className="px-5 py-3 tabular-nums text-muted-foreground">{formatDate(u.last_login)}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center rounded-md bg-success/15 px-2 py-1 text-xs font-medium text-success">Ativo</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Brokerage */}
          <TabsContent value="brokerage">
            <div className="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="mb-5 font-semibold">Dados da Corretora</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Razão Social</p>
                  <p className="mt-1 text-sm font-medium">Alpha Corretora de Seguros Ltda</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">CNPJ</p>
                  <p className="mt-1 text-sm font-medium tabular-nums">12.345.678/0001-90</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">E-mail</p>
                  <p className="mt-1 text-sm font-medium">contato@alpha.garantia.app</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Telefone</p>
                  <p className="mt-1 text-sm font-medium tabular-nums">(11) 3456-7890</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">SUSEP</p>
                  <p className="mt-1 text-sm font-medium tabular-nums">15414.900001/2024-00</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Subdomínio</p>
                  <p className="mt-1 text-sm font-medium">alpha.garantia.app</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline">Editar</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
