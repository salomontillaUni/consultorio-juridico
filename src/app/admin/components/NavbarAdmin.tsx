import { Navbar as GlobalNavbar } from "@/components/global/Navbar";

export function Navbar() {
  const links = [
    { href: "/admin/inicio", label: "Inicio" },
    { href: "/admin/estudiantes", label: "Estudiantes" },
    { href: "/admin/asesores", label: "Asesores" },
    { href: "/admin/proapoyo", label: "Proapoyo" },
  ];

  return (
    <GlobalNavbar roleName="Admin" basePath="/admin/inicio" links={links} />
  );
}
