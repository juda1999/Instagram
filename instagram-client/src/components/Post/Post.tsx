import React from 'react';
import { Post as PostInterface } from '../../App';

interface PostProps {
  post: PostInterface;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="post-item">
      <h3>{post.title}</h3>
    </div>
  );
};
