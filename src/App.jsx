import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
//layouts
import AdminLayout from './layouts/AdminLayout.jsx';
import ClienteLayout from './layouts/ClienteLayout.jsx';

//admin
//produccio administracion
import TabBarbotinaAdmin from './pages/admin/Produccion/Secciones/Barbotina/TabBarbotinaAdmin.jsx';
import TabAtomizadoAdmin from './pages/admin/Produccion/Secciones/Atomizado/TabAtomizadoAdmin.jsx';
import TabPrensadoAdmin from './pages/admin/Produccion/Secciones/Prensado/TabPrensadoAdmin.jsx';
import TabEsmalteAdmin from './pages/admin/Produccion/Secciones/Esmalte/TabEsmalteAdmin.jsx';
import TabSerigrafiadoAdmin from './pages/admin/Produccion/Secciones/Serigrafia/TabSerigrafiado.jsx';
import TabSeleccion from './pages/admin/Produccion/Secciones/Seleccion/TabSeleccion.jsx';
//administracion
import AtencionConsultorio from './pages/admin/Administracion/AtencionConsultorio/AtencionConsultorio.jsx';
import ConsultorioDental from './pages/admin/Administracion/ConsultaDental/ConsultorioDental.jsx';
import HorasExtra from './pages/admin/Administracion/HorasExtra/HorasExtra.jsx';
import Utilidad from './pages/admin/Administracion/Utilidad/Utilidad.jsx';
import GeneracionResiduos from './pages/admin/Administracion/GeneracionResiduos/GeneracionResiduio.jsx';
import IndiceFrecuencia from './pages/admin/Administracion/IndiceFrecuencia/IndiceFrecuencia.jsx';
import IndiceSeveridad from './pages/admin/Administracion/IndiceSeveridad/IndiceSeveridad.jsx';
import IndiceAccionesCorrectivas from './pages/admin/Administracion/IndiceAccionesCorrectivas/IndiceAccionesCorrectivas.jsx';
import Donaciones from './pages/admin/Administracion/Donaciones/Donaciones.jsx';
import EvolucionContadoContraCredito from './pages/admin/Administracion/EvolucionContado/EvolucionContado.jsx';
//comercializacion
import IngresoVentaTotal from './pages/admin/Comercializacion/IngresoVentaTotal/IngresoVentaTotal.jsx';
import PrecioUnitario from './pages/admin/Comercializacion/PrecioUnitario/PrecioUnitario.jsx';
import VentaTotal from './pages/admin/Comercializacion/VentaTotal/VentaTotal.jsx';
//mantenimiento
import DisponibilidadPorLinea from './pages/admin/Mantenimiento/DisponibilidadLinea/DisponibilidadPorLinea.jsx';
//administracion
import Calidad from './pages/admin/Produccion/Administracion/Calidad/Calidad.jsx';
//cliente
import Inicio from './pages/client/Inicio.jsx';
import TabProduccion from './pages/client/Produccion/TabProduccion.jsx';
//Prueba
import Prueba from './components/Prueba.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<div>Error 404</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/prueba" element={<Prueba />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="produccion/barbotina" element={<TabBarbotinaAdmin />} />
          <Route path="produccion/atomizado" element={<TabAtomizadoAdmin />} />
          <Route path="produccion/prensado" element={<TabPrensadoAdmin />} />
          <Route path="produccion/esmalte" element={<TabEsmalteAdmin />} />
          <Route
            path="produccion/serigrafia"
            element={<TabSerigrafiadoAdmin />}
          />
          <Route path="produccion/seleccion" element={<TabSeleccion />} />
          {/** administracion */}
          <Route
            path="administracion/atencion-consultorio"
            element={<AtencionConsultorio />}
          />
          <Route
            path="administracion/consultorio-dental"
            element={<ConsultorioDental />}
          />
          <Route path="administracion/horas-extra" element={<HorasExtra />} />
          <Route path="administracion/utilidad" element={<Utilidad />} />
          <Route
            path="administracion/generacion-residuos"
            element={<GeneracionResiduos />}
          />
          <Route
            path="administracion/indice-frecuencia"
            element={<IndiceFrecuencia />}
          />
          <Route
            path="administracion/indice-severidad"
            element={<IndiceSeveridad />}
          />
          <Route
            path="administracion/indice-acciones-correctivas"
            element={<IndiceAccionesCorrectivas />}
          />
          <Route path="administracion/donaciones" element={<Donaciones />} />
          <Route
            path="administracion/evolucion-contado-credito"
            element={<EvolucionContadoContraCredito />}
          />
          {/** administracion */}
          <Route
            path="comercializacion/ingreso-venta-total"
            element={<IngresoVentaTotal />}
          />
          <Route
            path="comercializacion/precio-unitario"
            element={<PrecioUnitario />}
          />
          <Route path="comercializacion/venta-total" element={<VentaTotal />} />
          {/** mantenimiento */}
          <Route
            path="mantenimiento/disponibilidad-linea"
            element={<DisponibilidadPorLinea />}
          />
          {/** administracion */}
          <Route
            path="produccion/administracion/calidad"
            element={<Calidad />}
          />
        </Route>
        <Route path="/cliente" element={<ClienteLayout />}>
          <Route index element={<Inicio />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="produccion/secciones" element={<TabProduccion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
