import { ScrollFloatText } from "./ScrollFloatText";

export function IntroSection() {
  return (
    <section className="section story-panel" id="intro-detail" data-section="intro" aria-labelledby="intro-title">
      <div className="section__inner section__inner--narrow">
        <p className="eyebrow">简介</p>
        <ScrollFloatText id="intro-title">我正在探索 AI 如何连接真实世界。</ScrollFloatText>
        <p>
          我是酸辣鱼，来自武汉，就读于中南民族大学电子信息工程专业。我关注 AI 应用原型、嵌入式系统、AIoT / Physical
          AI，以及把想法快速做成可运行 Demo 的过程。
        </p>
        <p>
          对我来说，AI 不只停留在屏幕里的回答；它也可以进入传感器、电机、控制系统和真实环境，形成能感知、能反馈、能行动的原型。
        </p>
      </div>
    </section>
  );
}
