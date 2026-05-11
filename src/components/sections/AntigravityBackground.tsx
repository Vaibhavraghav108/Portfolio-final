"use client";

export default function AntigravityBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-20 overflow-hidden bg-[#0a0a0f]">
      {/* Background Image: Milky Way */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: "url('https://www.nhm.ac.uk/content/dam/nhm-www/discover/what-is-space/what-is-space-milky-way-full-width.jpg.thumb.1920.1920.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Optional dark gradient overlay to ensure terminal readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 mix-blend-multiply" />
    </div>
  );
}
