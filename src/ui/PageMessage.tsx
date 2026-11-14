import { type ReactNode, useId } from "react";

export interface PageMessageProps {
  /** The page's main heading while the message is showing. */
  title: string;
  /** One short sentence beneath the heading. */
  children: ReactNode;
  /** One action: a button or a link. */
  action: ReactNode;
}

/** A short, centred block that takes the place of the page's content: heading, sentence, action. */
export function PageMessage({ title, children, action }: PageMessageProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto flex max-w-sm flex-col items-center gap-2 text-center"
    >
      <h1 id={headingId} className="text-heading font-semibold text-balance wrap-break-word">
        {title}
      </h1>
      <p className="text-body text-text-muted text-pretty">{children}</p>
      <div className="mt-4">{action}</div>
    </section>
  );
}
