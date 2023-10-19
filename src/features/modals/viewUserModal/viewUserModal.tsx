import { User } from "../../../models/userModel";
import "./viewUserModalStyles.css";

interface ViewUserModalProps {
  isOpenViewUserModal: boolean;
  closeViewUserModal: () => void;
  userToView: User | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpenViewUserModal,
  closeViewUserModal,
  userToView,
}) => {
  if (!userToView) return null;

  return isOpenViewUserModal ? (
    <div className="viewUser-modalOverlay">
      <div className="viewUser-modalContent">
        <span
          className="viewUser-closeModalButton"
          onClick={closeViewUserModal}
        >
          <i className="fa fa-times"></i>
        </span>
        <h2 className="viewUser-title">User Information</h2>
        <div className="viewUser-info">
          <p>
            <strong>First Name:</strong> {userToView.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {userToView.lastName}
          </p>
          <p>
            <strong>Email:</strong> {userToView.email}
          </p>
          <p>
            <strong>Birth Date:</strong> {userToView.birthDate}
          </p>
          <p>
            <strong>Gender:</strong> {userToView.gender}
          </p>
          <p>
            <strong>Active:</strong> {userToView.online ? "Online " : "Offline"}
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

export default ViewUserModal;
