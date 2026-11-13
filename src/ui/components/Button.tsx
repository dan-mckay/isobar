import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "../cn.ts";

const variants = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  outline: "border-border-strong bg-surface text-text hover:bg-sunken",
} as const;

export type ButtonVariant = keyof typeof variants;

/**
 * The button look as classes. Use it on a link that should look like a button: Base UI's
 * Button enforces button semantics, so links style a real `<a>` instead of rendering through it.
 */
export function buttonStyles(variant: ButtonVariant = "primary", className?: string): string {
  return cn(
    "inline-flex h-control shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-control border border-transparent px-3 font-semibold text-body whitespace-nowrap no-underline transition-colors select-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
    variants[variant],
    className,
  );
}

export interface ButtonProps
  extends Omit<ButtonPrimitive.Props, "className" | "render" | "nativeButton"> {
  variant?: ButtonVariant;
  className?: string;
}

/** shadcn's Button on Base UI, cut down to the two variants Isobar uses and one 32px size. */
export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive data-slot="button" className={buttonStyles(variant, className)} {...props} />
  );
}
