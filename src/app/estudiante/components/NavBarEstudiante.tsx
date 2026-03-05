import { Navbar as GlobalNavbar } from "@/components/global/Navbar";

export function Navbar() {
  const links = [
    { href: "/estudiante/inicio", label: "Inicio" },
    { href: "/estudiante/mis-casos", label: "Mis Casos" },
    { href: "/centro-ayuda", label: "Centro de Ayuda" },
  ];

  return (
    <GlobalNavbar
      roleName="Estudiante"
      basePath="/estudiante/inicio"
      links={links}
    />
  );
}
