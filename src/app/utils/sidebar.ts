export const roles = [
  ['Administrador', 'Gerente'],
  ['Vendedor', 'Asesor'],
  ['Administrador', 'Gerente', 'Vendedor'],
  ['Administrador', 'Gerente', 'Asesor'],
];

export const sidebar: any[] = [
  {
    title: 'Dashboard',
    icon: 'uil-home-alt',
    allowRoles: roles[0],
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
  {
    title: 'Usuarios',
    icon: 'uil-user',
    allowRoles: roles[0],
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
    title: 'Dashboard',
    icon: 'uil-home-alt',
    allowRoles: roles[1],
    menu: [
      {
        title: 'Mi cuenta',
        path: '/profile',
      },
    ],
  },
  {
    title: 'Usuarios',
    icon: 'uil-user',
    allowRoles: roles[1],
    menu: [
      {
        title: 'Clientes',
        path: '/customers',
      },
    ],
  },
  {
    title: 'Ecommerce',
    icon: 'uil-store',
    allowRoles: roles[2],
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
    allowRoles: roles[3],
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
