import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: {
    label: string;
    icon?: LucideIcon;
    onClick?: () => void;
    href?: string;
    variant?: "default" | "outline" | "ghost";
  }[];
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const buttonContent = (
              <>
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {action.label}
              </>
            );

            if (action.href) {
              return (
                <Button key={index} variant={action.variant || "default"} asChild>
                  <a href={action.href}>{buttonContent}</a>
                </Button>
              );
            }

            return (
              <Button key={index} variant={action.variant || "default"} onClick={action.onClick}>
                {buttonContent}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
