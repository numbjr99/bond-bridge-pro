import { ReactNode } from "react";
import { FileText, Users, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const defaultIcons: Record<string, ReactNode> = {
  quotations: <FileText className="h-12 w-12 text-muted-foreground/50" strokeWidth={1} />,
  clients: <Users className="h-12 w-12 text-muted-foreground/50" strokeWidth={1} />,
  policies: <Shield className="h-12 w-12 text-muted-foreground/50" strokeWidth={1} />,
  search: <Search className="h-12 w-12 text-muted-foreground/50" strokeWidth={1} />,
};

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-2xl bg-muted/50 p-5">
        {icon || defaultIcons.search}
      </div>
      <h3 className="mb-1.5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
