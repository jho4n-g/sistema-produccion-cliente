import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export const adminNav = [
  {
    id: 'general',
    title: 'Admin',
    icon: HomeIcon,
    items: [
      { label: 'Gestion usuarios', to: '/admin/dashboard', icon: ChartBarIcon },
      {
        label: 'Gestion roles',
        to: '/admin/tabla',
        icon: ClipboardDocumentListIcon,
      },
    ],
  },
  {
    id: 'controlDocumentos',
    title: 'Control Documentos',
    icon: CalendarDaysIcon,
    items: [
      {
        label: 'Politicas',
        to: '/admin/citas/reservas',
        icon: ClipboardDocumentListIcon,
      },
      {
        label: 'Procedimientos',
        to: '/admin/citas/slots',
        icon: CalendarDaysIcon,
      },
      { label: 'Novedades', to: '/admin/citas/feriados', icon: Cog6ToothIcon },
    ],
  },
  {
    id: 'produccion',
    title: 'Produccion',
    icon: UsersIcon,
    items: [
      {
        label: 'Moliendo barbotina',
        to: '/admin/produccion/barbotina',
        icon: UsersIcon,
      },
      {
        label: 'Atomizado',
        to: '/admin/produccion/atomizado',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Prensado y secado',
        to: '/admin/produccion/prensado',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Linea esmaltacion',
        to: '/admin/produccion/esmalte',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Serigrafica y decorado ',
        to: '/admin/produccion/serigrafia',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Seleccion y embalaje',
        to: '/admin/produccion/seleccion',
        icon: Cog6ToothIcon,
      },
    ],
  },
  {
    id: 'produccionAdministracion',
    title: 'Produccion administracion',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Calidad',
        to: '/admin/produccion/administracion/calidad',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo agua',
        to: '/admin/config/preferencias12af',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo bases',
        to: '/admin/config/preferencia2s',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo ee',
        to: '/admin/config/preferencias3',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo engobe',
        to: '/admin/config/preferencias4',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo esmalte',
        to: '/admin/config/preferencias5',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo gn',
        to: '/admin/config/preferencias6',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice consumo linea',
        to: '/admin/config/preferencias7',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice polvo atomizado',
        to: '/admin/config/preferencias8',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Monitoreo gases combustion',
        to: '/admin/config/preferencias9',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Produccion',
        to: '/admin/config/preferencias10',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Producto no conforme',
        to: '/admin/config/preferencias11',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Reclamo producto no terminado',
        to: '/admin/config/preferencias12',
        icon: Cog6ToothIcon,
      },
    ],
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Disponibilidad por linea',
        to: '/admin/mantenimiento/disponibilidad-linea',
        icon: Cog6ToothIcon,
      },
    ],
  },

  {
    id: 'administracion',
    title: 'Administración',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Horas extra',
        to: '/admin/administracion/horas-extra',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Utilidad',
        to: '/admin/administracion/utilidad',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Generacion de residuos',
        to: '/admin/administracion/generacion-residuos',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice de frecuencia',
        to: '/admin/administracion/indice-frecuencia',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice de severidad',
        to: '/admin/administracion/indice-severidad',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Consultorio dental',
        to: '/admin/administracion/consultorio-dental',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Atencion consultorio',
        to: '/admin/administracion/atencion-consultorio',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Indice de acciones correctivas',
        to: '/admin/administracion/indice-acciones-correctivas',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Donaciones',
        to: '/admin/administracion/donaciones',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Evolucion contado',
        to: '/admin/administracion/evolucion-contado-credito',
        icon: Cog6ToothIcon,
      },
    ],
  },
  {
    id: 'comercializacion',
    title: 'Comercializacion',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Ingreso por venta total',
        to: '/admin/comercializacion/ingreso-venta-total',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Venta total',
        to: '/admin/comercializacion/venta-total',
        icon: Cog6ToothIcon,
      },
      {
        label: 'Precio unitario',
        to: '/admin/comercializacion/precio-unitario',
        icon: Cog6ToothIcon,
      },
    ],
  },
];
