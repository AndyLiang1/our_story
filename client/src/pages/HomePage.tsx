import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavBar } from '../components/Navbar';

import { Flipbook } from '../components/Flipbook';
import { CreateDocumentForm } from '../components/ModalsAndPopupForms/CreateDocumentForm';
import { DeleteDocumentConfirmationModal } from '../components/ModalsAndPopupForms/DeleteDocumentConfirmationModal';
import { PartnerForm } from '../components/ModalsAndPopupForms/PartnerForm';
import { ShareDocumentForm } from '../components/ModalsAndPopupForms/ShareDocumentForm';
import { UploadImageModal } from '../components/ModalsAndPopupForms/UploadImageModal';
import { UserContext } from '../context/userContext';
import {
    DeleteDocumentConfirmationModalInfo,
    ShareDocumentFormInfo,
    UploadImageModalInfo
} from '../types/ModalInfoTypes';
import { User } from '../types/UserTypes';
import { promptLoginSwal } from '../components/Alerts/PromptLogin';

export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
    const location = useLocation();
    if(!location.state) promptLoginSwal()
    const [user, setUser] = useState<User>(location.state.user);
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
    const [showPartnerForm, setShowPartnerForm] = useState(false);
    const [showDeleteDocumentConfirmationModal, setShowDeleteDocumentConfirmationModal] =
        useState<DeleteDocumentConfirmationModalInfo>({
            documentIdBefore: '',
            documentId: '',
            documentIdAfter: '',
            status: false
        });
    const [triggerFlipBookRefetch, setTriggerFlipBookRefetch] = useState<string>('');

    useEffect(() => {
        const collabToken = sessionStorage.getItem('our_story_collabToken');
        if (collabToken) {
            const userWithCollabToken = {
                ...location.state.user,
                collabToken: collabToken
            };
            setUser(userWithCollabToken);
        }
    }, [location]);

    const clearState = () => {
        const newState = {
            ...location.state,
            documentToGoToInfo: {
                ...location.state.documentToGoToInfo,
                documentId: ''
            },
            ignoreUponReload: true
        };
        // https://github.com/remix-run/react-router/discussions/11415#discussioncomment-9179771
        history.replaceState(
            {
                ...history.state,
                usr: newState
            },
            ''
        );
    };

    useEffect(() => {
        if (
            location.state &&
            location.state.documentToGoToInfo &&
            location.state.documentToGoToInfo.documentId
        ) {
            setTriggerFlipBookRefetch(location.state.documentToGoToInfo.documentId);
            clearState();
            return;
        }
        setTriggerFlipBookRefetch('initial');
    }, [user]);

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
                {showPartnerForm && user && <PartnerForm setShowPartnerForm={setShowPartnerForm} />}
                {showDeleteDocumentConfirmationModal.status && user && (
                    <DeleteDocumentConfirmationModal
                        showDeleteDocumentConfirmationModal={showDeleteDocumentConfirmationModal}
                        setShowDeleteDocumentConfirmationModal={
                            setShowDeleteDocumentConfirmationModal
                        }
                        setTriggerFlipBookRefetch={setTriggerFlipBookRefetch}
                    />
                )}
                {(showCreateDocumentForm ||
                    showUploadModalInfo.status ||
                    showShareDocumentForm.status ||
                    showPartnerForm ||
                    showDeleteDocumentConfirmationModal.status) && (
                    <div className="fixed inset-0 z-9 h-full w-full bg-black opacity-75" />
                )}

                <NavBar
                    setShowCreateDocumentForm={setShowCreateDocumentForm}
                    setShowPartnerForm={setShowPartnerForm}
                />
                <div className="home_page_container bg-pogo flex h-[90%] w-full items-center justify-evenly">
                    <Flipbook
                        showUploadModalInfo={showUploadModalInfo}
                        setShowUploadModalInfo={setShowUploadModalInfo}
                        triggerFlipBookRefetch={triggerFlipBookRefetch}
                        setTriggerFlipBookRefetch={setTriggerFlipBookRefetch}
                        setShowShareDocumentForm={setShowShareDocumentForm}
                        setShowDeleteDocumentConfirmationModal={
                            setShowDeleteDocumentConfirmationModal
                        }
                    />
                </div>
            </UserContext.Provider>
        </div>
    );
}
