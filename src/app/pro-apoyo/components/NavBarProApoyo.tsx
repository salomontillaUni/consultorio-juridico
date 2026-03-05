import { Navbar as GlobalNavbar } from "@/components/global/Navbar";

export function Navbar() {
  const links = [
    { href: "/pro-apoyo/inicio", label: "Inicio" },
    { href: "/pro-apoyo/gestionar-caso", label: "Casos" },
    { href: "/pro-apoyo/crear-caso", label: "Crear Caso" },
    { href: "/centro-ayuda", label: "Centro de Ayuda" },
  ];

  return (
    <GlobalNavbar
      roleName="Profesional de Apoyo"
      basePath="/pro-apoyo/inicio"
      links={links}
    />
  );
}
