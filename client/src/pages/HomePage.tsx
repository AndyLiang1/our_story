import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GenericCalendar } from '../components/GenericCalendar';
import { NavBar } from '../components/Navbar';
import { SideBar } from '../components/SideBar';
import { TipTap } from '../components/TipTap';

import { ImageCarousel } from '../components/ImageCarousel';
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
            <h1>Hello {location.state?.firstName}</h1>
            <div className="home_page_container flex h-[90%] w-full items-center justify-between">
                <SideBar
                    dataList={[
                        {
                            id: '1',
                            date: '2024-08-01',
                            name: 'Trattoriaaaaaaa1'
                        },
                        {
                            id: '2',
                            date: '2024-08-02',
                            name: 'Trattoria1'
                        },
                        {
                            id: '3',
                            date: '2024-08-02',
                            name: 'Trattoria2'
                        },
                        {
                            id: '4',
                            date: '2024-08-03',
                            name: 'Trattoria1'
                        },
                        {
                            id: '5',
                            date: '2024-08-03',
                            name: 'Trattoria2'
                        },
                        {
                            id: '6',
                            date: '2024-08-03',
                            name: 'Trattoria3'
                        }
                    ]}
                />

                <div className="flex h-full w-[85%] items-center justify-between">
                    <div className="h-full w-[65%]">
                        {jwt ? <TipTap jwt={jwt} /> : <div>Loading bruh</div>}
                    </div>
                    <div className="flex h-full w-[35%] flex-col items-center justify-evenly bg-blue-500 text-center">
                        <div className="h-[45%] w-[90%] bg-red-700">
                        <ImageCarousel images={[
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxB9LYAJ-6j2oUhIYzBiscqR2lGjemhGH3DA&s",
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxB9LYAJ-6j2oUhIYzBiscqR2lGjemhGH3DA&s",
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxB9LYAJ-6j2oUhIYzBiscqR2lGjemhGH3DA&s",
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxB9LYAJ-6j2oUhIYzBiscqR2lGjemhGH3DA&s",
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxB9LYAJ-6j2oUhIYzBiscqR2lGjemhGH3DA&s",
                        ]} height="h-full" width = "w-full" />
                           
                        </div>
                        <div className="h-[45%] w-[90%] bg-white">
                            <GenericCalendar
                                events={[
                                    {
                                        id: '1',
                                        date: '2024-08-01',
                                        name: 'Trattoriaaaaaaa1'
                                    },
                                    {
                                        id: '2',
                                        date: '2024-08-02',
                                        name: 'Trattoria1'
                                    },
                                    {
                                        id: '3',
                                        date: '2024-08-02',
                                        name: 'Trattoria2'
                                    },
                                    {
                                        id: '4',
                                        date: '2024-08-03',
                                        name: 'Trattoria1'
                                    },
                                    {
                                        id: '5',
                                        date: '2024-08-03',
                                        name: 'Trattoria2'
                                    },
                                    {
                                        id: '6',
                                        date: '2024-08-03',
                                        name: 'Trattoria3'
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
