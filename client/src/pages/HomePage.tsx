import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CustomCalendar } from '../components/CustomCalendar';
import { NavBar } from '../components/Navbar';
import { SideBar } from '../components/SideBar';
import { TipTap } from '../components/TipTap';
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
    console.log(location.state)

    return (
        <div className="v-screen h-screen flex-wrap items-center justify-between">
            <NavBar />
            <h1>Hello {location.state?.firstName}</h1>
            <div className="home_page_container flex h-[90%] w-full items-center justify-between">
                <SideBar dataList={['Story 1', 'Story 2', 'Story 3', 'Story 4', 'Story 5']} />

                <div className="flex h-full w-[85%] items-center justify-between">
                    <div className="h-full w-[65%]">
                        {jwt ? <TipTap jwt={jwt} /> : <div>Loading bruh</div>}
                    </div>
                    <div className="flex h-full w-[35%] flex-col items-center justify-evenly bg-blue-500 text-center">
                        <div className="h-[45%] w-[90%] bg-red-700"></div>
                        <div className="h-[45%] w-[90%] bg-white">
                            <CustomCalendar
                                events={[
                                    {
                                        eventId: '1',
                                        eventDate: '2024-08-01',
                                        eventTitle: 'Trattoriaaaaaaa1'
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
