function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0A0F0D]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,197,94,0.25),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(56,189,248,0.15),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_85%,rgba(74,222,128,0.2),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_80%,rgba(245,165,36,0.1),transparent_45%)]" />

      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-forest-600/30 blur-3xl animate-float-slow" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-lime-500/15 blur-3xl animate-float-slower" />
      <div className="absolute top-[25%] right-[15%] w-[30vw] h-[30vw] rounded-full bg-sky-500/10 blur-3xl animate-float" />
      <div className="absolute bottom-[10%] left-[20%] w-[25vw] h-[25vw] rounded-full bg-emerald-400/15 blur-3xl animate-float-slow" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

export default AnimatedBackground;