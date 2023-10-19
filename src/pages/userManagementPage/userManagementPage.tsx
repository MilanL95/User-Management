import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faEye,
  faPencilAlt,
  faTrash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes";
import { useEffect, useState } from "react";
import CreateUserModal from "../../features/modals/createUserModal/createUserModal";
import { User } from "../../models/userModel";
import "./userManagementPageStyles.css";
import { GoogleLogout } from "react-google-login";
import UpdateUserModal from "../../features/modals/updateUserModal/updateUserModal";
import ViewUserModal from "../../features/modals/viewUserModal/viewUserModal";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function UserManagementPage() {
  const navigate = useNavigate();
  const clientId =
    "139963990848-8qdqgu1ij9mgl8talnc8bpbuhlu2p787.apps.googleusercontent.com";

  const [showCreateUserModal, setShowCreateUserModal] =
    useState<boolean>(false);
  const [showUpdateUserModal, setShowUpdateUserModal] =
    useState<boolean>(false);
  const [userBeingUpdated, setUserBeingUpdated] = useState<User | null>(null);
  const [showViewUserModal, setShowViewUserModal] = useState<boolean>(false);
  const [userBeingViewed, setUserBeingViewed] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const toggleCreateUserModal = () => {
    setShowCreateUserModal(!showCreateUserModal);
  };

  const handleCreatedUser = (newUser: User) => {
    newUser.online = false;
    newUser.offline = true;
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toggleCreateUserModal();
  };

  const openUpdateUserModal = (user: User) => {
    if (user.online) {
      toast.error(
        "You cannot update the user information while they are online.",
        {
          position: "top-left",
          autoClose: 2500,
          style: {
            fontSize: "14px",
          },
        }
      );
    } else {
      setUserBeingUpdated(user);
      setShowUpdateUserModal(true);
    }
  };

  const openViewUserModal = (user: User) => {
    setUserBeingViewed(user);
    setShowViewUserModal(true);
  };

  const updateUserInList = (updatedUser: User) => {
    const updatedUsersList = users.map((user) => {
      if (user.email === updatedUser.email) {
        return updatedUser;
      }
      return user;
    });

    setUsers(updatedUsersList);
    localStorage.setItem("users", JSON.stringify(updatedUsersList));
  };

  const handleDeleteUser = (indexToDelete: number) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (users[indexToDelete].email === currentUser.email) {
      toast.error("You cannot delete the currently logged-in user.", {
        position: "top-left",
        autoClose: 2500,
        style: {
          fontSize: "14px",
        },
      });
      return;
    }

    const updatedUsers = users.filter((_, index) => index !== indexToDelete);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const updatedUsers = users.map((user) => {
      if (user.email === currentUser.email) {
        return { ...user, online: false, offline: true };
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    navigate(routes.login);
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  return (
    <div className="tableContainer">
      <div className="header">
        <GoogleLogout
          clientId={clientId}
          onLogoutSuccess={handleLogout}
          onFailure={() => console.error("Google Logout Failed")}
          render={(renderProps) => (
            <button
              className="logoutButton"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="logoutIcon" />
            </button>
          )}
        />
        <h1>User Management</h1>
      </div>
      <div className="tableWrapper">
        <button className="leftSideButton" onClick={toggleCreateUserModal}>
          {" "}
          <FontAwesomeIcon icon={faUserPlus} className="userPlusIcon" />
          Create User
        </button>
        <table className="userTable">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Birth Date</th>
              <th>Gender</th>
              <th>Online</th>
              <th>Offline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}.</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.birthDate}</td>
                <td>{user.gender}</td>
                <td>{user.online ? <div className="online"></div> : null}</td>
                <td>{user.offline ? <div className="offline"></div> : null}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faEye}
                    onClick={() => openViewUserModal(user)}
                    className="actionIcon eyeIcon"
                  />
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    onClick={() => openUpdateUserModal(user)}
                    className={`actionIcon pencilIcon ${
                      user.online ? "disabledIcon" : ""
                    }`}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="actionIcon binIcon"
                    onClick={() => handleDeleteUser(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="paginationWrapper">
        <button
          className="paginationArrow"
          onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span>
          Page {currentPage} of {Math.ceil(users.length / usersPerPage)}
        </span>
        <button
          className="paginationArrow"
          onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          disabled={currentPage === Math.ceil(users.length / usersPerPage)}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      {showCreateUserModal && (
        <CreateUserModal
          isOpenCreateUserModal={showCreateUserModal}
          closeCreateUserModal={toggleCreateUserModal}
          onUserRegistered={handleCreatedUser}
          users={users}
        />
      )}
      {showUpdateUserModal && userBeingUpdated && (
        <UpdateUserModal
          isOpenUpdateUserModal={showUpdateUserModal}
          closeUpdateUserModal={() => {
            setShowUpdateUserModal(false);
            setUserBeingUpdated(null);
          }}
          userToUpdate={userBeingUpdated}
          users={users}
          onUserUpdated={updateUserInList}
        />
      )}
      {showViewUserModal && userBeingViewed && (
        <ViewUserModal
          isOpenViewUserModal={showViewUserModal}
          closeViewUserModal={() => {
            setShowViewUserModal(false);
            setUserBeingViewed(null);
          }}
          userToView={userBeingViewed}
        />
      )}
    </div>
  );
}

export default UserManagementPage;
