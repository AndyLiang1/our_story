import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/userContext';
import { ShareDocumentFormInfo } from '../types/DocumentTypes';

export interface INavBarProps {
    setShowCreateDocumentForm: React.Dispatch<React.SetStateAction<boolean>>;
    setShowShareDocumentForm: React.Dispatch<React.SetStateAction<ShareDocumentFormInfo>>;
}

export function NavBar({ setShowCreateDocumentForm, setShowShareDocumentForm }: INavBarProps) {
    const navigate = useNavigate();
    const user = useUserContext();

    return (
        <div className="flex h-[10%] w-full bg-pink-100">
            <div
                className="flex h-full w-[15%] cursor-pointer items-center justify-center text-center font-['Tangerine'] text-[3.5rem] hover:bg-red-200"
                onClick={() => {
                    navigate('/home', {
                        state: {
                            user: user
                        }
                    });
                }}
            >
                Our Story
            </div>
            <div
                className="flex h-full w-[10%] cursor-pointer items-center justify-center text-center text-[1.2rem] hover:bg-white"
                onClick={() => {
                    navigate('/stories', { state: { user: user } });
                }}
            >
                Stories
            </div>
            <div
                className="flex h-full w-[10%] cursor-pointer items-center justify-center text-center text-[1.2rem] hover:bg-white"
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
