import type { PublicLink } from "../types/content";
import { ScrollFloatText } from "./ScrollFloatText";

type LinksPanelProps = {
  links: PublicLink[];
  featuredRepos: PublicLink[];
};

export function LinksPanel({ links, featuredRepos }: LinksPanelProps) {
  return (
    <section className="section story-panel" id="links" data-section="links" aria-labelledby="links-title">
      <div className="section__inner section__inner--narrow">
        <p className="eyebrow">联系</p>
        <ScrollFloatText id="links-title">保持连接</ScrollFloatText>
        <p className="section-lead">
          欢迎围绕 AI 原型、嵌入式系统和 Physical AI 交流。
          <br />
          也可以直接查看我的 GitHub 和精选项目仓库。
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
