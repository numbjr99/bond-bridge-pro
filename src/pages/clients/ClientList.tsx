import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { formatCurrency, formatCNPJ } from "@/lib/format";
import { mockClients } from "@/lib/mock-data";

export default function ClientList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mockClients.filter(
    (c) =>
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.cnpj.includes(search.replace(/\D/g, ""))
  );

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gerencie os tomadores de seguro garantia"
        actions={
          <Button onClick={() => navigate("/clients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        }
      />

      <div className="p-8">
        {/* Search */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou CNPJ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhum cliente encontrado"
            description="Cadastre seu primeiro cliente para começar a operar cotações de seguro garantia."
            actionLabel="Novo Cliente"
            onAction={() => navigate("/clients/new")}
          />
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Razão Social</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">CNPJ</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">E-mail</th>
                  <th className="px-5 py-3 text-center font-medium text-muted-foreground">Apólices</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Cobertura Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-foreground">{client.company_name}</p>
                        <p className="text-xs text-muted-foreground">{client.trade_name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 tabular-nums text-muted-foreground">{formatCNPJ(client.cnpj)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{client.contact_email}</td>
                    <td className="px-5 py-3 text-center tabular-nums">{client.active_policies}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium">{formatCurrency(client.total_coverage)}</td>
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
