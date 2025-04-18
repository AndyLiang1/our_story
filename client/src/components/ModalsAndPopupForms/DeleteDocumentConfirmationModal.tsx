import * as React from 'react';
import { IoIosClose } from 'react-icons/io';
import { deleteDocument } from '../../apis/documentApi';
import { useUserContext } from '../../context/userContext';
import { DeleteDocumentConfirmationModalInfo } from '../../types/DocumentTypes';
import { GenericFormButton } from '../GenericFormButton';

export interface IDeleteDocumentConfirmationModalProps {
    showDeleteDocumentConfirmationModal: DeleteDocumentConfirmationModalInfo;
    setShowDeleteDocumentConfirmationModal: React.Dispatch<
        React.SetStateAction<DeleteDocumentConfirmationModalInfo>
    >;
}

export function DeleteDocumentConfirmationModal({
    showDeleteDocumentConfirmationModal,
    setShowDeleteDocumentConfirmationModal
}: IDeleteDocumentConfirmationModalProps) {
    const user = useUserContext();
    const { collabToken } = user;
    const handleDeleteButtonClicked = async () => {
        await deleteDocument(collabToken, showDeleteDocumentConfirmationModal.documentId);
    };
    return (
        <div className="center-of-page z-10 flex h-[30%] w-[30%] justify-center bg-white">
            <IoIosClose
                className="absolute top-2 right-2 cursor-pointer text-[2rem]"
                onClick={() => setShowDeleteDocumentConfirmationModal(false)}
            ></IoIosClose>
            <div className="flex h-full w-[90%] flex-col items-center justify-center text-center">
                <div className="text-[1.5rem] font-bold">
                    Are you sure you want to delete this document?
                </div>
                <div className="flex h-[50%] w-full items-center justify-around">
                    <GenericFormButton
                        displayMessage="Yes"
                        onClick={handleDeleteButtonClicked}
                    ></GenericFormButton>
                    <GenericFormButton
                        displayMessage="No"
                        onClick={() => setShowDeleteDocumentConfirmationModal(false)}
                    ></GenericFormButton>
                </div>
            </div>
        </div>
    );
}
