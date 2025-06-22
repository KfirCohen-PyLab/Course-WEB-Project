
const ProfileView = ({ email, onEdit, onReturn }) => {
  return (
    <>
      <div className="profile-info">
        <div className="info-item">
          <label>Email:</label>
          <span>{email}</span>
        </div>
      </div>

      <div className="button-group">
        <button onClick={onEdit} className="general-button">Edit Profile</button>
        <button onClick={onReturn} className="general-button">Return to Choose</button>
      </div>
    </>
  );
};

export default ProfileView;