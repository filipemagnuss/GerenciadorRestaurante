import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav>
      <span>Sistema de Pedidos</span>
      {token && <button onClick={logout}>Sair</button>}
    </nav>
  );
}
