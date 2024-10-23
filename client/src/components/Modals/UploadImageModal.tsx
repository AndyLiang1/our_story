import axios from 'axios';
import * as React from 'react';
import { useRef, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { editDocumentImages } from '../../apis/documentApi';
import { getGeneratedUploadImageSignedUrls } from '../../apis/imageApi';

export interface IUploadImageModalProps {
    collabToken: string;
    documentId: string;
    imageNames: string[];
    setShowUploadImageModal: React.Dispatch<React.SetStateAction<boolean>>;
    setImageNames: React.Dispatch<React.SetStateAction<string[]>>;
}

export function UploadImageModal({
    collabToken,
    documentId,
    imageNames,
    setShowUploadImageModal,
    setImageNames
}: IUploadImageModalProps) {
    const [imagesToUpload, setImagesToUpload] = useState<FileList | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const selectFiles = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const uploadImages = async () => {
        if (!imagesToUpload) return;
        const imageToUploadNames = Array.from(imagesToUpload).map((image: File) => image.name);
        const signedUrlsAndImageNamesWithGuid = await getGeneratedUploadImageSignedUrls(
            collabToken,
            imageToUploadNames
        );
        const newImageNamesWithGuid = signedUrlsAndImageNamesWithGuid.uniqueImageNames;
        const { signedUploadUrls } = signedUrlsAndImageNamesWithGuid;
        for (const [index, signedUrl] of signedUploadUrls.entries()) {
            const res = await axios.put(signedUrl, imagesToUpload[index], {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
        await editDocumentImages(
            collabToken,
            [...imageNames, ...newImageNamesWithGuid],
            documentId
        );
        setImageNames([...imageNames, ...newImageNamesWithGuid]);
    };

    return (
        <div className="center-of-page flex h-[50%] w-[30%] flex-col items-center justify-evenly bg-white text-center">
            <IoIosClose
                className="absolute right-2 top-2 cursor-pointer text-[2rem]"
                onClick={() => setShowUploadImageModal(false)}
            ></IoIosClose>
            <div className="h-[10%] w-full text-[1.5rem] font-bold">Upload your images</div>
            <div className="h-[70%] w-[90%] border-[0.1rem] border-dashed">
                {isDragging ? (
                    <span>Drop images here</span>
                ) : (
                    <>
                        Drag and drop images here or{' '}
                        <span role="button" onClick={selectFiles}>
                            Browse
                        </span>
                    </>
                )}
                <input
                    name="file"
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setImagesToUpload(event.target.files)
                    }
                ></input>
            </div>
            <div className="image-container">
                {imagesToUpload &&
                    imagesToUpload.map((image, index) => (
                        <div className="">
                            <span>&times;</span>
                            <img src={image.url} alt={image.name}></img>
                        </div>
                    ))}
            </div>
            <button
                type="button"
                onClick={async () => {
                    await uploadImages();
                    setShowUploadImageModal(false);
                }}
            >
                {' '}
                Upload
            </button>
        </div>
    );
}
