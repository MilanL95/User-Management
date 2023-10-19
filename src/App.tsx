import LoginPage from "./pages/loginPage/loginPage";
import "./App.css";
import { useEffect } from "react";
import { gapi } from "gapi-script";
import { ToastContainer } from "react-toastify";
import AppRouter from "./router/appRouter";

function App() {
  const clientId =
    "838320551906-kph4kvijq0e67q9opl67qe575t6keb2l.apps.googleusercontent.com";

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client: auth2", start);
  });

  return (
    <div className="App">
      <AppRouter />
      <ToastContainer />
    </div>
  );
}

export default App;
