import { UserRegistrationForm } from './components/UserRegistrationForm';
import { GeometricBackground } from "./components/geometricBackground";

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-linear-to-br from-blue-50 via-blue-100 to-blue-200">
      <GeometricBackground />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10 bg-white p-8 rounded-2xl shadow-md">
          <h1 className="mb-4 text-3xl font-bold text-blue-900 tracking-wide">
              Formulario de Entrevista Legal
          </h1>
          <p className="text-blue-700 text-lg max-w-2xl mx-auto">
              Complete todos los campos requeridos para su solicitud de <span className="font-semibold">servicios legales</span>.
          </p>
        </div>
        <UserRegistrationForm />
      </div>
    </div>
  );
}