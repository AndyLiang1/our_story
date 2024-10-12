import axios from 'axios';
import { useEffect, useState } from 'react';
import { editDocumentImages } from '../apis/documentApi';
import {
    getGeneratedDownloadImageSignedUrls,
    getGeneratedUploadImageSignedUrls
} from '../apis/imageApi';

export interface IImageCarouselProps {
    collabToken: string;
    documentId: string;
    setImageNames: React.Dispatch<React.SetStateAction<string[]>>;
    imageNames: string[];
    height: string;
    width: string;
}

enum DIRECTION {
    LEFT = 'left',
    RIGHT = 'right'
}

export function ImageCarousel({
    collabToken,
    documentId,
    imageNames,
    setImageNames,
    height,
    width
}: IImageCarouselProps) {
    const [imagesToUpload, setImagesToUpload] = useState<FileList | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [signedImageUrls, setSignedImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const getSignedImageUrls = async () => {
            const { signedDownloadUrls } = await getGeneratedDownloadImageSignedUrls(
                collabToken,
                imageNames
            );
            setSignedImageUrls(signedDownloadUrls);
        };
        getSignedImageUrls();
    }, [imageNames]);

    const changeIndex = (direction: DIRECTION) => {
        if (direction === DIRECTION.LEFT) {
            setCurrentIndex(currentIndex !== 0 ? currentIndex - 1 : signedImageUrls.length - 1);
        } else {
            setCurrentIndex(currentIndex !== signedImageUrls.length - 1 ? currentIndex + 1 : 0);
        }
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
        <div className={`${height} ${width} relative`}>
            <div
                onClick={() => {
                    changeIndex(DIRECTION.LEFT);
                }}
                className="absolute left-2 top-[50%] translate-x-0 translate-y-[-50%] transform"
            >
                L
            </div>
            <div
                onClick={() => {
                    changeIndex(DIRECTION.RIGHT);
                }}
                className="absolute right-2 top-[50%] translate-x-0 translate-y-[-50%] transform"
            >
                R
            </div>
            {signedImageUrls && signedImageUrls.length && (
                <img src={signedImageUrls[currentIndex]} className="h-full w-full object-cover" />
            )}
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={(event: any) => setImagesToUpload(event.target.files)}
            />
            <button onClick={uploadImages}>Upload</button>
        </div>
    );
}
