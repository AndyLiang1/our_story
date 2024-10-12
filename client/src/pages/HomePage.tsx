import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GenericCalendar } from '../components/GenericCalendar';
import { NavBar } from '../components/Navbar';
import { SideBar } from '../components/SideBar';
import { TipTap } from '../components/TipTap';

import { getAllDocuments } from '../apis/documentApi';
import { CreateDocumentForm } from '../components/CreateDocumentForm';
import { ImageCarousel } from '../components/ImageCarousel';
import { DocumentData } from '../types/DocumentTypes';
import { User } from '../types/UserTypes';
export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [imageNames, setImageNames] = useState<string[]>([]);
    const [user, setUser] = useState<User>(useLocation().state);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [refetchTrigger, setRefetchTrigger] = useState<Object>({});

    useEffect(() => {
        const collabToken = sessionStorage.getItem('our_story_collabToken');
        if (collabToken) {
            const userWithCollabToken = {
                ...user,
                collabToken: collabToken
            };
            setUser(userWithCollabToken);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (user.collabToken) {
                const documents = await getAllDocuments(user.userId, user.collabToken, null, null);
                setDocuments(documents);
            }
        };
        fetchData();
    }, [user, refetchTrigger]);

    useEffect(() => {
        if (documents && documents.length) setImageNames(documents[0].images);
    }, [documents]);

    return (
        <div className="v-screen relative h-screen flex-wrap items-center justify-between">
            {showForm && user && (
                <CreateDocumentForm
                    user={user}
                    setShowForm={setShowForm}
                    setRefetchTrigger={setRefetchTrigger}
                />
            )}
            <NavBar setShowForm={setShowForm} />
            <div className="home_page_container flex h-[90%] w-full items-center justify-between">
                <div className="flex h-full w-[85%] items-center justify-between">
                    <div className="flex h-full w-[35%] flex-col items-center justify-evenly bg-blue-500 text-center">
                        <div className="h-[45%] w-[90%] bg-red-700">
                            {documents.length && (
                                <ImageCarousel
                                    collabToken={user.collabToken}
                                    documentId={documents[0].documentId}
                                    imageNames={imageNames}
                                    setImageNames={setImageNames}
                                    height="h-full"
                                    width="w-full"
                                />
                            )}
                        </div>

                        <div className="h-[45%] w-[90%] bg-white">
                            <GenericCalendar
                                events={documents.map((doc) => {
                                    return {
                                        id: doc.documentId,
                                        name: doc.title,
                                        date: doc.eventDate
                                    };
                                })}
                            />
                        </div>
                    </div>
                    <div className="padding-2 flex h-full w-[65%] items-center justify-center bg-blue-300">
                        {user.collabToken && documents.length ? (
                            <TipTap
                                documentId={documents[0].documentId}
                                documentTitle={documents[0].title}
                                setRefetchTrigger={setRefetchTrigger}
                                collabToken={user.collabToken}
                                styles="h-full w-full"
                            />
                        ) : user.collabToken && documents.length === 0 ? (
                            <button onClick={() => setShowForm(true)}>Create new </button>
                        ) : (
                            <div>Loading bruh</div>
                        )}
                    </div>
                </div>
                <SideBar
                    dataList={documents.map((doc: DocumentData) => {
                        return { id: doc.documentId, name: doc.title, date: doc.date };
                    })}
                />
            </div>
        </div>
    );
}
