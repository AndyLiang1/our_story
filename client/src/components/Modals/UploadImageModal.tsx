import axios from 'axios';
import * as React from 'react';
import { useRef, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { editDocumentImages } from '../../apis/documentApi';
import { getGeneratedUploadImageSignedUrls } from '../../apis/imageApi';
import { GenericFormButton } from '../GenericFormButton';

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
    const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const selectFiles = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const uploadImages = async () => {
        if (!imagesToUpload) return;
        const imageToUploadNames = imagesToUpload.map((image: File) => image.name);
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

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
        event.dataTransfer.dropEffect = 'copy';
    };

    const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const newFiles = Array.from(event.dataTransfer.files as FileList);
        setImagesToUpload([...imagesToUpload, ...newFiles]);
    };

    return (
        <div className="center-of-page z-10 flex h-[70%] w-[50%] flex-col items-center justify-evenly bg-white">
            <IoIosClose
                className="absolute right-2 top-2 cursor-pointer text-[2rem]"
                onClick={() => setShowUploadImageModal(false)}
            ></IoIosClose>
            <div className="flex h-[10%] w-full items-center justify-center text-center text-[1.5rem] font-bold">
                Upload your images
            </div>
            <div
                className={
                    'flex w-[90%] items-center justify-center border-[0.1rem] border-dashed border-[#dbbf63] text-center' +
                    (imagesToUpload && imagesToUpload.length ? ' h-[50%]' : ' h-[70%]')
                }
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {isDragging ? (
                    <span>Drop images here</span>
                ) : (
                    <>
                        Drag and drop images here or
                        <span className="text-[#cca524]" role="button" onClick={selectFiles}>
                            &nbsp;Browse
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
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const newFiles = Array.from(event.target.files as FileList);
                        setImagesToUpload([...imagesToUpload, ...newFiles]);
                    }}
                ></input>
            </div>
            <div
                className={
                    `overflow-x-auto whitespace-nowrap w-[90%] text-[0px]` +
                    (imagesToUpload && imagesToUpload.length ? ' h-[20%]' : ' hidden')
                }
            >
                {imagesToUpload &&
                    imagesToUpload.map((image: File, index: number) => (
                        <div className="h-full inline-block whitespace-normal mr-[2rem]">
                            {/* <span>&times;</span> */}
                            <img className="h-full w-full object-contain"src={URL.createObjectURL(image)} alt={image.name} ></img>
                        </div>
                    ))}
            </div>
            <GenericFormButton
                displayMessage="Upload image(s)"
                onClick={async () => {
                    await uploadImages();
                    setShowUploadImageModal(false);
                }}
            />
        </div>
    );
}
