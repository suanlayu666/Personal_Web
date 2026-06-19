import type { SectionState } from "../types/content";

type HudBadgeProps = {
  state: SectionState;
};

export function HudBadge({ state }: HudBadgeProps) {
  return (
    <aside className="hud-badge profile-card" aria-label="Profile and current section">
      <div className="profile-card__behind" aria-hidden="true" />
      <div className="profile-card__shine" aria-hidden="true" />
      <div className="profile-card__top">
        <span className="profile-card__status">ONLINE</span>
        <span className="profile-card__section">{state.hudCode}</span>
      </div>
      <div className="profile-card__title">
        <strong className="profile-card__name">酸辣鱼</strong>
        <span className="profile-card__subtitle">SuanLayu</span>
      </div>
      <div className="profile-card__portrait" aria-hidden="true">
        <span className="profile-card__pixel-mark profile-card__pixel-mark--one" />
        <span className="profile-card__pixel-mark profile-card__pixel-mark--two" />
        <span className="profile-card__pixel-mark profile-card__pixel-mark--three" />
        <div className="profile-card__chip">
          <span className="profile-card__chip-pin profile-card__chip-pin--top" />
          <span className="profile-card__chip-pin profile-card__chip-pin--right" />
          <span className="profile-card__chip-pin profile-card__chip-pin--bottom" />
          <span className="profile-card__chip-pin profile-card__chip-pin--left" />
          <div className="profile-card__glyph">
            <span>SLY</span>
          </div>
          <span className="profile-card__chip-line profile-card__chip-line--one" />
          <span className="profile-card__chip-line profile-card__chip-line--two" />
          <span className="profile-card__chip-label">DATA CORE</span>
        </div>
        <span className="profile-card__sigil profile-card__sigil--left" />
        <span className="profile-card__sigil profile-card__sigil--right" />
        <span className="profile-card__signal profile-card__signal--one" />
        <span className="profile-card__signal profile-card__signal--two" />
      </div>
      <div className="profile-card__footer">
        <span className="profile-card__handle">@suanlayu666</span>
        <p className="profile-card__motto">Build What You Want.</p>
        <p className="profile-card__meta">{state.hudMeta}</p>
      </div>
    </aside>
  );
}
