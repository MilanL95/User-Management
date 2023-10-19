import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/loginPage/loginPage";
import { routes } from "./routes";
import UserManagementPage from "../pages/userManagementPage/userManagementPage";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.userManagement} element={<UserManagementPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
