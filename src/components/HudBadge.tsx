import type { SectionState } from "../types/content";

type HudBadgeProps = {
  state: SectionState;
};

export function HudBadge({ state }: HudBadgeProps) {
  return (
    <aside className="hud-badge" aria-label="Current section">
      <span className="hud-badge__signal" aria-hidden="true" />
      <strong>{state.hudCode}</strong>
      <span>{state.hudMeta}</span>
    </aside>
  );
}
