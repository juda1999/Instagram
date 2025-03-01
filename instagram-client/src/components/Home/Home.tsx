import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PostList } from "../PostList";
import { Button, IconButton, Modal, Stack } from "@mui/material";
import { UserDetails } from "../UserDetails/UserDetails";
import _ from "lodash";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import "./Home.css"
import { useRequestAction } from "../../hooks";
import { ProfilePic } from "../ProfilePic";

interface HomeContextProps {
    userDetailsId?: string;
    setUserDetailsId?: (userId: string) => void
  }


export const HomeContext = createContext<HomeContextProps>({});
export function Home() {
    const { setNavbarItems, user } = useContext(AppContext)
    const [userDetailsId, setUserDetailsId] = useState<string>();
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("accessToken");
        navigate("/signIn")
    }

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
                    <Button
                        sx={{
                            backgroundColor: "aliceblue",
                            height: "50%"
                        }}
                        onClick={() => handleLogout()}>
                        Logout
                    </Button>
                    <ProfilePic path={user?.profilePicture} onClick={() => setUserDetailsId(user._id)} />
                </Stack>)

        },
        [])

    return (
        <HomeContext.Provider value={{userDetailsId, setUserDetailsId}}>
            <div className="container">
                <Modal
                 onClose={() => setUserDetailsId(undefined)}
                 open={!_.isNil(userDetailsId)}>
                    <UserDetails userId={userDetailsId}/>
                </Modal>
                <PostList/>
            </div>
        </HomeContext.Provider>
    )
}


export type pageType = "create" | "view";