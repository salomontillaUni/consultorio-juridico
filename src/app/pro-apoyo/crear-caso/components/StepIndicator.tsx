import { FileText, Users, ClipboardCheck, Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: 'registro' | 'asignacion' | 'resumen';
}

const steps = [
  {
    id: 'registro',
    title: 'Registro',
    description: 'Información del profesional',
    icon: FileText,
  },
  {
    id: 'asignacion',
    title: 'Asignación',
    description: 'Estudiante y asesor',
    icon: Users,
  },
  {
    id: 'resumen',
    title: 'Resumen',
    description: 'Confirmación del caso',
    icon: ClipboardCheck,
  },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        {/* Línea de progreso de fondo */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-slate-200 rounded-full" 
             style={{ left: '64px', right: '64px' }} />
        
        {/* Línea de progreso activa */}
        <div 
          className="absolute top-12 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
          style={{ 
            left: '64px',
            width: currentIndex === 0 ? '0%' : currentIndex === 1 ? 'calc(50% - 64px)' : 'calc(100% - 128px)'
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between items-start">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1 relative">
                {/* Círculo del paso */}
                <div
                  className={`
                    w-24 h-24 rounded-full flex items-center justify-center relative z-10 
                    transition-all duration-300 shadow-lg
                    ${isCompleted ? 'bg-green-500 scale-100' : ''}
                    ${isCurrent ? 'bg-blue-600 scale-110' : ''}
                    ${isPending ? 'bg-white border-4 border-slate-200 scale-90' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-10 w-10 text-white" strokeWidth={3} />
                  ) : (
                    <Icon 
                      className={`
                        h-10 w-10 transition-colors
                        ${isCurrent ? 'text-white' : 'text-slate-400'}
                      `}
                    />
                  )}
                </div>

                {/* Información del paso */}
                <div className="mt-4 text-center max-w-[140px]">
                  <h3 
                    className={`
                      transition-colors mb-1
                      ${isCurrent ? 'text-blue-600' : 'text-slate-700'}
                      ${isCompleted ? 'text-green-600' : ''}
                    `}
                  >
                    {step.title}
                  </h3>
                  <p 
                    className={`
                      text-sm transition-colors
                      ${isCurrent || isCompleted ? 'text-slate-600' : 'text-slate-400'}
                    `}
                  >
                    {step.description}
                  </p>
                </div>

               
                
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
