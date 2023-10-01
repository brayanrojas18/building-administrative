
const routes = [
  {
    path: '/login',
    component: () => import('layouts/Login.vue'),
  },
  {
    path: '/admin',
    component: () => import('layouts/Admin.vue'),
    children: [
      { path: '', component: () => import('pages/Panel/Panel.vue') }
    ]
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '/dashboard', 
        component: () => import('pages/Dashboard/Index.vue') 
      },
      { 
        path: 'configuracion/condominio', 
        component: () => import('pages/Configuracion/Condominio.vue') 
      },
      { 
        path: 'configuracion/cargas-masivas', 
        component: () => import('pages/Configuracion/Cargas.vue') 
      },
      { 
        path: 'configuracion/mensualidades', 
        component: () => import('pages/Configuracion/Mensualidades.vue') 
      },
      { 
        path: '/usuarios', 
        component: () => import('pages/Usuarios/Listado.vue') 
      },
      { 
        path: '/usuarios/crear', 
        component: () => import('pages/Usuarios/Crear.vue') 
      },
      { 
        path: '/usuarios/crear/:id', 
        component: () => import('pages/Usuarios/Crear.vue') 
      },
      { 
        path: '/usuarios/ver/:id', 
        component: () => import('pages/Usuarios/Ver.vue') 
      },
      { 
        path: '/pagos/generar', 
        component: () => import('pages/Pagos/Generar.vue') 
      },
      { 
        path: '/pagos/listado', 
        component: () => import('pages/Pagos/Pagos.vue') 
      },
      { 
        path: '/pagos/adelantos', 
        component: () => import('pages/Pagos/Adelantos.vue') 
      },
      { 
        path: '/pagos/deudas', 
        component: () => import('pages/Pagos/Deudas.vue') 
      },
      { 
        path: '/pagos/ver/:id', 
        component: () => import('pages/Pagos/Ver.vue') 
      },
      { 
        path: '/reportes', 
        component: () => import('pages/Reportes/Reportes.vue') 
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
