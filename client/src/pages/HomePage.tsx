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
                    showUploadModalInfo={showUploadModalInfo}
                    setShowUploadModalInfo={setShowUploadModalInfo}
                />
            </div>
        </div>
    );
}
