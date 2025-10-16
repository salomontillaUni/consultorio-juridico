import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';

interface Usuario {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  correoElectronico: string;
}

interface RegistroUsuarioProps {
  onContinuar: (usuario: Usuario) => void;
  datosIniciales?: Usuario | null;
}

export function RegistroUsuario({ onContinuar, datosIniciales }: RegistroUsuarioProps) {
  const [formData, setFormData] = useState<Usuario>(datosIniciales || {
    nombreCompleto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    telefono: '',
    correoElectronico: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinuar(formData);
  };

  const handleChange = (campo: keyof Usuario, valor: string) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardHeader className="space-y-1 pb-6">
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
              value={formData.nombreCompleto}
              onChange={(e) => handleChange('nombreCompleto', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tipoDocumento">Tipo de documento</Label>
              <Select 
                value={formData.tipoDocumento}
                onValueChange={(value) => handleChange('tipoDocumento', value)}
                required
              >
                <SelectTrigger id="tipoDocumento">
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cedula">Cédula de ciudadanía</SelectItem>
                  <SelectItem value="pasaporte">Pasaporte</SelectItem>
                  <SelectItem value="ce">Cedula de extranjería</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroDocumento">Número de documento</Label>
              <Input
                id="numeroDocumento"
                placeholder="Ej: 12345678"
                value={formData.numeroDocumento}
                onChange={(e) => handleChange('numeroDocumento', e.target.value)}
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
                value={formData.telefono}
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
                value={formData.correoElectronico}
                onChange={(e) => handleChange('correoElectronico', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full"
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
