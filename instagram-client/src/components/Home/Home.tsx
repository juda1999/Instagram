import React, { createContext, useContext, useEffect, useState } from "react";
import { PostList } from "../PostList";
import { Button, IconButton, Modal, Stack } from "@mui/material";
import { Navbar } from "../Navbar/Navbar";
import { UserDetails } from "../UserDetails/UserDetails";
import _ from "lodash";
import { AppContext, Post } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import "./Home.css"

interface HomeContextProps {
    userId?: string;
    setUserId?: (userId: string) => void
  }


export const HomeContext = createContext<HomeContextProps>({});
export function Home() {
    const { setNavbarItems, user } = useContext(AppContext)
    const [userId, setUserId] = useState<string>();
    const navigate = useNavigate();

    useEffect(
        () => {
            setNavbarItems(
                <Stack spacing={2} alignItems="center" direction="row">
                    <Button
                        sx={{
                            backgroundColor: "aliceblue",
                            height: "50%"
                        }}
                        onClick={() => navigate("/add")}>
                        Add Post
                    </Button>
                    <IconButton
                        onClick={() => setUserId(user?._id)}
                        size="large"
                        color="inherit">
                        <AccountCircle />
                    </IconButton>
                </Stack>)

        },
        [])

    return (
        <HomeContext.Provider value={{userId, setUserId}}>
            <div className="container">
                <Modal
                 onClose={() => setUserId(undefined)}
                 open={!_.isNil(userId)}>
                    <UserDetails userId={userId}/>
                </Modal>
                <PostList/>
            </div>
        </HomeContext.Provider>
    )
}


export type pageType = "create" | "view";