import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
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
    const LIMIT = 20;
    const [user, setUser] = useState<User>(useLocation().state);

    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [triggerStoriesListRefetch, setTriggerStoriesListRefetch] = useState<object>({});
    const [showCreateDocumentForm, setShowCreateDocumentForm] = useState<boolean>(false);
    const [showShareDocumentForm, setShowShareDocumentForm] = useState<ShareDocumentFormInfo>({
        documentId: '',
        documentTitle: '',
        status: false
    });
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(Number.POSITIVE_INFINITY);

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

    const { ref, inView } = useInView({});

    useEffect(() => {
        if (inView && user.collabToken && page * LIMIT < total) {
            const fetchData = async () => {
                console.log('Page is: ', page);
                const data = await getDocumentsAllStories(user.userId, user.collabToken, page);
                setPage(page + 1);
                setTotal(data.total);
                console.log('Page is now: ', page);
                setDocuments([...documents, ...data.documents]);
            };
            fetchData();
        }
    }, [inView, user]);
    useEffect(() => {
        // if (!user.collabToken) {
        //     const collabToken = sessionStorage.getItem('our_story_collabToken');
        //     if (collabToken) {
        //         const userWithCollabToken = {
        //             ...user,
        //             collabToken: collabToken
        //         };
        //         setUser(userWithCollabToken);
        //     }
        // }
        // if (user && user.collabToken) fetchData();
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
                <div className="bg-pogo absolute h-[90%] w-full">
                    <div className="box-border grid h-full w-full grid-cols-[repeat(auto-fit,12rem)] justify-center gap-[10rem] overflow-auto pt-[1.5rem]">
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
                        <div ref={ref}>&nbsp</div>
                    </div>
                </div>
            </UserContext.Provider>
        </div>
    );
}
