import type { SectionId } from "../types/content";

type NavItem = {
  id: Exclude<SectionId, "hero">;
  label: string;
};

type SiteNavProps = {
  sections: readonly NavItem[];
  activeSection: SectionId;
};

export function SiteNav({ sections, activeSection }: SiteNavProps) {
  return (
    <nav className="site-nav site-nav--pill" aria-label="Primary">
      <a className="site-nav__brand" href="#intro" aria-label="Back to intro">
        <span className="site-nav__brand-mark" aria-hidden="true">
          SLY
        </span>
        <span className="site-nav__brand-text">酸辣鱼</span>
      </a>
      <ul className="site-nav__links" role="list">
        {sections.map((section) => {
          const isActive = activeSection === section.id || (activeSection === "hero" && section.id === "intro");

          return (
            <li className="site-nav__item" key={section.id}>
              <a
                className={isActive ? "site-nav__link site-nav__link--active" : "site-nav__link"}
                href={`#${section.id}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="site-nav__link-label">{section.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
