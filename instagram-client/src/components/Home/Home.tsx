import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PostList } from "../PostList";
import axios from "axios";
import { AppContext, User } from "../../App";
import { CircularProgress } from "@mui/material";

export function Home() {
    return (
        <PostList/>
    )
}