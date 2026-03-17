// Mock data for GarantIA MVP frontend development

export type QuotationStatus = "draft" | "pending" | "dispatched" | "proposals_received" | "selected" | "completed" | "cancelled";
export type PolicyStatus = "pending_emission" | "emitted" | "active" | "expired" | "cancelled";

export interface DashboardSummary {
  active_policies: number;
  total_coverage: number;
  expiring_30d: number;
  pending_quotations: number;
  quotations_this_month: number;
  emission_rate: number;
}

export interface QuotationListItem {
  id: string;
  code: string;
  client_name: string;
  client_cnpj: string;
  modality_name: string;
  insured_amount: number;
  status: QuotationStatus;
  created_at: string;
  proposals_count: number;
}

export interface PolicyListItem {
  id: string;
  policy_number: string;
  client_name: string;
  insurer_name: string;
  modality_name: string;
  insured_amount: number;
  premium_amount: number;
  start_date: string;
  end_date: string;
  status: PolicyStatus;
}

export interface ClientListItem {
  id: string;
  company_name: string;
  trade_name: string;
  cnpj: string;
  contact_email: string;
  contact_phone: string;
  active_policies: number;
  total_coverage: number;
  created_at: string;
}

export interface ActivityItem {
  id: string;
  type: "quotation_created" | "proposal_received" | "policy_emitted" | "policy_expiring" | "client_created";
  description: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export const mockDashboard: DashboardSummary = {
  active_policies: 47,
  total_coverage: 125_800_000,
  expiring_30d: 5,
  pending_quotations: 12,
  quotations_this_month: 23,
  emission_rate: 78.5,
};

export const mockQuotations: QuotationListItem[] = [
  { id: "1", code: "COT-2026-0042", client_name: "Construtora Horizonte Ltda", client_cnpj: "12.345.678/0001-90", modality_name: "Execução Contratual — Setor Público", insured_amount: 5_200_000, status: "proposals_received", created_at: "2026-03-15T10:30:00Z", proposals_count: 4 },
  { id: "2", code: "COT-2026-0041", client_name: "Engenharia Vértice S.A.", client_cnpj: "98.765.432/0001-10", modality_name: "Depósito Recursal Trabalhista", insured_amount: 850_000, status: "dispatched", created_at: "2026-03-14T14:20:00Z", proposals_count: 0 },
  { id: "3", code: "COT-2026-0040", client_name: "Pavimentações BR Ltda", client_cnpj: "11.222.333/0001-44", modality_name: "Licitante (Bid Bond)", insured_amount: 320_000, status: "selected", created_at: "2026-03-13T09:15:00Z", proposals_count: 3 },
  { id: "4", code: "COT-2026-0039", client_name: "Tech Solutions Brasil", client_cnpj: "55.666.777/0001-88", modality_name: "Execução Contratual — Setor Privado", insured_amount: 1_500_000, status: "completed", created_at: "2026-03-12T16:45:00Z", proposals_count: 2 },
  { id: "5", code: "COT-2026-0038", client_name: "Logística Integrada S.A.", client_cnpj: "33.444.555/0001-22", modality_name: "Admissão Temporária", insured_amount: 2_100_000, status: "draft", created_at: "2026-03-11T08:00:00Z", proposals_count: 0 },
  { id: "6", code: "COT-2026-0037", client_name: "Construtora Horizonte Ltda", client_cnpj: "12.345.678/0001-90", modality_name: "Adiantamento de Pagamento — Setor Público", insured_amount: 980_000, status: "pending", created_at: "2026-03-10T11:30:00Z", proposals_count: 0 },
  { id: "7", code: "COT-2026-0036", client_name: "Mineração Sul Ltda", client_cnpj: "77.888.999/0001-66", modality_name: "Judicial Cível", insured_amount: 3_400_000, status: "cancelled", created_at: "2026-03-09T13:10:00Z", proposals_count: 1 },
];

export const mockPolicies: PolicyListItem[] = [
  { id: "1", policy_number: "POL-2026-00123", client_name: "Construtora Horizonte Ltda", insurer_name: "Pottencial Seguradora", modality_name: "Execução Contratual", insured_amount: 4_500_000, premium_amount: 31_500, start_date: "2026-01-15", end_date: "2027-01-15", status: "active" },
  { id: "2", policy_number: "POL-2026-00122", client_name: "Engenharia Vértice S.A.", insurer_name: "Tokio Marine", modality_name: "Depósito Recursal", insured_amount: 750_000, premium_amount: 5_250, start_date: "2026-02-01", end_date: "2027-02-01", status: "active" },
  { id: "3", policy_number: "POL-2025-00098", client_name: "Pavimentações BR Ltda", insurer_name: "Porto Seguro", modality_name: "Licitante", insured_amount: 280_000, premium_amount: 1_960, start_date: "2025-06-01", end_date: "2026-04-01", status: "active" },
];

export const mockClients: ClientListItem[] = [
  { id: "1", company_name: "Construtora Horizonte Ltda", trade_name: "Horizonte", cnpj: "12.345.678/0001-90", contact_email: "contato@horizonte.com.br", contact_phone: "(11) 3456-7890", active_policies: 12, total_coverage: 45_000_000, created_at: "2025-08-15" },
  { id: "2", company_name: "Engenharia Vértice S.A.", trade_name: "Vértice", cnpj: "98.765.432/0001-10", contact_email: "admin@vertice.eng.br", contact_phone: "(21) 2345-6789", active_policies: 8, total_coverage: 22_500_000, created_at: "2025-09-20" },
  { id: "3", company_name: "Pavimentações BR Ltda", trade_name: "PavBR", cnpj: "11.222.333/0001-44", contact_email: "operacoes@pavbr.com.br", contact_phone: "(31) 3456-1234", active_policies: 5, total_coverage: 8_900_000, created_at: "2025-10-10" },
  { id: "4", company_name: "Tech Solutions Brasil", trade_name: "TechBR", cnpj: "55.666.777/0001-88", contact_email: "jurídico@techbr.com", contact_phone: "(11) 9876-5432", active_policies: 3, total_coverage: 4_500_000, created_at: "2025-11-05" },
  { id: "5", company_name: "Logística Integrada S.A.", trade_name: "LogInt", cnpj: "33.444.555/0001-22", contact_email: "seguros@logint.com.br", contact_phone: "(41) 3333-4444", active_policies: 7, total_coverage: 15_200_000, created_at: "2025-12-01" },
  { id: "6", company_name: "Mineração Sul Ltda", trade_name: "MinSul", cnpj: "77.888.999/0001-66", contact_email: "financeiro@minsul.com.br", contact_phone: "(48) 2222-3333", active_policies: 2, total_coverage: 6_800_000, created_at: "2026-01-15" },
];

export const mockActivity: ActivityItem[] = [
  { id: "1", type: "proposal_received", description: "Proposta recebida da Pottencial para COT-2026-0042", timestamp: "2026-03-17T09:45:00Z", metadata: { insurer: "Pottencial", rate: "0.70%" } },
  { id: "2", type: "quotation_created", description: "Nova cotação criada para Engenharia Vértice", timestamp: "2026-03-17T08:30:00Z", metadata: { code: "COT-2026-0041" } },
  { id: "3", type: "policy_emitted", description: "Apólice POL-2026-00123 emitida pela Tokio Marine", timestamp: "2026-03-16T16:20:00Z" },
  { id: "4", type: "policy_expiring", description: "Apólice POL-2025-00098 vence em 15 dias", timestamp: "2026-03-16T08:00:00Z" },
  { id: "5", type: "proposal_received", description: "Proposta recebida da Porto Seguro para COT-2026-0040", timestamp: "2026-03-15T14:10:00Z", metadata: { insurer: "Porto Seguro", rate: "0.65%" } },
  { id: "6", type: "client_created", description: "Novo cliente cadastrado: Mineração Sul Ltda", timestamp: "2026-03-15T10:00:00Z" },
  { id: "7", type: "quotation_created", description: "Nova cotação criada para Construtora Horizonte", timestamp: "2026-03-14T11:20:00Z", metadata: { code: "COT-2026-0042" } },
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(dateStr));
}
