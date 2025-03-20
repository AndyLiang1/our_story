import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/userContext';

export interface INavBarProps {
    setShowCreateDocumentForm: React.Dispatch<React.SetStateAction<boolean>>;
    setShowShareAllDocumentsForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavBar({ setShowCreateDocumentForm, setShowShareAllDocumentsForm }: INavBarProps) {
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
            <div
                className="flex h-full w-[10%] cursor-pointer items-center justify-center text-center text-[1.2rem] hover:bg-white"
                onClick={() => {
                    setShowShareAllDocumentsForm(true);
                }}
            >
                Share All
            </div>
        </div>
    );
}
