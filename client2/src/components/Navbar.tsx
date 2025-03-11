import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShareDocumentFormInfo } from '../types/DocumentTypes';
import { User } from '../types/UserTypes';

export interface INavBarProps {
    setShowCreateDocumentForm: React.Dispatch<React.SetStateAction<boolean>>;
    setShowShareDocumentForm: React.Dispatch<React.SetStateAction<ShareDocumentFormInfo>>;
}

export function NavBar({ setShowCreateDocumentForm, setShowShareDocumentForm }: INavBarProps) {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>(useLocation().state);

    return (
        <div className="flex h-[10%] w-full justify-start bg-white">
            <div
                className="flex h-full w-[20%] cursor-pointer items-center justify-start bg-red-200 text-[3rem]"
                onClick={() => {
                    navigate('/home', { state: user });
                }}
            >
                Our Story
            </div>
            <div
                className="flex h-full w-[10%] cursor-pointer items-center justify-center text-center text-[1.2rem]"
                onClick={() => {
                    navigate('/stories', { state: user });
                }}
            >
                Stories
            </div>
            <div
                className="flex h-full w-[10%] cursor-pointer items-center justify-center text-center text-[1.2rem]"
                onClick={() => {
                    setShowCreateDocumentForm(true);
                }}
            >
                Create
            </div>
            {/* <div
                className="flex h-full w-[10%] cursor-pointer items-center justify-center text-center text-[1.2rem]"
                onClick={() => {
                    setShowShareDocumentForm({
                        documentId: '',
                        documentTitle: '',
                        status: true
                    });
                }}
            >
                Share
            </div> */}
        </div>
    );
}
