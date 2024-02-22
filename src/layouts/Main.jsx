import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";
import  GridLoader  from "react-spinners/GridLoader";

export default function Main() {
    // Variables
    const {user, loading} = useContext(AuthContext);

    if(loading) {
        return  <GridLoader color="#36d7b7"  size={30} /> // J'arrive po à centrer
    }

    return (
        <div><Outlet /></div>
    )
}