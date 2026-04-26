import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "sm" | "md" | "icon";
};

const variants = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  outline: "border bg-background hover:bg-muted",
  ghost: "hover:bg-muted",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  secondary: "bg-muted text-foreground hover:bg-muted/80"
};

const sizes = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
  icon: "h-8 w-8 p-0"
};

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border border-transparent font-medium transition-colors disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "default",
  size = "md",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: ButtonProps["variant"]; size?: ButtonProps["size"] }) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border border-transparent font-medium transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
