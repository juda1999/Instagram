import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PostList } from "../PostList";

export function Home() {
    const navigate = useNavigate()
    useEffect(
        () => {
          const token = localStorage.getItem('accessToken');
          if(!token){
            navigate("/signIn")
          }
        },
        [])

    return (
        <PostList/>
    )
}