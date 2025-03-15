import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDocumentsAllStories } from '../apis/documentApi';
import { Card } from '../components/Card';
import { CreateDocumentForm } from '../components/ModalsAndPopupForms/CreateDocumentForm';
import { ShareDocumentForm } from '../components/ModalsAndPopupForms/ShareDocumentForm';
import { NavBar } from '../components/Navbar';
import { UserContext } from '../context/userContext';
import { DocumentData, ShareDocumentFormInfo } from '../types/DocumentTypes';
import { User } from '../types/UserTypes';

export interface IAllStoriesPageProps {}

export function AllStoriesPage(props: IAllStoriesPageProps) {
    const [user, setUser] = useState<User>(useLocation().state);
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [triggerStoriesListRefetch, setTriggerStoriesListRefetch] = useState<object>({});
    const [showCreateDocumentForm, setShowCreateDocumentForm] = useState<boolean>(false);
    const [showShareDocumentForm, setShowShareDocumentForm] = useState<ShareDocumentFormInfo>({
        documentId: '',
        documentTitle: '',
        status: false
    });

    useEffect(() => {
        if (!user.collabToken) {
            const collabToken = sessionStorage.getItem('our_story_collabToken');
            if (collabToken) {
                const userWithCollabToken = {
                    ...user,
                    collabToken: collabToken
                };
                setUser(userWithCollabToken);
            }
        }
        const fetchData = async () => {
            const data = await getDocumentsAllStories(user.userId, user.collabToken, 1);
            setDocuments(data.documents);
        };
        if (user && user.collabToken) fetchData();
    }, [user, triggerStoriesListRefetch]);

    return (
        <div className="v-screen relative h-screen flex-wrap items-center">
            <UserContext.Provider value={user}>
                {showCreateDocumentForm && user && (
                    <CreateDocumentForm
                        setShowCreateDocumentForm={setShowCreateDocumentForm}
                        setTriggerStoriesListRefetch={setTriggerStoriesListRefetch}
                    />
                )}
                {showShareDocumentForm.status && user && (
                    <ShareDocumentForm
                        showShareDocumentForm={showShareDocumentForm}
                        setShowShareDocumentForm={setShowShareDocumentForm}
                    />
                )}
                <NavBar
                    setShowCreateDocumentForm={setShowCreateDocumentForm}
                    setShowShareDocumentForm={setShowShareDocumentForm}
                />
                <div className="bg-pogo box-border grid h-[90%] w-full grid-cols-[repeat(auto-fit,12rem)] justify-center gap-[10rem] pt-[1.5rem]">
                    {documents.length &&
                        documents.map((doc: DocumentData) => {
                            return (
                                <Card
                                    title={doc.title}
                                    date={doc.eventDate}
                                    image={doc.firstImageWSignedUrl}
                                    defaultImage=""
                                />
                            );
                        })}
                </div>
            </UserContext.Provider>
        </div>
    );
}
