export default function Logo({ className = "w-16 h-16 object-contain" }: { className?: string }) {
  return (
    <img
      src="/manikya-navbar-logo.png"
      alt="Manikya Money Service Pvt Ltd"
      className={className}
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}
