import _ from "lodash"
import { Post } from "../Post/Post"

export const PostList: React.FC = () => {
    const posts = [] // get from backend
    return (
        _.map(
            posts,
            post => <Post post={post}/>)
    )
}