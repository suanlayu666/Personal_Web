type ScrollProgressProps = {
  progress: number;
};

export function ScrollProgress({ progress }: ScrollProgressProps) {
  const width = `${Math.min(100, Math.max(0, progress * 100))}%`;

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span style={{ width }} />
    </div>
  );
}
