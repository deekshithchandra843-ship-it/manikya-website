export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <img
      src="/src/imports/image-3.png"
      alt="Manikya Services Pvt Ltd"
      className={className}
    />
  );
}
