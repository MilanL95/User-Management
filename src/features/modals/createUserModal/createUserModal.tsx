import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./createUserModalStyles.css";
import { User } from "../../../models/userModel";
import { INIT_CREATE_USER_DATA } from "../../../models/InitData/formData";

interface CreateUserModalProps {
  isOpenCreateUserModal: boolean;
  closeCreateUserModal: () => void;
  onUserRegistered: (user: User) => void;
  users: User[];
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpenCreateUserModal,
  closeCreateUserModal,
  onUserRegistered,
  users,
}) => {
  const [showPasswordInCreateUserModal, setShowPasswordInCreateUserModal] =
    useState<boolean>(false);
  const [formCreateUserData, setFormCreateUserData] = useState<User>(
    INIT_CREATE_USER_DATA
  );
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: string;
    password?: string;
  }>({});

  const createUserValidate = () => {
    const newErrors: typeof errors = {};
    if (!formCreateUserData.firstName)
      newErrors.firstName = "First Name is required";
    if (!formCreateUserData.lastName)
      newErrors.lastName = "Last Name is required";
    if (!formCreateUserData.email) newErrors.email = "Email is required";
    if (!formCreateUserData.birthDate)
      newErrors.birthDate = "Birth Date is required";
    if (!formCreateUserData.password)
      newErrors.password = "Password is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormCreateUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleSaveUserInformation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!createUserValidate()) return;

    const userExists = users.some(
      (user) => user.email === formCreateUserData.email
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
    onUserRegistered(formCreateUserData);
    toast.success("User creation successful!", {
      position: "top-left",
      autoClose: 2000,
      style: {
        fontSize: "14px",
      },
    });
    closeCreateUserModal();
  };

  const toggleCreateUserPasswordVisibility = () =>
    setShowPasswordInCreateUserModal(!showPasswordInCreateUserModal);

  useEffect(() => {
    if (!isOpenCreateUserModal) {
      setFormCreateUserData(INIT_CREATE_USER_DATA);
      setErrors({});
    }
  }, [isOpenCreateUserModal]);

  return isOpenCreateUserModal ? (
    <div className="createUser-modalOverlay">
      <div className="createUser-modalContent">
        <span
          className="createUser-closeModalButton"
          onClick={closeCreateUserModal}
        >
          <i className="fa fa-times"></i>
        </span>
        <h2 className="createUser-title">Create User Information</h2>
        <form onSubmit={handleSaveUserInformation}>
          <div className="createUser-inputRow">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formCreateUserData.firstName}
              onChange={handleCreateModalInputChange}
              className={errors.firstName ? "createUser-error" : ""}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formCreateUserData.lastName}
              onChange={handleCreateModalInputChange}
              className={errors.lastName ? "createUser-error" : ""}
            />
          </div>

          <div className="createUser-inputRow">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formCreateUserData.email}
              onChange={handleCreateModalInputChange}
              className={errors.email ? "createUser-error" : ""}
            />
            <input
              type="text"
              placeholder="mm.dd.yyyy"
              name="birthDate"
              value={formCreateUserData.birthDate || ""}
              onChange={handleCreateModalInputChange}
              pattern="\d{2}\.\d{2}\.\d{4}"
              title="Enter the date in the format mm.dd.yyyy"
              className={errors.birthDate ? "error" : ""}
            />
          </div>
          <div className="createUser-inputRow">
            <div className="createUser-passwordInputWrapper">
              <input
                type={showPasswordInCreateUserModal ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formCreateUserData.password}
                onChange={handleCreateModalInputChange}
                className={errors.password ? "error" : ""}
              />
              <span
                className={`createUser-passwordToggleIcon ${
                  errors.password ? "iconError" : ""
                }`}
                onClick={toggleCreateUserPasswordVisibility}
              >
                {showPasswordInCreateUserModal ? (
                  <i className="fa fa-eye"></i>
                ) : (
                  <i className="fa fa-eye-slash"></i>
                )}
              </span>
            </div>
          </div>
          <div className="createUser-genderRow">
            <p className="createUser-gender">Gender:</p>
            <label className="createUser-genderLabel">
              <input
                className="createUser-genderInput"
                type="radio"
                name="gender"
                value="Male"
                checked={formCreateUserData.gender === "Male"}
                onChange={handleCreateModalInputChange}
              />{" "}
              Male
            </label>
            <label className="createUser-genderLabel">
              <input
                className="createUser-genderInput"
                type="radio"
                name="gender"
                value="Female"
                checked={formCreateUserData.gender === "Female"}
                onChange={handleCreateModalInputChange}
              />{" "}
              Female
            </label>
          </div>
          <div className="createUser-submitRow">
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default CreateUserModal;
