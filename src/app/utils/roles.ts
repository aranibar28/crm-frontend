const roles: any = {
  ADMINISTRADOR: ['Administrador', 'Gerente'],
  VENDEDOR: ['Administrador', 'Gerente', 'Vendedor'],
  INSTRUCTOR: ['Administrador', 'Gerente', 'Instructor'],
  EMPLEADOS: ['Administrador', 'Gerente', 'Instructor', 'Vendedor'],
};

export const { ADMINISTRADOR, INSTRUCTOR, VENDEDOR, EMPLEADOS } = roles;
