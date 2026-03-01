export const Spotlight = ({ className = '', color = 'rgba(99,102,241,0.25)', size = 700 }) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle at center, ${color}, transparent 60%)`,
  };

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute blur-3xl ${className}`}
      style={style}
    />
  );
};


