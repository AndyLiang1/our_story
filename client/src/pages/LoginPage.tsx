import * as React from 'react';
import { useNavigate } from "react-router-dom";

export interface ILoginPageProps {}

export function LoginPage(props: ILoginPageProps) {
    const navigate = useNavigate()

    const handleSubmit = () => {
        navigate("/home")
    }

    return (
        <div>
            <div className="">Email</div>
            <input />
            <div className="">Password</div>
            <input />
            <button onClick = {handleSubmit}>Submit</button>
        </div>
    );
}
