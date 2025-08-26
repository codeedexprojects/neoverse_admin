import { Routes, Route } from "react-router-dom";
import "./App.css";
import AdminLayout from "./layout/AdminLayout";
import { ROUTES } from "./lib/constants";
import Login from "./Features/Auth/Pages/Login";
import Dasboard from "./Features/Auth/Components/Dasboard";
import CreateBot from "./Features/AddUsers/Pages/CreateBot";

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dasboard />} />
        <Route path={ROUTES.BOT} element={<CreateBot />} />
        <Route path={ROUTES.ADMIN_TREE} element={<CreateBot />} />
      </Route>
      <Route path={ROUTES.LOGIN} element={<Login />} />
    </Routes>
  );
}

export default App;
