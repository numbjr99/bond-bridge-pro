import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DynamicFormRenderer from "@/components/DynamicFormRenderer";
import { toast } from "sonner";

const mockModalities = [
  { id: "1", name: "Judicial Trabalhista", category: "judicial", form_schema: { type: "object", required: ["process_number", "court_code"], properties: { process_number: { type: "string", title: "Número do Processo (CNJ)" }, court_code: { type: "string", title: "Tribunal" }, court_branch_code: { type: "string", title: "Vara" }, labor_coverage: { type: "boolean", title: "Cobertura Trabalhista" } } } },
  { id: "2", name: "Depósito Recursal", category: "judicial", form_schema: { type: "object", required: ["process_number", "court_code", "appeal_type", "validity_period_years"], properties: { process_number: { type: "string", title: "Número do Processo (CNJ)" }, court_code: { type: "string", title: "Tribunal" }, court_branch_code: { type: "string", title: "Vara" }, appeal_type: { type: "string", title: "Tipo de Recurso", enum: ["agravo_instrumento", "embargos", "recurso_revista", "recurso_ordinario", "acao_rescisoria", "recurso_extraordinario"] }, validity_period_years: { type: "integer", title: "Prazo de Validade (anos)", enum: [3, 4, 5] } } } },
  { id: "3", name: "Licitante (Bid Bond)", category: "public", form_schema: { type: "object", required: ["bidding_number", "bidding_type"], properties: { bidding_number: { type: "string", title: "Número da Licitação" }, bidding_type: { type: "string", title: "Tipo de Licitação", enum: ["pregao_eletronico", "concorrencia", "tomada_precos", "convite", "rdc"] }, contracting_authority: { type: "string", title: "Órgão Contratante" } } } },
  { id: "4", name: "Performance Bond — Setor Público", category: "public", form_schema: { type: "object", required: ["contract_number"], properties: { contract_number: { type: "string", title: "Número do Contrato" }, contracting_authority: { type: "string", title: "Órgão Contratante" }, contract_object: { type: "string", title: "Objeto do Contrato" } } } },
  { id: "5", name: "Judicial Cível", category: "judicial", form_schema: { type: "object", required: ["process_number", "court_code"], properties: { process_number: { type: "string", title: "Número do Processo" }, court_code: { type: "string", title: "Tribunal" }, court_branch_code: { type: "string", title: "Vara" } } } },
  { id: "6", name: "Execução Fiscal", category: "judicial", form_schema: { type: "object", required: ["process_number"], properties: { process_number: { type: "string", title: "Número do Processo" }, tax_authority: { type: "string", title: "Ente Tributante" }, tax_type: { type: "string", title: "Tipo de Tributo", enum: ["icms", "iss", "irpj", "pis_cofins", "ipi", "outros"] } } } },
  { id: "7", name: "Locatício (Fiança)", category: "private", form_schema: { type: "object", required: ["monthly_rent"], properties: { monthly_rent: { type: "number", title: "Aluguel Mensal (R$)" }, lease_term_months: { type: "integer", title: "Prazo do Contrato (meses)", enum: [12, 24, 30, 36, 48, 60] }, property_address: { type: "string", title: "Endereço do Imóvel" } } } },
  { id: "8", name: "Admissão Temporária", category: "customs", form_schema: { type: "object", required: ["import_declaration"], properties: { import_declaration: { type: "string", title: "Número da DI" }, goods_description: { type: "string", title: "Descrição dos Bens" }, customs_office: { type: "string", title: "Alfândega" } } } },
];

const mockClientInsurers = [
  { id: "1", name: "Pottencial Seguradora", available: true },
  { id: "2", name: "Tokio Marine", available: true },
  { id: "3", name: "Porto Seguro", available: true },
  { id: "4", name: "Junto Seguros", available: true },
  { id: "5", name: "Essor Seguros", available: false },
];

const CATEGORIES: Record<string, string> = {
  judicial: "Judicial",
  public: "Setor Público",
  private: "Setor Privado",
  customs: "Aduaneiro",
};

