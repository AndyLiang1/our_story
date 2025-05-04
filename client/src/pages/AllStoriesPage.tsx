import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDocumentsAllStories } from '../apis/documentApi';
import { promptLoginSwal } from '../components/Alerts/PromptLogin';
import { GenericCard } from '../components/GenericCard';
import { CreateDocumentForm } from '../components/ModalsAndPopupForms/CreateDocumentForm';
import { PartnerForm } from '../components/ModalsAndPopupForms/PartnerForm';
import { NavBar } from '../components/Navbar';
import { UserContext } from '../context/userContext';
import { DocumentData } from '../types/DocumentTypes';
import { User } from '../types/UserTypes';

export interface IAllStoriesPageProps {}

export function AllStoriesPage(props: IAllStoriesPageProps) {
    const LIMIT = 20;
    const navigate = useNavigate();
    const location = useLocation();
    if (!location.state) promptLoginSwal();
    const [user, setUser] = useState<User>(location.state.user);
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [triggerStoriesListRefetch, setTriggerStoriesListRefetch] = useState<object>({});
    const [showCreateDocumentForm, setShowCreateDocumentForm] = useState<boolean>(false);
    // need this state to destroy the trigger div, otherwise, the grid will interpret it as another element
    const [keepTriggerFetchDiv, setKeepTriggerFetchDiv] = useState<boolean>(true);
    const [showPartnerForm, setShowPartnerForm] = useState(false);

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
                const data = await getDocumentsAllStories(user.collabToken, page);
                setPage(page + 1);
                setTotal(data.total);
                setDocuments([...documents, ...data.documents]);
            };
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
                        setTriggerStoriesListRefetch={setTriggerStoriesListRefetch}
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
                    {documents.length > 0 ? (
                        <div className="box-border grid h-full w-full grid-cols-[repeat(auto-fit,12rem)] justify-center gap-[10rem] overflow-auto pt-[1.5rem] pb-[1.5rem]">
                            {documents.map((doc: DocumentData) => {
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
                        </div>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-center">
                            {createDocumentPrompt()}
                        </div>
                    )}
                    {keepTriggerFetchDiv && <div ref={ref}></div>}
                </div>
            </UserContext.Provider>
        </div>
    );
}
