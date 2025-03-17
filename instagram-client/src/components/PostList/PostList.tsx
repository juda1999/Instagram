import { AppContext, Post as PostInterface } from '../../App';
import { Post } from '../Post';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useRequest } from '../../hooks/useRequest';
import './PostList.css';
import {
  Button,
  Checkbox,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import _ from 'lodash';

type PostListProps = {
  userId?: string;
};

export const PostList: React.FC<PostListProps> = ({ userId }) => {
  const { user } = useContext(AppContext);
  const [skip, setSkip] = useState(0);
  const [items, setItems] = useState<PostInterface[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [showLiked, setShowLiked] = useState(false);
  const pageSize = 10;

  const options = useMemo(
    () => ({
      method: 'post',
      data: {
        skip,
        limit: pageSize,
        filterIds: showLiked ? user.likedPosts : undefined,
      },
    }),
    [skip, pageSize, showLiked, user]
  );

  const { data, loading, error } = useRequest(
    userId ? `post?uploader=${userId}` : 'post',
    options
  );

  const fetchItems = async () => {
    setSkip((prev) => prev + pageSize);
  };

  useEffect(() => {
    setItems((items) =>
      _.uniqBy([...items, ...(data ?? [])], (item) => item._id)
    );
    setHasMore(data?.length === pageSize);
  }, [data]);

  useEffect(() => {
    setHasMore(true);
    setItems([]);
    setSkip(0);
  }, [showLiked]);

  return (
    <Stack 
    sx={{  
      backgroundImage: 'url("/house-bg.jpg")',
     backgroundSize: 'repeat',
     backgroundPosition: 'center',
     padding: 2,
     minHeight: 'calc(100vh - 64px)',
     width: '100%',
     }}>
          {!userId && (
        <Button sx={{ marginLeft: 2, width: 'fit-content', bgcolor: '#ffffff' }} disableRipple>
          <Checkbox
            checked={showLiked}
            onChange={(e, checked) => setShowLiked(checked)}
          />
          Liked
        </Button>
      )}
      <InfiniteScroll
        className="post-list"
        dataLength={items?.length}
        next={fetchItems}
        hasMore={hasMore}
        loader={<CircularProgress />}
      >
        {items?.length === 0 && !loading && data?.length === 0 ? (
          <Typography sx={{ marginTop: '16px', bgcolor: '#ffffff' }}>No Posts</Typography>
        ) : (
          items.map((post) => (
            <Post
              deletePost={() => {
                setItems((items) =>
                  _.filter(items, (item) => item._id !== post._id)
                );
              }}
              onEditPost={(post) => {
                setItems((items) => {
                  const index = items.findIndex(
                    (item) => post._id === item._id
                  );
                  items[index] = post;
                  return items;
                });
              }}
              editEnabled={userId === user._id}
              key={post._id}
              post={post}
            />
          ))
        )}
        {error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
      </InfiniteScroll>
    </Stack>
  );
};