export default function NewQuotation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 state
  const [clientId, setClientId] = useState("");
  const [modalityId, setModalityId] = useState("");
  const [insuranceType, setInsuranceType] = useState("new");
  const [insuredAmount, setInsuredAmount] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Step 2 state
  const [modalityData, setModalityData] = useState<Record<string, unknown>>({});

  // Step 3 state
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>([]);

  const selectedModality = mockModalities.find((m) => m.id === modalityId);
  const groupedModalities = Object.entries(CATEGORIES).map(([key, label]) => ({
    category: label,
    items: mockModalities.filter((m) => m.category === key),
  }));

  const canProceedStep1 = clientId && modalityId && insuredAmount && startDate && endDate;
  const canProceedStep3 = selectedInsurers.length > 0;

  const handleSubmit = () => {
    toast.success("Cotação criada com sucesso!");
    navigate("/quotations");
  };

  const steps = [
    { num: 1, label: "Dados Básicos" },
    { num: 2, label: "Dados da Modalidade" },
    { num: 3, label: "Seguradoras" },
  ];

  return (
    <div>
      <div className="border-b border-border bg-card px-8 py-6">
        <button onClick={() => navigate("/quotations")} className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cotações
        </button>
        <h1 className="text-2xl font-bold">Nova Cotação</h1>
        <p className="mt-1 text-sm text-muted-foreground">Crie uma nova solicitação de cotação de seguro garantia</p>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                step >= s.num
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {step > s.num ? <Check className="h-4 w-4" /> : s.num}
              </div>
              <span className={cn("text-sm font-medium", step >= s.num ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
              {i < steps.length - 1 && <div className="mx-2 h-px w-12 bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl p-8">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-5">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente (tomador)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Construtora Horizonte Ltda</SelectItem>
                    <SelectItem value="2">Engenharia Vértice S.A.</SelectItem>
                    <SelectItem value="3">Pavimentações BR Ltda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modalidade *</Label>
                <Select value={modalityId} onValueChange={setModalityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupedModalities.map((group) => (
                      <SelectGroup key={group.category}>
                        <SelectLabel>{group.category}</SelectLabel>
                        {group.items.map((m) => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <div className="flex gap-4">
                  {[
                    { value: "new", label: "Nova" },
                    { value: "endorsement", label: "Endosso" },
                    { value: "renewal", label: "Renovação" },
                  ].map((opt) => (
                    <label key={opt.value} className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                      insuranceType === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-input hover:bg-muted"
                    )}>
                      <input type="radio" name="type" value={opt.value} checked={insuranceType === opt.value} onChange={(e) => setInsuranceType(e.target.value)} className="sr-only" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Valor de Cobertura (R$) *</Label>
                <Input
                  type="text"
                  value={insuredAmount}
                  onChange={(e) => setInsuredAmount(e.target.value.replace(/[^\d.,]/g, ""))}
                  placeholder="0,00"
                  className="tabular-nums"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Início da Vigência *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Fim da Vigência *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>Próximo</Button>
            </div>
          </div>
        )}

        {/* Step 2 — Dynamic Form */}
        {step === 2 && selectedModality && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-1 text-base font-semibold">{selectedModality.name}</h2>
              <p className="mb-5 text-sm text-muted-foreground">Preencha os dados específicos da modalidade</p>
              <DynamicFormRenderer
                schema={selectedModality.form_schema as any}
                defaultValues={modalityData}
                onSubmit={(data) => {
                  setModalityData(data);
                  setStep(3);
                }}
                onBack={() => setStep(1)}
                submitLabel="Próximo"
              />
            </div>
          </div>
        )}

        {/* Step 3 — Select Insurers */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-1 text-base font-semibold">Seguradoras</h2>
              <p className="mb-5 text-sm text-muted-foreground">Selecione as seguradoras para enviar a cotação</p>
              <div className="space-y-3">
                {mockClientInsurers.map((ins) => (
                  <label
                    key={ins.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
                      !ins.available && "cursor-not-allowed opacity-50",
                      selectedInsurers.includes(ins.id)
                        ? "border-primary bg-primary/5"
                        : "border-input hover:bg-muted"
                    )}
                  >
                    <Checkbox
                      checked={selectedInsurers.includes(ins.id)}
                      disabled={!ins.available}
                      onCheckedChange={(checked) => {
                        setSelectedInsurers(
                          checked
                            ? [...selectedInsurers, ins.id]
                            : selectedInsurers.filter((i) => i !== ins.id)
                        );
                      }}
                    />
                    <span className="text-sm font-medium">{ins.name}</span>
                    {!ins.available && <span className="ml-auto text-xs text-muted-foreground">CCG pendente</span>}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
              <Button onClick={handleSubmit} disabled={!canProceedStep3}>Criar Cotação</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
