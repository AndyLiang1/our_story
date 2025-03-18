import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDocumentsAllStories } from '../apis/documentApi';
import { GenericCard } from '../components/GenericCard';
import { CreateDocumentForm } from '../components/ModalsAndPopupForms/CreateDocumentForm';
import { ShareDocumentForm } from '../components/ModalsAndPopupForms/ShareDocumentForm';
import { NavBar } from '../components/Navbar';
import { UserContext } from '../context/userContext';
import { DocumentData, ShareDocumentFormInfo } from '../types/DocumentTypes';
import { User } from '../types/UserTypes';

export interface IAllStoriesPageProps {}

export function AllStoriesPage(props: IAllStoriesPageProps) {
    const LIMIT = 20;
    const navigate = useNavigate();
    const [user, setUser] = useState<User>(useLocation().state.user);
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [triggerStoriesListRefetch, setTriggerStoriesListRefetch] = useState<object>({});
    const [showCreateDocumentForm, setShowCreateDocumentForm] = useState<boolean>(false);
    // need this state to destroy the trigger div, otherwise, the grid will interpret it as another element
    const [keepTriggerFetchDiv, setKeepTriggerFetchDiv] = useState<boolean>(true);
    const [showShareDocumentForm, setShowShareDocumentForm] = useState<ShareDocumentFormInfo>({
        documentId: '',
        documentTitle: '',
        status: false
    });
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(Number.POSITIVE_INFINITY);
    const DEFAULT_IMG_URL = '/autumn-landscape-building-city-blue-600nw-2174533935.png';

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
        if (page * LIMIT >= total) {
            setKeepTriggerFetchDiv(false);
            return;
        }
        if (inView && user.collabToken) {
            const fetchData = async () => {
                const data = await getDocumentsAllStories(user.userId, user.collabToken, page);
                setPage(page + 1);
                setTotal(data.total);
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

    const goToDocument = (documentIdToGoTo: string) => {
        console.log("All stories: ", documentIdToGoTo)
        navigate(`/home`, {
            state: {
                user,
                documentToGoToInfo: {
                    documentId: documentIdToGoTo,
                    timestampToTriggerUseEffect: Date.now()
                }
            }
        });
    };

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
                {(showCreateDocumentForm || showShareDocumentForm.status) && (
                    <div className="fixed inset-0 z-9 h-full w-full bg-black opacity-75" />
                )}
                <div className="bg-pogo absolute h-[90%] w-full">
                    <div className="box-border grid h-full w-full grid-cols-[repeat(auto-fit,12rem)] justify-center gap-[10rem] overflow-auto pt-[1.5rem] pb-[1.5rem]">
                        {documents.length &&
                            documents.map((doc: DocumentData) => {
                                return (
                                    <GenericCard
                                        title={doc.title}
                                        date={doc.eventDate}
                                        image={doc.firstImageWSignedUrl}
                                        defaultImage={DEFAULT_IMG_URL}
                                        handleClick={() => goToDocument(doc.documentId)}
                                    />
                                );
                            })}
                        {keepTriggerFetchDiv && <div ref={ref}></div>}
                    </div>
                </div>
            </UserContext.Provider>
        </div>
    );
}
