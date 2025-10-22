INSERT INTO public.contratos_laborales (
  id_usuario, tipo_contrato, representante_legal, correo_patrono,
  direccion_empresa, fecha_inicio, fecha_fin, continua, salario_inicial, salario_actual
)
VALUES
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Juan Pérez'),
 'escrito', 'Carlos Mendoza', 'empresa@ejemplo.com', 'Calle 123 #45-67', '2023-01-10', NULL, true, 2500000, 3000000),
((SELECT id_usuario FROM usuarios WHERE nombre_completo = 'Luisa Gómez'),
 'prestacion_servicios', 'Laura Díaz', 'contacto@serviciosya.com', 'Cra 8 #20-15', '2024-02-01', NULL, true, 1800000, 1800000);