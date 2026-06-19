export type ProjectStatus = "featured" | "normal";

export type Project = {
  title: string;
  subtitle: string;
  role: string;
  summary: string;
  tags: string[];
  highlights: string[];
  repo?: string;
  cover?: string;
  status: ProjectStatus;
};

export type PublicLink = {
  label: string;
  href: string;
  kind: "github" | "email" | "repo";
};

export type SectionId = "hero" | "intro" | "works" | "pipeline" | "links";

export type SectionState = {
  id: SectionId;
  navLabel: string;
  hudCode: string;
  hudMeta: string;
};

export type PipelineStep = {
  title: string;
  description: string;
  tags: string[];
};
