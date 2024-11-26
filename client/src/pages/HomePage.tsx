import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GenericCalendar } from '../components/GenericCalendar';
import { NavBar } from '../components/Navbar';
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
            if (user && user.collabToken) {
                const docs = await getAllDocuments(user.userId, user.collabToken, null, null);
                setDocuments(
                    docs.map((doc: DocumentData) => {
                        return { ...doc, eventDate: new Date(doc.eventDate) };
                    })
                );
            }
        };
        fetchData();
    }, [user, refetchTrigger]);

    useEffect(() => {
        if (documents && documents.length) setImageNames(documents[0].images);
    }, [documents]);

    return (
        <div className="v-screen h-screen flex-wrap items-center justify-between">
            {showForm && user && (
                <CreateDocumentForm
                    user={user}
                    setShowForm={setShowForm}
                    setRefetchTrigger={setRefetchTrigger}
                />
            )}
            <NavBar setShowForm={setShowForm} />
            <div className="home_page_container bg-pogo flex h-[90%] w-full items-center justify-evenly">
                <div className="flex h-full w-[50%] items-center justify-center p-[2rem]">
                    {user && user.collabToken && documents.length ? (
                        <TipTap
                            key={documents[0].documentId}
                            documentId={documents[0].documentId}
                            documentTitle={documents[0].title}
                            setRefetchTrigger={setRefetchTrigger}
                            collabToken={user.collabToken}
                            styles="h-full w-full"
                        />
                    ) : user && user.collabToken && documents.length === 0 ? (
                        <button onClick={() => setShowForm(true)}>Create new </button>
                    ) : (
                        <div>Loading bruh</div>
                    )}
                </div>
                <div className="flex h-full w-[30%] flex-col items-center justify-evenly p-[2rem]">
                    <div className="h-[52%] w-full">
                        {user && documents.length && (
                            <ImageCarousel
                                collabToken={user.collabToken}
                                documentId={documents[0].documentId}
                                imageNames={imageNames}
                                setImageNames={setImageNames}
                            />
                        )}
                    </div>
                    <div className="h-[2%] w-full"></div>
                    <div className="h-[45%] w-full">
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
                {/* <SideBar
                    dataList={documents.map((doc: DocumentData) => {
                        return { id: doc.documentId, name: doc.title, date: doc.date };
                    })}
                /> */}
            </div>
        </div>
    );
}
