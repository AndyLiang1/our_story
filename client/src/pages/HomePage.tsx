import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavBar } from '../components/Navbar';

import { Flipbook } from '../components/Flipbook';
import { CreateDocumentForm } from '../components/ModalsAndPopupForms/CreateDocumentForm';
import { ShareDocumentForm } from '../components/ModalsAndPopupForms/ShareDocumentForm';
import { UploadImageModal } from '../components/ModalsAndPopupForms/UploadImageModal';
import { ShareDocumentFormInfo, UploadImageModalInfo } from '../types/DocumentTypes';
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
    const [showShareDocumentForm, setShowShareDocumentForm] = useState<ShareDocumentFormInfo>({
        documentId: '',
        documentTitle: '',
        status: false
    });
    const [triggerFlipBookRefetch, setTriggerFlipBookRefetch] = useState<string>('');

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
                    setTriggerFlipBookRefetch={setTriggerFlipBookRefetch}
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
            {showShareDocumentForm.status && user && (
                <ShareDocumentForm
                    userId={user.userId}
                    collabToken={user.collabToken}
                    showShareDocumentForm={showShareDocumentForm}
                    setShowShareDocumentForm={setShowShareDocumentForm}
                />
            )}
            <NavBar
                setShowCreateDocumentForm={setShowCreateDocumentForm}
                setShowShareDocumentForm={setShowShareDocumentForm}
            />
            <div className="home_page_container bg-pogo flex h-[90%] w-full items-center justify-evenly">
                <Flipbook
                    user={user}
                    showUploadModalInfo={showUploadModalInfo}
                    setShowUploadModalInfo={setShowUploadModalInfo}
                    triggerFlipBookRefetch={triggerFlipBookRefetch}
                    setTriggerFlipBookRefetch={setTriggerFlipBookRefetch}
                    setShowShareDocumentForm={setShowShareDocumentForm}
                />
            </div>
        </div>
    );
}
