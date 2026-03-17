import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const clientSchema = z.object({
  company_name: z.string().min(1, "Razão social obrigatória"),
  trade_name: z.string().optional(),
  cnpj: z.string().min(14, "CNPJ inválido"),
  autonomy_level: z.string().optional(),
  address_zipcode: z.string().optional(),
  address_street: z.string().optional(),
  address_number: z.string().optional(),
  address_complement: z.string().optional(),
  address_neighborhood: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  contact_email: z.string().email("E-mail inválido"),
  contact_phone: z.string().optional(),
  contact_person: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

export default function ClientFormPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = async (data: ClientForm) => {
    // Mock save
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Cliente cadastrado com sucesso!");
    navigate("/clients");
  };

  return (
    <div>
      <div className="border-b border-border bg-card px-8 py-6">
        <button onClick={() => navigate("/clients")} className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Clientes
        </button>
        <h1 className="text-2xl font-bold">Novo Cliente</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cadastre um novo tomador de seguro garantia</p>
      </div>

      <div className="max-w-3xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Data */}
          <section>
            <h2 className="mb-4 text-base font-semibold">Dados da Empresa</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Razão Social *</Label>
                <Input {...register("company_name")} placeholder="Razão social completa" />
                {errors.company_name && <p className="text-xs text-destructive">{errors.company_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Nome Fantasia</Label>
                <Input {...register("trade_name")} placeholder="Nome fantasia" />
              </div>
              <div className="space-y-2">
                <Label>CNPJ *</Label>
                <Input {...register("cnpj")} placeholder="XX.XXX.XXX/XXXX-XX" className="tabular-nums" />
                {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Nível de Autonomia</Label>
                <Select onValueChange={(v) => setValue("autonomy_level", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="request_only">Somente Solicitação</SelectItem>
                    <SelectItem value="full">Total</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Address */}
          <section>
            <h2 className="mb-4 text-base font-semibold">Endereço</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>CEP</Label>
                <Input {...register("address_zipcode")} placeholder="XXXXX-XXX" className="tabular-nums" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Rua</Label>
                <Input {...register("address_street")} placeholder="Logradouro" />
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input {...register("address_number")} placeholder="Nº" />
              </div>
              <div className="space-y-2">
                <Label>Complemento</Label>
                <Input {...register("address_complement")} placeholder="Sala, andar..." />
              </div>
              <div className="space-y-2">
                <Label>Bairro</Label>
                <Input {...register("address_neighborhood")} placeholder="Bairro" />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input {...register("address_city")} placeholder="Cidade" />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input {...register("address_state")} placeholder="UF" maxLength={2} />
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-4 text-base font-semibold">Contato</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input {...register("contact_email")} type="email" placeholder="email@empresa.com.br" />
                {errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input {...register("contact_phone")} placeholder="(XX) XXXXX-XXXX" className="tabular-nums" />
              </div>
              <div className="space-y-2">
                <Label>Responsável</Label>
                <Input {...register("contact_person")} placeholder="Nome do responsável" />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 border-t border-border pt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/clients")}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Cliente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
