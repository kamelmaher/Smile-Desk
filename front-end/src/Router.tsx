import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import ClinicPage from "./routes/Clinic";
import ClinicsPage from "./routes/ClinicsList";
import LoginPage from "./routes/Login";
import RegisterPage from "./routes/Register";
import DashboardHome from "./components/Dashboard/Home/DashboardHome";
import Appointments from "./components/Dashboard/Appointments/Appointments";
import Settings from "./components/Dashboard/Settings/Settings";
import ManagerDashboard from "./routes/ManagerDashboard";
import Prices from "./routes/Prices";
import FeaturesPage from "./routes/Features";
import Plan from "./components/Dashboard/Plan";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<MainLayout />} path="/">
            <Route index element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<DashboardHome />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="plan" element={<Plan />} />
                <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/clinic/:slug" element={<ClinicPage />} />
            <Route path="/clinics" element={<ClinicsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<Prices />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        </Route>
    ))