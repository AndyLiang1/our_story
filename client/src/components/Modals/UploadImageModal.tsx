import axios from 'axios';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { AiTwotoneCloseCircle } from 'react-icons/ai';
import { IoIosClose } from 'react-icons/io';
import { editDocumentImages } from '../../apis/documentApi';
import { getGeneratedUploadImageSignedUrls } from '../../apis/imageApi';
import { GenericFormButton } from '../GenericFormButton';
import { UploadImageModalInfo } from '../../types/DocumentTypes';

export interface IUploadImageModalProps {
    collabToken: string;
    showUploadModalInfo: UploadImageModalInfo;
    setShowUploadModalInfo: React.Dispatch<React.SetStateAction<UploadImageModalInfo>>;
}

export function UploadImageModal({
    collabToken,
    showUploadModalInfo,
    setShowUploadModalInfo,
}: IUploadImageModalProps) {
    const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const {currentImageNamesWGuidForDocument} = showUploadModalInfo
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const {documentId} = showUploadModalInfo

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
            [...currentImageNamesWGuidForDocument, ...newImageNamesWithGuid],
            documentId
        );
        // setImageNames([...currentImageNamesWGuidForDocument, ...newImageNamesWithGuid]);
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
        <div className="center-of-page z-10 flex h-[85%] w-[50%] flex-col items-center justify-evenly bg-white">
            <IoIosClose
                className="absolute right-2 top-2 cursor-pointer text-[2rem]"
                onClick={() => setShowUploadModalInfo({ documentId: '', status: false, currentImageNamesWGuidForDocument: [] })}
            ></IoIosClose>
            <div className="flex h-[10%] w-full items-center justify-center text-center text-[1.5rem] font-bold">
                Upload your images
            </div>
            <div
                className={
                    'flex w-[90%] items-center justify-center border-[0.1rem] border-dashed border-[#dbbf63] text-center' +
                    (imagesToUpload && imagesToUpload.length ? ' h-[40%]' : ' h-[70%]')
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
                        event.target.value = '';
                    }}
                ></input>
            </div>
            <div
                className={
                    `w-[90%] items-center overflow-x-auto whitespace-nowrap pl-[0.5rem] text-[0px]` +
                    (imagesToUpload && imagesToUpload.length ? ' h-[30%]' : ' hidden')
                }
            >
                {imagesToUpload &&
                    imagesToUpload.map((image: File, index: number) => (
                        <div className="relative mr-[2rem] inline-block h-full whitespace-normal">
                            <div className="flex h-full items-center justify-center text-center">
                                <div className="relative h-[75%] transform transition-transform duration-300 ease-in-out hover:scale-110">
                                    <AiTwotoneCloseCircle
                                        className="absolute right-[-0.8rem] top-[-0.8rem] cursor-pointer text-[1.6rem]"
                                        onClick={() => {
                                            setImagesToUpload(
                                                imagesToUpload.filter((_, i) => i !== index)
                                            );
                                        }}
                                    />
                                    <img
                                        className="h-full w-full object-contain"
                                        src={URL.createObjectURL(image)}
                                        alt={image.name}
                                    ></img>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <GenericFormButton
                displayMessage="Upload image(s)"
                onClick={async () => {
                    await uploadImages();
                    setShowUploadModalInfo({ documentId: '', status: false, currentImageNamesWGuidForDocument: [] });
                }}
            />
        </div>
    );
}
