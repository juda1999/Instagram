import React from 'react';

interface PostProps {
  post: {
    id: number;
    picture: string;
    title: string;
    content: string;
    author: string;
  };
}

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="post-item">
      <h3>{post.title}</h3>
      <p><strong>Author:</strong> {post.author}</p>
      <p>{post.content}</p>
    </div>
  );
};
