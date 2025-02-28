import React, { useContext, useMemo, useState } from 'react';
import { AppContext, Post, User } from '../../App';
import axios from 'axios';
import { PostList } from '../PostList';
import "./UserDetails.css";

interface UserDetailsProps {
    userId: string
}

export const UserDetails: React.FC<UserDetailsProps> = ({ userId }) => {
  const {user, setUser} = useContext(AppContext)
  const [currentUser, setCurrentUser] = useState<User>();
  const [currentUserPosts, setCurrentUserPosts] =  useState<Post[]>([])

  const editMode =
    useMemo(
      () => userId === user?._id,
    [userId, user])

  async function handleUserDetails() {
    try {
      const response = await axios.post("http://localhost:3001/auth/userInfo", { userId })
      setCurrentUser(response.data.user)
    } catch (error) {
    }
  }

  async function handleUserPosts() {
    try {
      const response = await axios.get(`http://localhost:3001/post?uploader={${userId}}`)
      setCurrentUserPosts(response.data.posts)
    } catch (error) {
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUser(user => ({ ...user, username: e.target.value}));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUser(user => ({ ...user, email: e.target.value}));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setCurrentUser(user => ({ ...user, profilePic: "file"}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.username || !currentUser?.email) {
      alert('Please fill out all fields');
      return;
    }

    // TODO: update user in DB
    setUser?.(currentUser);
  };

  return (
    <div className='user-details-container'>
      <div>
        <div className='picture'>
          <h4>Profile Picture</h4>
          <div>
            <img
              src={user?.profilePic || ""}
              alt="Profile"
              style={{ width: '150px', height: '150px', borderRadius: '50%' }}
            />
          </div>
        </div>
        {editMode ? (
          <form className='edit' onSubmit={handleSubmit}>
            <div className='username'>
              <label>Username:</label>
              <input
                type="text"
                value={currentUser?.username}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div className='email'>
              <label>Email:</label>
              <input
                type="email"
                value={currentUser?.email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className='profile picture'>
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
          <div className='not-edit'>
            <div>
              <strong>Username:</strong> {currentUser?.username}
            </div>
            <div>
              <strong>Email:</strong> {currentUser?.email}
            </div>
          </div>
        )}
      </div>
      <PostList userId={userId}/>
    </div>
  );
};
