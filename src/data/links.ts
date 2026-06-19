import type { Project, PublicLink } from "../types/content";
import { projects } from "./projects";

export const links: PublicLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/suanlayu666",
    kind: "github",
  },
  {
    label: "Email",
    href: "mailto:202521111421@mail.scuec.edu.cn",
    kind: "email",
  },
];

export const featuredRepos: Array<Pick<PublicLink, "label" | "href">> = projects
  .filter((project): project is Project & { repo: string } => Boolean(project.repo))
  .map((project) => ({
    label: project.title,
    href: project.repo,
  }));
