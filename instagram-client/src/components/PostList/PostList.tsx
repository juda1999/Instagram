import _, { method } from "lodash"
import { Post as PostInterface } from "../../App"
import { Post } from "../Post/Post";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useMemo, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { useRequest } from "../../hooks/useRequest";

type PostListProps = {
    userId?: string;
};

export const PostList: React.FC<PostListProps> = ({ userId }) => {
  const [skip, setSkip] = useState(0);
  const [items, setItems] = useState<PostInterface[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const options =
    useMemo(
      (): AxiosRequestConfig => ({
        method: "post",
        data: { skip, limit }
      }),
    [skip, limit])

  const {data} = useRequest(userId ? `post?uploader={${userId}}` : "post", options)

  const fetchItems = async () => {
    setSkip(prev => prev + limit)
  };

  useEffect(
    () => {
        setItems(items => [...items, ...data])
        setHasMore(data.length === limit)
    },[data])

    //remove at end
    useEffect(
      () => {
         return setItems([])
      },[])

  return (
    <InfiniteScroll
        dataLength={items.length}
        next={fetchItems}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}>
          {items.map((item) => (
            <Post post={item}/>
          ))}
    </InfiniteScroll>);
};
