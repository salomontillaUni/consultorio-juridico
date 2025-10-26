import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Usuario } from 'app/types/database';


interface RegistroUsuarioProps {
  onContinuar: (usuario: Usuario) => void;
  datosIniciales?: Usuario | null;
  onBack: () => void;
}

export function RegistroUsuario({ onContinuar, datosIniciales, onBack }: RegistroUsuarioProps) {
  const [formData, setFormData] = useState<Usuario>(datosIniciales || {
    id_usuario: '',
    nombre_completo: '',
    sexo: '',
    cedula: '',
    telefono: '',
    correo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinuar(formData);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (campo: keyof Usuario, valor: string) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };
  const isFormValid = () => {
    if(!formData) return false;
    return (
      formData.nombre_completo.trim() !== '' &&
      formData.sexo !== '' &&
      formData.cedula.trim() !== '' &&
      formData.telefono.trim() !== '' &&
      formData.correo.trim() !== ''
    );
  };

  return (
    <Card className="md:min-w-3xl mx-auto shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center gap-2">
          <Link
            href={'/pro-apoyo/inicio'}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Registro de Usuario</CardTitle>
        </div>
        <CardDescription>
          Complete la información del usuario que solicita asesoría jurídica.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombreCompleto">Nombre completo</Label>
            <Input
              id="nombreCompleto"
              placeholder="Ingrese su nombre completo"
              value={formData.nombre_completo}
              onChange={(e) => handleChange('nombre_completo', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                value={formData.sexo}
                onValueChange={(value) => handleChange('sexo', value)}
                required
              >
                <SelectTrigger id="tipoDocumento">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                  <SelectItem value="O">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroDocumento">Número de documento</Label>
              <Input
                id="numeroDocumento"
                placeholder="Ej: 12345678"
                value={formData.cedula || ''}
                onChange={(e) => handleChange('cedula', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Ej: +57 300 1234567"
                value={formData.telefono || ''}
                onChange={(e) => handleChange('telefono', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correoElectronico">Correo electrónico</Label>
              <Input
                id="correoElectronico"
                type="email"
                placeholder="ejemplo@correo.com"
                value={formData.correo || ''}
                onChange={(e) => handleChange('correo', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              className="w-sm bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              disabled={!isFormValid()}
            >
              Continuar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
