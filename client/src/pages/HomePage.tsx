import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavBar } from '../components/Navbar';

import { CreateDocumentForm } from '../components/CreateDocumentForm';
import { Flipbook } from '../components/Flipbook';
import { UploadImageModal } from '../components/Modals/UploadImageModal';
import { UploadImageModalInfo } from '../types/DocumentTypes';
import { User } from '../types/UserTypes';

export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
    const [user, setUser] = useState<User>(useLocation().state);
    const [showCreateDocumentForm, setShowCreateDocumentForm] = useState<boolean>(false);
    const [showUploadModalInfo, setShowUploadModalInfo] = useState<UploadImageModalInfo>({
        documentId: '',
        status: false,
        refetch: false
    });
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

    return (
        <div className="v-screen h-screen flex-wrap items-center justify-between">
            {showCreateDocumentForm && user && (
                <CreateDocumentForm
                    user={user}
                    setShowCreateDocumentForm={setShowCreateDocumentForm}
                    setRefetchTrigger={setRefetchTrigger}
                />
            )}
            {showUploadModalInfo.status && user && (
                <UploadImageModal
                    userId={user.userId}
                    collabToken={user.collabToken}
                    showUploadModalInfo={showUploadModalInfo}
                    setShowUploadModalInfo={setShowUploadModalInfo}
                />
            )}
            <NavBar setShowCreateDocumentForm={setShowCreateDocumentForm} />
            <div className="home_page_container bg-pogo flex h-[90%] w-full items-center justify-evenly">
                <Flipbook
                    user={user}
                    setRefetchTrigger={setRefetchTrigger}
                    showUploadModalInfo={showUploadModalInfo}
                    setShowUploadModalInfo={setShowUploadModalInfo}
                />
                {/* <div className="flex h-full w-[50%] items-center justify-center p-[2rem]">
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
                </div> */}
                {/* <SideBar
                    dataList={documents.map((doc: DocumentData) => {
                        return { id: doc.documentId, name: doc.title, date: doc.date };
                    })}
                /> */}
            </div>
        </div>
    );
}
