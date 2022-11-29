const roles: any = {
  ADMINISTRADOR: ['Administrador'],
  VENDEDOR: ['Administrador', 'Vendedor'],
  INSTRUCTOR: ['Administrador', 'Instructor'],
  EMPLEADOS: ['Administrador', 'Instructor', 'Vendedor'],
};

export const { ADMINISTRADOR, VENDEDOR, INSTRUCTOR, EMPLEADOS } = roles;
