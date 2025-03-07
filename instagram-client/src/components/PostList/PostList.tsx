import { AppContext, Post as PostInterface } from '../../App';
import { Post } from '../Post';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
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
  const limit = 10;

  const options = useMemo(
    (): AxiosRequestConfig => ({
      method: 'post',
      data: { skip, limit, filterIds: showLiked ? user.likedPosts : undefined },
    }),
    [skip, limit, showLiked]
  );

  const { data, loading } = useRequest(
    userId ? `post?uploader=${userId}` : 'post',
    options
  );

  const fetchItems = async () => {
    setSkip((prev) => prev + limit);
  };

  useEffect(() => {
    setItems((items) =>
      _.uniqBy([...items, ...(data ?? [])], (item) => item._id)
    );
    setHasMore(data?.length === limit);
  }, [data]);

  // const filteredItems = useMemo(() => {
  //   if (showLiked) {
  //     return items.filter((item) => user.likedPosts.includes(item._id));
  //   } else {
  //     return items;
  //   }
  // }, [showLiked, items]);

  useEffect(() => {
    setHasMore(true);
    setItems([]);
  }, [showLiked]);

  return (
    <Stack sx={{ backgroundColor: '#f0f4f8', minHeight: 'calc(100vh - 64px)' }}>
      {!userId && (
        <Button sx={{ marginLeft: 2, width: 'fit-content' }} disableRipple>
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
          <Typography sx={{ marginTop: '16px' }}>No Posts</Typography>
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
      </InfiniteScroll>
    </Stack>
  );
};
