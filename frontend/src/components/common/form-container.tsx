import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormContainerProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export function FormContainer({ children, className, ...props }: FormContainerProps) {
  return (
    <form className={cn("flex flex-col w-full", className)} {...props}>
      {children}
    </form>
  );
}

interface FormHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function FormHeader({ title, description, className }: FormHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

interface FormFieldsProps {
  children: ReactNode;
  className?: string;
}

export function FormFields({ children, className }: FormFieldsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
}

interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn("mt-6 flex justify-end gap-3", className)}>
      {children}
    </div>
  );
}
