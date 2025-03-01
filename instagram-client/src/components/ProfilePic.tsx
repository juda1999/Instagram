import { Avatar, IconButton } from "@mui/material";
import React from "react";

type ProfilePicProps = {
    path: string;
    onClick?: () => void;
}

export const ProfilePic: React.FC<ProfilePicProps> = ({ onClick, path }) => {
    return (
        <IconButton disableRipple onClick={onClick} sx={{ p: 0 }}>
            <Avatar alt="Juda" src={`http://localhost:3001${path}`} />
        </IconButton>)
}