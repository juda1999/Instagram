import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';

interface UserDetailsProps {
    edit: boolean
}

export const UserDetails: React.FC<UserDetailsProps> = ({ edit }) => {
  const {user, setUser} = useContext(AppContext)

  const [username, setUsername] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  // Handle input changes
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission (in edit mode)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email) {
      alert('Please fill out all fields');
      return;
    }

    setUser?.({
      username,
      email,
      profilePic: profilePic ? URL.createObjectURL(profilePic) : user?.profilePic,
    });



    alert('User details saved successfully!');
  };

  return (
    <div>
      <div>
        <div>
          <h4>Profile Picture</h4>
          <div>
            <img
              src={ user?.profilePic || ""}
              alt="Profile"
              style={{ width: '150px', height: '150px', borderRadius: '50%' }}
            />
          </div>
        </div>
        {edit ? (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div>
              <label>Profile Picture:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit">Save</button>
          </form>
        ) : (
          <div>
            <div>
              <strong>Username:</strong> {user?.username}
            </div>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
