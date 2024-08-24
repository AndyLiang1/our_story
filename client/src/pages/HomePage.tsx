import * as React from 'react';
import { TipTap } from '../components/TipTap';
import { SideBar } from '../components/SideBar';
import { NavBar } from '../components/Navbar';
import { config } from '../config/config';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllDocuments } from '../apis/documentApi';
import { CustomCalendar } from '../components/CustomCalendar';
export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
    const [jwt, setJWT] = useState('');
    const [documents, setDocuments] = useState({});
    const location = useLocation();
    const userInfo = location.state;

    useEffect(() => {
        // const documents = getAllDocuments(userInfo.authToken, userInfo.tiptapToken)
        // setDocuments(documents)
    }, []);

    return (
        <div className="v-screen h-screen flex-wrap items-center justify-between">
            <NavBar />
            <div className="home_page_container flex h-[90%] w-full items-center justify-between">
                <SideBar dataList={['Story 1', 'Story 2', 'Story 3', 'Story 4', 'Story 5']} />

                <div className="flex h-full w-[85%] items-center justify-between">
                    <div className="h-full w-[65%]">
                        {jwt ? <TipTap jwt={jwt} /> : <div>Loading bruh</div>}
                    </div>
                    <div className="flex h-full w-[35%] flex-col items-center justify-evenly bg-blue-500 text-center">
                        <div className="h-[45%] w-[90%] bg-red-700">
                        </div>
                        <div className="h-[45%] w-[90%] bg-white">
                            <CustomCalendar
                                events={[
                                    {
                                        eventId: '1',
                                        eventDate: '2024-08-01',
                                        eventTitle: 'Trattoria1'
                                    },
                                    {
                                        eventId: '2',
                                        
                                        eventDate: '2024-08-02',
                                        eventTitle: 'Trattoria1'
                                    },
                                    {
                                        eventId: '3',
                                        eventDate: '2024-08-02',
                                        eventTitle: 'Trattoria2'
                                    },
                                    {
                                        eventId: '4',
                                        eventDate: '2024-08-03',
                                        eventTitle: 'Trattoria1'
                                    },
                                    {
                                        eventId: '5',
                                        eventDate: '2024-08-03',
                                        eventTitle: 'Trattoria2'
                                    },
                                    {
                                        eventId: '6',
                                        eventDate: '2024-08-03',
                                        eventTitle: 'Trattoria3'
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
