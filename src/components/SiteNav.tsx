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
    <nav className="site-nav" aria-label="Primary">
      <a className="site-nav__brand" href="#intro" aria-label="Back to intro">
        酸辣鱼
      </a>
      <div className="site-nav__links">
        {sections.map((section) => (
          <a
            key={section.id}
            className={activeSection === section.id ? "site-nav__link site-nav__link--active" : "site-nav__link"}
            href={`#${section.id}`}
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
