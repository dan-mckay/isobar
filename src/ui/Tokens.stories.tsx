import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import tokensCss from "./tokens.css?raw";

/** Reads `--name: value;` declarations from one block of tokens.css, so this story never drifts. */
function declarations(blockStart: string): Map<string, string> {
  const start = tokensCss.indexOf(blockStart);
  const block = tokensCss.slice(start, tokensCss.indexOf("\n}", start));
  return new Map(
    Array.from(block.matchAll(/^\s*--([a-z0-9-]+):\s*([^;]+);/gm), ([, name, value]) => [
      name ?? "",
      value ?? "",
    ]),
  );
}

const light = declarations("@theme static {");
const dark = declarations('[data-theme="dark"] {');

function tokens(prefix: string): string[] {
  return [...light.keys()].filter(
    (name) => name.startsWith(prefix) && !name.endsWith("--line-height"),
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-label font-semibold tracking-label text-text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

function TokenName({ name }: { name: string }) {
  return <code className="font-sans text-body">--{name}</code>;
}

function Colours() {
  return (
    <Section title="Colour">
      <ul className="grid grid-cols-3 gap-4">
        {tokens("color-").map((name) => (
          <li key={name} className="flex items-center gap-3">
            <span
              className="size-10 shrink-0 rounded-control border border-border"
              style={{ background: `var(--${name})` }}
            />
            <span className="flex flex-col">
              <TokenName name={name} />
              <span className="text-label text-text-muted">
                {light.get(name)} / {dark.get(name)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Type() {
  return (
    <Section title="Type · IBM Plex Sans, regular and semibold, tabular numerals">
      <ul className="flex flex-col gap-3">
        {tokens("text-").map((name) => (
          <li key={name} className="flex items-baseline gap-6">
            <span className="w-40 shrink-0">
              <TokenName name={name} />
            </span>
            {["font-regular", "font-semibold"].map((weight) => (
              <span
                key={weight}
                className={weight}
                style={{
                  fontSize: `var(--${name})`,
                  lineHeight: `var(--${name}--line-height)`,
                }}
              >
                Feels like 12° · 1,048 hPa
              </span>
            ))}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Shape() {
  return (
    <Section title="Radius and shadow">
      <ul className="flex flex-wrap gap-6">
        {tokens("radius-").map((name) => (
          <li key={name} className="flex flex-col gap-2">
            <span
              className="size-16 border border-border-strong bg-surface"
              style={{ borderRadius: `var(--${name})` }}
            />
            <TokenName name={name} />
          </li>
        ))}
        {tokens("shadow-").map((name) => (
          <li key={name} className="flex flex-col gap-2">
            <span
              className="size-16 rounded-card bg-surface"
              style={{ boxShadow: `var(--${name})` }}
            />
            <TokenName name={name} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Spacing() {
  return (
    <Section title="Spacing">
      <ul className="flex flex-col gap-3">
        {tokens("spacing-").map((name) => (
          <li key={name} className="flex items-center gap-6">
            <span className="w-40 shrink-0">
              <TokenName name={name} />
            </span>
            <span className="h-2 rounded-full bg-accent-tint" style={{ width: `var(--${name})` }} />
            <span className="text-label text-text-muted">{light.get(name)}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <Colours />
      <Type />
      <Shape />
      <Spacing />
    </div>
  ),
};
