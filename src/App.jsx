import { Routes, Route } from "react-router-dom";
import "./App.css";
import AdminLayout from "./layout/AdminLayout";
import { ROUTES } from "./lib/constants";
import Login from "./Features/Auth/Pages/Login";
import Dasboard from "./Features/Auth/Components/Dasboard";
import CreateBot from "./Features/AddUsers/Pages/CreateBot";
import ListProfiles from "./Features/AdminProfiles/Pages/ListProfiles";
import MoneyTree from "./Features/AdminTree/Pages/MoneyTree";
import Withdrawals from "./Features/WithDrawal/Pages/Withdrawals";
import NoteList from "./Features/Note/Pages/NoteList";
import InvestmentList from "./Features/Investement/Pages/InvestmentList";
import InvestWithdrawalList from "./Features/InvestmentWithdrawal/Pages/InvestWithdrawalList";

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dasboard />} />
        <Route path={ROUTES.BOT} element={<CreateBot />} />
        <Route path={ROUTES.ADMIN_TREE} element={<MoneyTree />} />
        <Route path={ROUTES.GETPROFILE} element={<ListProfiles />} />
        <Route path={ROUTES.WITHDRAWAL} element={<Withdrawals />} />
        <Route path={ROUTES.NOTE} element={<NoteList />} />
        <Route path={ROUTES.INVESTMENT} element={<InvestmentList />} />
        <Route path={ROUTES.INVESTMENT_WITHDRAWAL} element={<InvestWithdrawalList />} />
      </Route>
      <Route path={ROUTES.LOGIN} element={<Login />} />
    </Routes>
  );
}

export default App;
