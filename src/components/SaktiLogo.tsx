const SaktiLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`flex items-center justify-center bg-primary-foreground rounded-full ${className}`}
      style={{ width: "48px", height: "48px" }}
    >
      <span
        className="font-bold text-lg tracking-tight"
        style={{ color: "#384E66" }}
      >
        SAKTI
      </span>
    </div>
  );
};

export default SaktiLogo;
