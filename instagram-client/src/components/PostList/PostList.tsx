import { AppContext, Post as PostInterface } from "../../App"
import { Post } from "../Post";
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { useRequest } from "../../hooks/useRequest";
import "./PostList.css"
import { Button, Checkbox, Stack } from "@mui/material";

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

  const options =
    useMemo(
      (): AxiosRequestConfig => ({
        method: "post",
        data: { skip, limit }
      }),
      [skip, limit])

  const { data } = useRequest(userId ? `post?uploader=${userId}` : "post", options)

  const fetchItems = async () => {
    setSkip(prev => prev + limit)
  };

  useEffect(
    () => {
      setItems(items => [...items, ...(data ?? [])])
      setHasMore(data?.length === limit)
    }, [data])

  const filteredItems =
    useMemo(
      () => {
        if (showLiked) {
          return items.filter(item => user.likedPosts.includes(item._id))
        } else {
          return items
        }
      }, [showLiked, items])

  //remove at end
  useEffect(
    () => {
      return setItems([])
    }, [])

  return (
    <Stack>
      {!userId &&
        <Button>
          {<Checkbox
            checked={showLiked}
            onChange={(e, checked) => setShowLiked(checked)} />}
          Liked
        </Button>}
      <InfiniteScroll
        className="post-list"
        dataLength={filteredItems?.length}
        next={fetchItems}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}>
        {filteredItems.map((item) => (
          <Post
            key={item._id}
            post={item} />
        ))}
      </InfiniteScroll>
    </Stack>);
};
