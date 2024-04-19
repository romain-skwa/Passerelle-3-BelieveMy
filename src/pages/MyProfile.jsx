import { useContext, useEffect, useState } from "react";
import FormWriteTweet from "../components/Middle/FormWriteTweet";
import MyTweets from "../components/Middle/MyTweets";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../store/AuthProvider";
import ChangeMyPseudo from "../components/MyProfile/ChangeMyPseudo";

export default function MyProfile() {
    return(
        <>
        <ChangeMyPseudo />
        </>
    )
}