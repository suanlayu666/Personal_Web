import type { PipelineStep } from "../types/content";
import { ScrollFloatText } from "./ScrollFloatText";

type PipelineSectionProps = {
  steps: PipelineStep[];
};

export function PipelineSection({ steps }: PipelineSectionProps) {
  return (
    <section className="section story-panel" id="pipeline" data-section="pipeline" aria-labelledby="pipeline-title">
      <div className="section__inner">
        <p className="eyebrow">路线</p>
        <ScrollFloatText id="pipeline-title">从想法到可运行 Demo</ScrollFloatText>
        <p className="section-lead">我更关心一件事如何真的跑起来：先定义问题，再组织 AI 逻辑，接入真实世界，最后做出可验证的 Demo。</p>
        <div className="pipeline-grid">
          {steps.map((step, index) => (
            <article className="pipeline-step" key={step.title}>
              <span className="pipeline-step__index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <div className="tag-row">
                {step.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
