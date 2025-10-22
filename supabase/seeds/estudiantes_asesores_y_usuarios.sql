INSERT INTO public.estudiantes (id_perfil, semestre, jornada, turno)
VALUES
('10b0544f-b235-4c3b-987a-0f9b03b72a8c', 8, 'diurna', '9-11'),
('5b9c9f8f-b1eb-4491-b37c-aebbe1befe5d', 9, 'nocturna', '2-4');

INSERT INTO public.asesores (id_perfil, turno, area)
VALUES
('b6e6e7e9-35ef-4b3a-949f-6ffdd8d23d7b', '4-6', 'laboral'),
('caa9b78b-d8b0-4260-8ee8-177c3c651f97', '2-4', 'civil');

-- USUARIOS (solicitantes)

INSERT INTO public.usuarios (
  id_usuario, nombre_completo, sexo, cedula, telefono, edad, contacto_familiar,
  estado_civil, estrato, direccion, correo, tipo_vivienda,
  situacion_laboral, otros_ingresos, valor_otros_ingresos, concepto_otros_ingresos,
  tiene_contrato, tiene_representado
)
VALUES
(gen_random_uuid(), 'Juan Pérez', 'M', '10023456', '+573004567890', 35, 'María López', 'casado', 3,
 'Calle 10 #20-30', 'juan.perez@example.com', 'propia', 'dependiente', true, 500000, 'ventas ocasionales', true, false),
(gen_random_uuid(), 'Luisa Gómez', 'F', '10023457', '+573115678901', 28, 'Carlos Gómez', 'soltero', 2,
 'Cra 15 #25-40', 'luisa.gomez@example.com', 'arriendo', 'independiente', false, NULL, NULL, true, true),
(gen_random_uuid(), 'Pedro Torres', 'M', '10023458', '+573224567890', 40, 'Ana Torres', 'unión libre', 1,
 'Av 30 #50-60', 'pedro.torres@example.com', 'propia', 'desempleado', false, NULL, NULL, false, false);
