const roles: any = {
  ADMINISTRADOR: ['Administrador', 'Gerente'],
  VENDEDOR: ['Administrador', 'Gerente', 'Vendedor'],
  INSTRUCTOR: ['Administrador', 'Gerente', 'Instructor'],
  EMPLEADOS: ['Administrador', 'Gerente', 'Instructor', 'Vendedor'],
};

export const { ADMINISTRADOR, INSTRUCTOR, VENDEDOR, EMPLEADOS } = roles;

export const sidebar: any[] = [
  {
    title: 'Dashboard',
    icon: 'uil-home-alt',
    allowRoles: EMPLEADOS,
    menu: [
      {
        title: 'Mi cuenta',
        path: '/profile',
      },
      {
        title: 'Configuración',
        path: '/config',
      },
      {
        title: 'Rendimiento',
        path: '/performance',
      },
    ],
  },
  /*  {
    title: 'Empresa',
    icon: 'uil-home-alt',
    allowRoles: ['NONE'],
    menu: [
      {
        title: 'Configuración',
        path: '/config',
      },
      {
        title: 'Rendimiento Mensual',
        path: '/performance',
      },
      {
        title: 'Rendimiento Anual',
        path: '/performance',
      },
    ],
  }, */
  {
    title: 'Usuarios',
    icon: 'uil-user',
    allowRoles: ADMINISTRADOR,
    menu: [
      {
        title: 'Empleados',
        path: '/employees',
      },
      {
        title: 'Clientes',
        path: '/customers',
      },
    ],
  },
  {
    title: 'Ecommerce',
    icon: 'uil-store',
    allowRoles: VENDEDOR,
    menu: [
      {
        title: 'Categorias',
        path: '/categories',
      },
      {
        title: 'Productos',
        path: '/products',
      },
      {
        title: 'Inventario',
        path: '/inventories',
      },
      {
        title: 'Ventas',
        path: '/sales',
      },
    ],
  },
  {
    title: 'Matrículas',
    icon: 'uil-books',
    allowRoles: INSTRUCTOR,
    menu: [
      {
        title: 'Cursos',
        path: '/courses',
      },
      {
        title: 'Inscripciones',
        path: '/inscriptions',
      },
    ],
  },
];
