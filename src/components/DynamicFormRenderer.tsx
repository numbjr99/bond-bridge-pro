import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface JsonSchemaProperty {
  type: string;
  title?: string;
  enum?: (string | number)[];
  format?: string;
  description?: string;
}

interface JsonSchema {
  type: string;
  required?: string[];
  properties: Record<string, JsonSchemaProperty>;
}

interface DynamicFormRendererProps {
  schema: JsonSchema;
  onSubmit: (data: Record<string, unknown>) => void;
  onBack?: () => void;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string;
}

export default function DynamicFormRenderer({
  schema,
  onSubmit,
  onBack,
  defaultValues = {},
  submitLabel = "Próximo",
}: DynamicFormRendererProps) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
  });

  const requiredFields = new Set(schema.required || []);

  const renderField = (key: string, prop: JsonSchemaProperty) => {
    const isRequired = requiredFields.has(key);
    const label = prop.title || key;

    if (prop.enum) {
      return (
        <div key={key} className="space-y-2">
          <Label className="text-sm font-medium">
            {label}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
          </Label>
          <Controller
            name={key}
            control={control}
            rules={{ required: isRequired ? "Campo obrigatório" : false }}
            render={({ field }) => (
              <Select value={field.value as string} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {prop.enum!.map((opt) => (
                    <SelectItem key={String(opt)} value={String(opt)}>
                      {String(opt).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors[key] && <p className="text-xs text-destructive">{errors[key]?.message as string}</p>}
        </div>
      );
    }

    if (prop.format === "date" || prop.type === "string" && key.includes("date")) {
      return (
        <div key={key} className="space-y-2">
          <Label className="text-sm font-medium">
            {label}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
          </Label>
          <Controller
            name={key}
            control={control}
            rules={{ required: isRequired ? "Campo obrigatório" : false }}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(new Date(field.value as string), "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value as string) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors[key] && <p className="text-xs text-destructive">{errors[key]?.message as string}</p>}
        </div>
      );
    }

    if (prop.type === "boolean") {
      return (
        <div key={key} className="flex items-center justify-between rounded-lg border border-input p-4">
          <Label className="text-sm font-medium">{label}</Label>
          <Controller
            name={key}
            control={control}
            render={({ field }) => (
              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
      );
    }

    if (prop.type === "number" || prop.type === "integer") {
      return (
        <div key={key} className="space-y-2">
          <Label className="text-sm font-medium">
            {label}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
          </Label>
          <Controller
            name={key}
            control={control}
            rules={{ required: isRequired ? "Campo obrigatório" : false }}
            render={({ field }) => (
              <Input
                type="number"
                placeholder={label}
                value={(field.value as number) ?? ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                className="tabular-nums"
              />
            )}
          />
          {errors[key] && <p className="text-xs text-destructive">{errors[key]?.message as string}</p>}
        </div>
      );
    }

    // Default: string input
    return (
      <div key={key} className="space-y-2">
        <Label className="text-sm font-medium">
          {label}
          {isRequired && <span className="ml-1 text-destructive">*</span>}
        </Label>
        <Controller
          name={key}
          control={control}
          rules={{ required: isRequired ? "Campo obrigatório" : false }}
          render={({ field }) => (
            <Input placeholder={label} {...field} value={(field.value as string) || ""} />
          )}
        />
        {errors[key] && <p className="text-xs text-destructive">{errors[key]?.message as string}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {Object.entries(schema.properties).map(([key, prop]) => renderField(key, prop))}
      </div>
      <div className="flex justify-between pt-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
        )}
        <Button type="submit" className={!onBack ? "ml-auto" : ""}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
