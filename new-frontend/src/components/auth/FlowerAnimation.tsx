
export function FlowerAnimation({ active }: { active: boolean }) {
  // Show animation only when active
  if (!active) return null;

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <svg
        className="w-16 h-16 animate-floatFlower"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simple flower petals and center */}
        <circle cx="32" cy="32" r="10" fill="#F472B6" />
        {[...Array(6)].map((_, i) => {
          const angle = (i * 360) / 6;
          const rad = (angle * Math.PI) / 180;
          return (
            <ellipse
              key={i}
              cx={32 + Math.cos(rad) * 18}
              cy={32 + Math.sin(rad) * 18}
              rx="6"
              ry="12"
              fill="#F9A8D4"
              transform={`rotate(${angle} 32 32)`}
            />
          );
        })}
      </svg>
    </div>
  );
}
