import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getGeneratedDownloadImageSignedUrls } from '../apis/imageApi';
import { UploadImageModal } from './Modals/UploadImageModal';

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [signedImageUrls, setSignedImageUrls] = useState<string[]>([]);
    const [showUploadImageModal, setShowUploadImageModal] = useState<boolean>(false);

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

    return (
        <div className={`${height} ${width} relative`}>
            <button
                onClick={() => {
                    changeIndex(DIRECTION.LEFT);
                }}
                className="absolute left-2 top-[50%] translate-x-0 translate-y-[-50%] transform"
            >
                <FaChevronLeft />
            </button>
            <button
                onClick={() => {
                    changeIndex(DIRECTION.RIGHT);
                }}
                className="absolute right-2 top-[50%] translate-x-0 translate-y-[-50%] transform"
            >
                <FaChevronRight />
            </button>
            {signedImageUrls && signedImageUrls.length && (
                <img src={signedImageUrls[currentIndex]} className="h-full w-full object-cover" />
            )}
            {/* <input
                type="file"
                multiple
                accept="image/*"
                onChange={(event: any) => setImagesToUpload(event.target.files)}
            />
            <button onClick={uploadImages}>Upload</button> */}
            <button
                onClick={() => {
                    setShowUploadImageModal(true);
                }}
            >
                Upload images
            </button>
            {showUploadImageModal && (
                <UploadImageModal
                    setShowUploadImageModal={setShowUploadImageModal}
                    collabToken={collabToken}
                    documentId={documentId}
                    imageNames={imageNames}
                    setImageNames={setImageNames}
                />
            )}
        </div>
    );
}
