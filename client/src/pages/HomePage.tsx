import * as React from 'react';
import { TipTap } from '../components/TipTap';
import { SideBar } from '../components/SideBar';
import { NavBar } from '../components/Navbar';
import {config} from "../config/config"
export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
    const [jwt, setJWT] = React.useState('');

    // this is temporary
    const getJWT = async () => {
        try {
            const response = await fetch(config.baseUrl);
            const data = await response.json();
            setJWT(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    React.useEffect(() => {
        getJWT();
    }, []);
    return (
        <div className="h-screen v-screen flex-wrap justify-between items-center">
            <NavBar />
            <div className="home_page_container h-[90%] w-full flex justify-between items-center">
                <SideBar />
                <div className="h-full w-[85%] flex justify-between items-center">
                    <div className="h-full w-[65%]">
                        {jwt ? <TipTap jwt={jwt} /> : <div>Loading bruh</div>}
                    </div>
                    <div className="h-full w-[35%] bg-blue-500 flex flex-col justify-evenly items-center text-center">
                        <div className="h-[45%] w-[90%] bg-red-300"></div>
                        <div className="h-[45%] w-[90%] bg-red-500"></div>
                    </div>

               
                </div>
            </div>
        </div>
    );
}
