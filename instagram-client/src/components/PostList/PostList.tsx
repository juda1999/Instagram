import _ from "lodash"
import { Post } from "../Post/Post"
import { Fragment } from "react/jsx-runtime"

export const PostList: React.FC = () => {
    const posts = [] // get from backend
    return (
        <Fragment>
        {_.map(
            posts,
            post => <Post post={post}/>)}
            </Fragment>)
}