import Image from "next/image";

type LogoProps = {
  className?: string;
};

export function Logo({ className = '' }: LogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl shadow-blue-500/25 overflow-hidden ${className}`}
    >
      <Image
        src="/logo_uniautonoma_blanco.svg"
        alt="Logo"
        fill
        className="object-contain p-2"
      />
    </div>
  );
}
