import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import type { ReactNode } from "react";
import { cn } from "../cn.ts";

export interface SwitchProps
  extends Omit<SwitchPrimitive.Root.Props, "className" | "render" | "nativeButton"> {
  className?: string;
  /** Rendered inside the thumb, such as a small icon that reflects the state. */
  children?: ReactNode;
}

/** shadcn's Switch on Base UI, restyled to Isobar's tokens. Always a native `<button>`. */
export function Switch({ className, children, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      nativeButton
      render={<button type="button" />}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border-strong bg-sunken transition-colors data-checked:border-accent data-checked:bg-accent data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none absolute left-0.5 inline-flex size-5 items-center justify-center rounded-full bg-text-muted text-surface transition-transform data-checked:translate-x-5 data-checked:bg-on-accent data-checked:text-accent"
      >
        {children}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}
