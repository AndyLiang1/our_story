import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../types/UserTypes";
import { useState } from "react";

export interface INavBarProps {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavBar({setShowForm}: INavBarProps) {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>(useLocation().state);

    return <div className="h-[10%] w-full bg-white flex justify-start ">
        <div className="h-full w-[20%] bg-red-200 text-[3rem]">Our Story</div>
        <div className="h-full w-[10%] text-[1.2rem] flex justify-center items-center text-center cursor-pointer" onClick = {() => {
            navigate('/stories', { state: user })
        }}>Stories</div>
        <div className="h-full w-[10%] text-[1.2rem] flex justify-center items-center text-center cursor-pointer" onClick = {() => {setShowForm(true)}}>Create</div>
    </div>;
}
