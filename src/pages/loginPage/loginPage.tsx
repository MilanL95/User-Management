import React, { useEffect, useState } from "react";
import "./loginPageStyles.css";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "react-google-login";
import "font-awesome/css/font-awesome.min.css";
import RegisterModal from "../../features/modals/registerModal/registerModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes";
import { User } from "../../models/userModel";

function LoginPage() {
  const navigate = useNavigate();
  const imagePath = require("../../images/loginPage.jpg");
  const imageGoogle = require("../../images/google.png");
  const clientId =
    "838320551906-kph4kvijq0e67q9opl67qe575t6keb2l.apps.googleusercontent.com";

  const [users, setUsers] = useState<User[]>([]);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

  const toggleLoginPagePasswordVisibility = () =>
    setShowLoginPassword(!showLoginPassword);

  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const handleUserRegistered = (newUser: User) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    closeRegisterModal();
  };

  const handleGoogleSuccess = (response: any) => {
    if (response && response.profileObj) {
      const { email, googleId, givenName, familyName, birthdate } =
        response.profileObj;
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      let user = storedUsers.find((u: any) => u.email === email);

      if (!user) {
        user = {
          email: email,
          password: googleId,
          firstName: givenName,
          lastName: familyName,
          birthDate: birthdate || "",
          online: true,
          offline: false,
        };
        storedUsers.push(user);
      } else {
        user.firstName = givenName;
        user.lastName = familyName;
        user.online = true;
        user.offline = false;
      }

      localStorage.setItem("users", JSON.stringify(storedUsers));
      localStorage.setItem("currentUser", JSON.stringify({ email: email }));
      toast.success("Successfully logged in with Google!", {
        position: "top-left",
        autoClose: 2000,
        style: {
          fontSize: "14px",
        },
      });
      navigate(routes.userManagement);
    }
  };

  const handleGoogleFailure = (response: any) => {
    toast.error("Google login failed. Please try again.", {
      position: "top-left",
      autoClose: 2000,
      style: {
        fontSize: "14px",
      },
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = storedUsers.some(
      (user: { email: string; password: string }) =>
        user.email === loginEmail && user.password === loginPassword
    );

    if (userExists) {
      toast.success("User found! Successful login.", {
        position: "top-left",
        autoClose: 2000,
        style: {
          fontSize: "14px",
        },
      });
      const updatedUsers = storedUsers.map((user: { email: string }) => {
        if (user.email === loginEmail) {
          return { ...user, online: true, offline: false };
        }
        return user;
      });

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ email: loginEmail, password: loginPassword })
      );
      navigate(routes.userManagement);
    } else {
      toast.error(
        "User not found or incorrect password. Please register to create an account.",
        {
          position: "top-left",
          autoClose: 2000,
          style: {
            fontSize: "14px",
          },
        }
      );
    }
  };

  return (
    <div className="mainContainer">
      <div className="innerContainer">
        <div className="imageContainer">
          <img src={imagePath} alt="" />
        </div>
        <div className="rightSection">
          <div className="contentWrapper">
            <div className="welcomeArea">
              <h2 className="title">Welcome!</h2>
              <div className="description">
                Sign in to manage user accounts, edit profiles, and oversee
                account
                <br />
                activities.
              </div>
            </div>
            <form className="loginForm">
              <input
                type="email"
                value={loginEmail}
                placeholder="Email address"
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <div className="passwordWrapper">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  name="loginPassword"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <span
                  className="togglePasswordIcon"
                  onClick={toggleLoginPagePasswordVisibility}
                >
                  {showLoginPassword ? (
                    <i className="fa fa-eye"></i>
                  ) : (
                    <i className="fa fa-eye-slash"></i>
                  )}
                </span>
              </div>
              <div className="actionsWrapper">
                <button type="submit" onClick={handleLogin}>
                  Sign In
                </button>
                <div className="recoverPassword" onClick={openRegisterModal}>
                  Don't have an account? Register now.
                </div>
              </div>
            </form>
            <div className="separator">
              <hr className="line" />
              <span className="text">Or continue with</span>
              <hr className="line" />
            </div>
            <GoogleLogin
              clientId={clientId}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  className="myCustomGoogleButton"
                >
                  <img className="googleIcon" src={imageGoogle} alt="Google" />
                  Sign in with Google
                </button>
              )}
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
              cookiePolicy={"single_host_origin"}
              isSignedIn={true}
            />
            <RegisterModal
              isOpenRegisterModal={showRegisterModal}
              closeRegisterModal={closeRegisterModal}
              onUserRegistered={handleUserRegistered}
              users={users}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
