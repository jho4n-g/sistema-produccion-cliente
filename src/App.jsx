import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
//layouts
import AdminLayout from './layouts/AdminLayout.jsx';
import ClienteLayout from './layouts/ClienteLayout.jsx';

//admin
//produccio administracion
import Barbotina from './pages/admin/Produccion/Secciones/Barbotina/Barbotina.jsx';
import Atomizado from './pages/admin/Produccion/Secciones/Atomizado/Atomizado.jsx';
import Prensado from './pages/admin/Produccion/Secciones/Prensado/Prensado.jsx';
import Esmalte from './pages/admin/Produccion/Secciones/Esmalte/Esmalte.jsx';
import Serigrafia from './pages/admin/Produccion/Secciones/Serigrafia/Serigrafia.jsx';
import Seleccion from './pages/admin/Produccion/Secciones/Seleccion/Seleccion.jsx';

//cliente
import Inicio from './pages/client/Inicio.jsx';
import TabProduccion from './pages/client/Produccion/TabProduccion.jsx';
//

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<div>Error 404</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="produccion/barbotina" element={<Barbotina />} />
          <Route path="produccion/atomizado" element={<Atomizado />} />
          <Route path="produccion/prensado" element={<Prensado />} />
          <Route path="produccion/esmalte" element={<Esmalte />} />
          <Route path="produccion/serigrafia" element={<Serigrafia />} />
          <Route path="produccion/seleccion" element={<Seleccion />} />
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
