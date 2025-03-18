import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavBar } from '../components/Navbar';

import { Flipbook } from '../components/Flipbook';
import { CreateDocumentForm } from '../components/ModalsAndPopupForms/CreateDocumentForm';
import { ShareDocumentForm } from '../components/ModalsAndPopupForms/ShareDocumentForm';
import { UploadImageModal } from '../components/ModalsAndPopupForms/UploadImageModal';
import { UserContext } from '../context/userContext';
import { ShareDocumentFormInfo, UploadImageModalInfo } from '../types/DocumentTypes';
import { User } from '../types/UserTypes';

export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
    const { state } = useLocation();
    const { documentToGoToInfo } = state;
    const navigate = useNavigate();
    const [user, setUser] = useState<User>(state.user);

    const [showCreateDocumentForm, setShowCreateDocumentForm] = useState<boolean>(false);
    const [showUploadModalInfo, setShowUploadModalInfo] = useState<UploadImageModalInfo>({
        documentId: '',
        status: false,
        refetch: false
    });
    const [showShareDocumentForm, setShowShareDocumentForm] = useState<ShareDocumentFormInfo>({
        documentId: '',
        documentTitle: '',
        status: false
    });

    const [triggerFlipBookRefetch, setTriggerFlipBookRefetch] = useState<string>('');

    useEffect(() => {
        if (documentToGoToInfo && documentToGoToInfo.documentId) {
            setTriggerFlipBookRefetch(documentToGoToInfo.documentId);
            setTimeout(() => {
                navigate(state.basepath, {
                    state: {
                        user,
                        documentToGoToInfo: {
                            documentId: '',
                            timestampToTriggerUseEffect: Date.now()
                        }
                    }
                });
            }, 2000);
        }
    }, [documentToGoToInfo]);

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
            <UserContext.Provider value={user}>
                {showCreateDocumentForm && user && (
                    <CreateDocumentForm
                        setShowCreateDocumentForm={setShowCreateDocumentForm}
                        setTriggerFlipBookRefetch={setTriggerFlipBookRefetch}
                    />
                )}
                {showUploadModalInfo.status && user && (
                    <UploadImageModal
                        showUploadModalInfo={showUploadModalInfo}
                        setShowUploadModalInfo={setShowUploadModalInfo}
                    />
                )}
                {showShareDocumentForm.status && user && (
                    <ShareDocumentForm
                        showShareDocumentForm={showShareDocumentForm}
                        setShowShareDocumentForm={setShowShareDocumentForm}
                    />
                )}
                {(showCreateDocumentForm ||
                    showUploadModalInfo.status ||
                    showShareDocumentForm.status) && (
                    <div className="fixed inset-0 z-9 h-full w-full bg-black opacity-75" />
                )}
                <NavBar
                    setShowCreateDocumentForm={setShowCreateDocumentForm}
                    setShowShareDocumentForm={setShowShareDocumentForm}
                />
                <div className="home_page_container bg-pogo flex h-[90%] w-full items-center justify-evenly">
                    <Flipbook
                        showUploadModalInfo={showUploadModalInfo}
                        setShowUploadModalInfo={setShowUploadModalInfo}
                        triggerFlipBookRefetch={triggerFlipBookRefetch}
                        setTriggerFlipBookRefetch={setTriggerFlipBookRefetch}
                        setShowShareDocumentForm={setShowShareDocumentForm}
                    />
                </div>
            </UserContext.Provider>
        </div>
    );
}
