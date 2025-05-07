import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDocument, getDocumentsAllStories } from '../apis/documentApi';
import { promptLoginSwal } from '../components/Alerts/PromptLogin';
import { GenericCard } from '../components/GenericCard';
import { CreateDocumentForm } from '../components/ModalsAndPopupForms/CreateDocumentForm';
import { PartnerForm } from '../components/ModalsAndPopupForms/PartnerForm';
import { NavBar } from '../components/Navbar';
import { UserContext } from '../context/userContext';
import { DocumentData } from '../types/DocumentTypes';
import { User } from '../types/UserTypes';

export interface IAllStoriesPageProps {}

enum DOCUMENT_STATE {
    'INIT' = 'initial',
    'DONE' = 'done'
}

export function AllStoriesPage(props: IAllStoriesPageProps) {
    const LIMIT = 20;
    const navigate = useNavigate();
    const location = useLocation();
    if (!location.state) promptLoginSwal();
    const [user, setUser] = useState<User>(location.state.user);
    const [documentData, setDocumentData] = useState<{
        state: DOCUMENT_STATE;
        documents: DocumentData[];
    }>({
        state: DOCUMENT_STATE.INIT,
        documents: []
    });
    const [documentIdToAddToAllStoriesPage, setDocumentIdToAddToAllStoriesPage] =
        useState<string>('');
    const [showCreateDocumentForm, setShowCreateDocumentForm] = useState<boolean>(false);
    // need this state to destroy the trigger div, otherwise, the grid will interpret it as another element
    const [keepTriggerFetchDiv, setKeepTriggerFetchDiv] = useState<boolean>(true);
    const [showPartnerForm, setShowPartnerForm] = useState(false);

    const [page, setPage] = useState(1);
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

    useEffect(() => {
        if (user.collabToken) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        const data = await getDocumentsAllStories(user.collabToken, page);
        setPage(Math.floor((data.documents.length + documentData.documents.length) / LIMIT) + 1);
        if (data.documents.length < LIMIT) setKeepTriggerFetchDiv(false);
        setDocumentData({
            state: DOCUMENT_STATE.DONE,
            documents: [...documentData.documents, ...data.documents]
        });
    };

    useEffect(() => {
        if (user && documentIdToAddToAllStoriesPage) {
            const getDocumentAndUpdateDocumentList = async () => {
                const newlyCreatedDocument = await getDocument(
                    documentIdToAddToAllStoriesPage,
                    user.collabToken
                );
                setDocumentData({
                    state: DOCUMENT_STATE.DONE,
                    documents: [newlyCreatedDocument, ...documentData.documents]
                });
            };
            getDocumentAndUpdateDocumentList();
        }
    }, [documentIdToAddToAllStoriesPage]);

    const { ref, inView } = useInView({});

    useEffect(() => {
        if (inView && user.collabToken) {
            fetchData();
        }
    }, [inView, user]);

    const goToDocument = (documentIdToGoTo: string) => {
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

    const createDocumentPrompt = () => {
        return (
            <div className="h-[65%] w-[31.5%]">
                <div className="box-border flex h-full w-full items-center justify-center rounded-[4rem] border-none bg-white px-[3.5rem] text-center text-[2.5rem] shadow-2xl">
                    Create your first document by clicking create in the nav bar above!
                </div>
            </div>
        );
    };

    return (
        <div className="v-screen relative h-screen flex-wrap items-center">
            <UserContext.Provider value={user}>
                {showCreateDocumentForm && user && (
                    <CreateDocumentForm
                        setShowCreateDocumentForm={setShowCreateDocumentForm}
                        setDocumentIdToAddToAllStoriesPage={setDocumentIdToAddToAllStoriesPage}
                    />
                )}
                {showPartnerForm && user && <PartnerForm setShowPartnerForm={setShowPartnerForm} />}
                <NavBar
                    setShowCreateDocumentForm={setShowCreateDocumentForm}
                    setShowPartnerForm={setShowPartnerForm}
                />
                {(showCreateDocumentForm || showPartnerForm) && (
                    <div className="fixed inset-0 z-9 h-full w-full bg-black opacity-75" />
                )}

                <div className="bg-pogo absolute h-[90%] w-full">
                    {documentData.state === DOCUMENT_STATE.DONE &&
                        (documentData.documents.length > 0 ? (
                            <div className="box-border grid h-full w-full grid-cols-[repeat(auto-fit,12rem)] justify-center gap-[10rem] overflow-auto pt-[1.5rem] pb-[1.5rem]">
                                {documentData.documents.map((doc: DocumentData) => {
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
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-center">
                                {createDocumentPrompt()}
                            </div>
                        ))}
                </div>
            </UserContext.Provider>
        </div>
    );
}
