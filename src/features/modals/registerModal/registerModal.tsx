import React, { useEffect, useState } from "react";
import "./registerModalStyles.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { User } from "../../../models/userModel";
import { INIT_REGISTER_DATA } from "../../../models/InitData/formData";

interface RegisterModalProps {
  isOpenRegisterModal: boolean;
  closeRegisterModal: () => void;
  onUserRegistered: (user: User) => void;
  users: User[];
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpenRegisterModal,
  closeRegisterModal,
  onUserRegistered,
  users,
}) => {
  const [showPasswordInRegisterModal, setShowPasswordInRegisterModal] =
    useState<boolean>(false);

  const [registerFormData, setRegisterFormData] = useState(INIT_REGISTER_DATA);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: string;
    password?: string;
  }>({});

  const registerValidate = () => {
    const newErrors: typeof errors = {};
    if (!registerFormData.firstName)
      newErrors.firstName = "First Name is required";
    if (!registerFormData.lastName)
      newErrors.lastName = "Last Name is required";
    if (!registerFormData.email) newErrors.email = "Email is required";
    if (!registerFormData.birthDate)
      newErrors.birthDate = "Birth Date is required";
    if (!registerFormData.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setRegisterFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerValidate()) return;

    const userExists = users.some(
      (user) => user.email === registerFormData.email
    );
    if (userExists) {
      toast.error("User with this email already exists!", {
        position: "top-left",
        autoClose: 2000,
        style: {
          fontSize: "14px",
        },
      });
      return;
    }
    onUserRegistered(registerFormData);
    toast.success("Registration successful! You can now log in.", {
      position: "top-left",
      autoClose: 2000,
      style: {
        fontSize: "14px",
      },
    });
    closeRegisterModal();
  };

  const toggleRegisterPasswordVisibility = () =>
    setShowPasswordInRegisterModal(!showPasswordInRegisterModal);

  useEffect(() => {
    if (!isOpenRegisterModal) {
      setRegisterFormData(INIT_REGISTER_DATA);
      setErrors({});
    }
  }, [isOpenRegisterModal]);

  return isOpenRegisterModal ? (
    <div className="Register-modalOverlay">
      <div className="Register-modalContent">
        <span
          className="Register-closeModalButton"
          onClick={closeRegisterModal}
        >
          <i className="fa fa-times"></i>
        </span>
        <h2 className="titleRegister">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="Register-inputRow">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={registerFormData.firstName}
              onChange={handleRegisterInputChange}
              className={errors.firstName ? "error" : ""}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={registerFormData.lastName}
              onChange={handleRegisterInputChange}
              className={errors.lastName ? "error" : ""}
            />
          </div>

          <div className="Register-inputRow">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={registerFormData.email}
              onChange={handleRegisterInputChange}
              className={errors.email ? "error" : ""}
            />
            <input
              type="text"
              placeholder="mm.dd.yyyy"
              name="birthDate"
              value={registerFormData.birthDate || ""}
              onChange={handleRegisterInputChange}
              pattern="\d{2}\.\d{2}\.\d{4}"
              title="Enter the date in the format mm.dd.yyyy"
              className={errors.birthDate ? "error" : ""}
            />
          </div>
          <div className="Register-inputRow">
            <div className="Register-passwordInputWrapper">
              <input
                type={showPasswordInRegisterModal ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={registerFormData.password}
                onChange={handleRegisterInputChange}
                className={errors.password ? "error" : ""}
              />
              <span
                className={`Register-passwordToggleIcon ${
                  errors.password ? "iconError" : ""
                }`}
                onClick={toggleRegisterPasswordVisibility}
              >
                {showPasswordInRegisterModal ? (
                  <i className="fa fa-eye"></i>
                ) : (
                  <i className="fa fa-eye-slash"></i>
                )}
              </span>
            </div>
          </div>
          <div className="Register-genderRow">
            <p className="Register-gender">Gender:</p>
            <label className="Register-genderLabel">
              <input
                className="Register-genderInput"
                type="radio"
                name="gender"
                value="Male"
                checked={registerFormData.gender === "Male"}
                onChange={handleRegisterInputChange}
              />{" "}
              Male
            </label>
            <label className="Register-genderLabel">
              <input
                className="Register-genderInput"
                type="radio"
                name="gender"
                value="Female"
                checked={registerFormData.gender === "Female"}
                onChange={handleRegisterInputChange}
              />{" "}
              Female
            </label>
          </div>
          <div className="Register-submitRow">
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default RegisterModal;
