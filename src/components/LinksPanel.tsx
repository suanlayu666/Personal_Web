import type { PublicLink } from "../types/content";

type LinksPanelProps = {
  links: PublicLink[];
  featuredRepos: PublicLink[];
};

export function LinksPanel({ links, featuredRepos }: LinksPanelProps) {
  return (
    <section className="section story-panel" id="links" data-section="links" aria-labelledby="links-title">
      <div className="section__inner section__inner--narrow">
        <p className="eyebrow">Links</p>
        <h2 id="links-title">Signal out.</h2>
        <p className="section-lead">
          Open to conversations around AI prototypes, embedded systems, and Physical AI.
          <br />
          欢迎围绕 AI 原型、嵌入式系统与 Physical AI 交流。
        </p>
        <div className="link-group" aria-label="Primary links">
          {links.map((link) => (
            <a className="link-button" key={link.href} href={link.href} target={link.kind === "email" ? undefined : "_blank"} rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
        <div className="repo-list" aria-label="Featured repositories">
          {featuredRepos.map((repo) => (
            <a className="repo-link" key={repo.href} href={repo.href} target="_blank" rel="noreferrer">
              {repo.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
