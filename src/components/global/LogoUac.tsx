import Image from "next/image";
type LogoProps = {
    className?: string;
};
export function Logo({ className = '' }: LogoProps) {
    return (
        <div className={`inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl shadow-blue-500/25 ${className}`}>
            <Image src="/logo_uniautonoma_blanco.svg" alt="Logo" width={90} height={80} />
        </div>
    )
}