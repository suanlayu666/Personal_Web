import type { SectionState } from "../types/content";

type HudBadgeProps = {
  state: SectionState;
};

export function HudBadge({ state }: HudBadgeProps) {
  return (
    <aside className="hud-badge profile-hud" aria-label="Profile and current section">
      <div className="profile-hud__glow" aria-hidden="true" />
      <div className="profile-hud__scan" aria-hidden="true" />
      <div className="profile-hud__avatar" aria-hidden="true">
        <span>SLY</span>
      </div>
      <div className="profile-hud__body">
        <div className="profile-hud__topline">
          <span className="profile-hud__status">ONLINE</span>
          <span className="profile-hud__section">{state.hudCode}</span>
        </div>
        <strong className="profile-hud__name">酸辣鱼</strong>
        <span className="profile-hud__handle">@suanlayu666</span>
        <p className="profile-hud__motto">Build What You Want.</p>
        <p className="profile-hud__meta">{state.hudMeta}</p>
      </div>
    </aside>
  );
}
