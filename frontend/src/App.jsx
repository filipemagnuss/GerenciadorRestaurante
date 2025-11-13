import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import CreateAdmin from "./pages/CreateAdmin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CreateMenu from "./pages/CreateMenu.jsx";
import Menu from "./pages/Menu.jsx";
import AtendenteMenu from "./pages/AtendenteMenu.jsx";
import ManageMenu from "./pages/ManageMenu.jsx";
import EditProduct from "./pages/EditProduct.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CreateAdmin />} />
        <Route path="/atendente/menu" element={<AtendenteMenu />} />
        <Route path="/menu" element={<Menu />} />
        
        
        <Route element={<PrivateRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create-product" element={<CreateMenu />} />
          <Route path="/admin/menu" element={<ManageMenu />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        </Route>       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
