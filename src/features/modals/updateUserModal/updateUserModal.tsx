import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { INIT_UPDATE_USER_DATA } from "../../../models/InitData/formData";
import { User } from "../../../models/userModel";
import "./updateUserModalStyles.css";

interface UpdateUserModalProps {
  isOpenUpdateUserModal: boolean;
  closeUpdateUserModal: () => void;
  onUserUpdated: (updatedUser: User) => void;
  userToUpdate: User | null;
  users: User[];
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  isOpenUpdateUserModal,
  closeUpdateUserModal,
  userToUpdate,
  onUserUpdated,
}) => {
  const [showPasswordInUpdateUserModal, setShowPasswordInUpdateUserModal] =
    useState<boolean>(false);
  const [formUpdateUserData, setFormUpdateUserData] = useState<User>(
    INIT_UPDATE_USER_DATA
  );
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: string;
    password?: string;
  }>({});

  const updateUserValidate = () => {
    const newErrors: typeof errors = {};
    if (!formUpdateUserData.firstName)
      newErrors.firstName = "First Name is required";
    if (!formUpdateUserData.lastName)
      newErrors.lastName = "Last Name is required";
    if (!formUpdateUserData.email) newErrors.email = "Email is required";
    if (!formUpdateUserData.birthDate)
      newErrors.birthDate = "Birth Date is required";
    if (!formUpdateUserData.password)
      newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateModalInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormUpdateUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleUpdateUserInformation = (e: any) => {
    e.preventDefault();

    if (!updateUserValidate()) return;

    onUserUpdated(formUpdateUserData);
    toast.success("User update successful!", {
      position: "top-left",
      autoClose: 2000,
      style: {
        fontSize: "14px",
      },
    });
    closeUpdateUserModal();
  };

  const toggleCreateUserPasswordVisibility = () =>
    setShowPasswordInUpdateUserModal(!showPasswordInUpdateUserModal);

  useEffect(() => {
    if (userToUpdate) {
      setFormUpdateUserData(userToUpdate);
    }
  }, [userToUpdate]);

  return isOpenUpdateUserModal ? (
    <div className="updateUser-modalOverlay">
      <div className="updateUser-modalContent">
        <span
          className="updateUser-closeModalButton"
          onClick={closeUpdateUserModal}
        >
          <i className="fa fa-times"></i>
        </span>
        <h2 className="updateUser-title">Update User Information</h2>
        <form onSubmit={handleUpdateUserInformation}>
          <div className="updateUser-inputRow">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formUpdateUserData.firstName}
              onChange={handleUpdateModalInputChange}
              className={errors.firstName ? "updateUser-error" : ""}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formUpdateUserData.lastName}
              onChange={handleUpdateModalInputChange}
              className={errors.lastName ? "updateUser-error" : ""}
            />
          </div>

          <div className="updateUser-inputRow">
            <input
              type="email"
              disabled
              placeholder="Email"
              name="email"
              value={formUpdateUserData.email}
              onChange={handleUpdateModalInputChange}
              className={errors.email ? "updateUser-error" : ""}
            />
            <input
              type="text"
              placeholder="mm.dd.yyyy"
              name="birthDate"
              value={formUpdateUserData.birthDate || ""}
              onChange={handleUpdateModalInputChange}
              pattern="\d{2}\.\d{2}\.\d{4}"
              title="Enter the date in the format mm.dd.yyyy"
              className={errors.birthDate ? "error" : ""}
            />
          </div>
          <div className="updateUser-inputRow">
            <div className="updateUser-passwordInputWrapper">
              <input
                type={showPasswordInUpdateUserModal ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formUpdateUserData.password}
                onChange={handleUpdateModalInputChange}
                className={errors.password ? "error" : ""}
              />
              <span
                className={`Register-passwordToggleIcon ${
                  errors.password ? "iconError" : ""
                }`}
                onClick={toggleCreateUserPasswordVisibility}
              >
                {showPasswordInUpdateUserModal ? (
                  <i className="fa fa-eye"></i>
                ) : (
                  <i className="fa fa-eye-slash"></i>
                )}
              </span>
            </div>
          </div>
          <div className="updateUser-genderRow">
            <p className="updateUser-gender">Gender:</p>
            <label className="updateUser-genderLabel">
              <input
                className="updateUser-genderInput"
                type="radio"
                name="gender"
                value="Male"
                checked={formUpdateUserData.gender === "Male"}
                onChange={handleUpdateModalInputChange}
              />{" "}
              Male
            </label>
            <label className="updateUser-genderLabel">
              <input
                className="updateUser-genderInput"
                type="radio"
                name="gender"
                value="Female"
                checked={formUpdateUserData.gender === "Female"}
                onChange={handleUpdateModalInputChange}
              />{" "}
              Female
            </label>
          </div>
          <div className="updateUser-submitRow">
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default UpdateUserModal;
