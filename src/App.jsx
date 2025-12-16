import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
//admin
//produccio administracion
import Barbotina from './pages/admin/Produccion/Secciones/Barbotina/Barbotina.jsx';
import Atomizado from './pages/admin/Produccion/Secciones/Atomizado/Atomizado.jsx';
import Prensado from './pages/admin/Produccion/Secciones/Prensado/Prensado.jsx';
//
import BeautifulTable from './pages/client/BeautifulTable.jsx';
//layouts
import AdminLayout from './layouts/AdminLayout.jsx';
import ClienteLayout from './layouts/ClienteLayout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="tabla" element={<BeautifulTable />} />
          <Route path="produccion/barbotina" element={<Barbotina />} />
          <Route path="produccion/atomizado" element={<Atomizado />} />
          <Route path="produccion/prensado" element={<Prensado />} />
        </Route>
        <Route path="/cliente" element={<ClienteLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
