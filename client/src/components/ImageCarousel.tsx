import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoMdCloudUpload } from 'react-icons/io';
import { getGeneratedDownloadImageSignedUrls } from '../apis/imageApi';
import { DocumentData, UploadImageModalInfo } from '../types/DocumentTypes';
import { GenericFormButton } from './GenericFormButton';

export interface IImageCarouselProps {
    collabToken: string;
    document: DocumentData;
    showUploadModalInfo: UploadImageModalInfo;
    setShowUploadModalInfo: React.Dispatch<React.SetStateAction<UploadImageModalInfo>>;
}

enum DIRECTION {
    LEFT = 'left',
    RIGHT = 'right'
}

export function ImageCarousel({
    collabToken,
    document,
    showUploadModalInfo,
    setShowUploadModalInfo
}: IImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [signedImageUrls, setSignedImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const getSignedImageUrls = async () => {
            const { signedDownloadUrls } = await getGeneratedDownloadImageSignedUrls(
                collabToken,
                document.images
            );
            setSignedImageUrls(signedDownloadUrls);
        };
        getSignedImageUrls();
    }, []);

    const changeIndex = (direction: DIRECTION) => {
        if (direction === DIRECTION.LEFT) {
            setCurrentIndex(currentIndex !== 0 ? currentIndex - 1 : signedImageUrls.length - 1);
        } else {
            setCurrentIndex(currentIndex !== signedImageUrls.length - 1 ? currentIndex + 1 : 0);
        }
    };

    return (
        <div className={`relative h-full w-full flex-col items-center justify-evenly text-center`}>
            {signedImageUrls && signedImageUrls.length > 0 ? (
                <div className="relative h-[90%] w-full rounded-[2.5rem] border">
                    <button
                        onClick={() => {
                            changeIndex(DIRECTION.LEFT);
                        }}
                        className="absolute left-2 top-[50%] z-[3] translate-x-0 translate-y-[-50%] transform"
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={() => {
                            changeIndex(DIRECTION.RIGHT);
                        }}
                        className="absolute right-2 top-[50%] z-[3] translate-x-0 translate-y-[-50%] transform"
                    >
                        <FaChevronRight />
                    </button>
                    <img
                        src={signedImageUrls[currentIndex]}
                        className="absolute z-[2] h-full w-full object-contain"
                        alt=""
                    />
                    <img
                        src={signedImageUrls[currentIndex]}
                        className="absolute inset-0 z-[1] h-full w-full overflow-hidden rounded-[2.5rem] border bg-center object-cover opacity-70 blur-sm"
                        alt=""
                    />
                </div>
            ) : (
                <div className="relative h-[90%] w-full overflow-hidden rounded-[2.5rem] border border-none">
                    <img
                        src="/autumn-landscape-building-city-blue-600nw-2174533935.png"
                        className="absolute z-[2] h-full w-full object-contain"
                        alt=""
                    />
                    <img
                        src="/autumn-landscape-building-city-blue-600nw-2174533935.png"
                        className="absolute inset-0 z-[1] h-full w-full overflow-hidden rounded-[2.5rem] border bg-center object-cover opacity-70 blur-sm"
                        alt=""
                    />
                </div>
            )}
            <div className="flex h-[10%] w-full items-center justify-between px-2">
                <GenericFormButton
                    // className="flex h-full w-[50%] items-center justify-start  pl-2"
                    onClick={() => {
                        setShowUploadModalInfo({
                            documentId: document.documentId,
                            status: true,
                            currentImageNamesWGuidForDocument: []
                        });
                    }}
                    displayMessage={
                        signedImageUrls && signedImageUrls.length > 0 ? (
                            <>
                                Upload images&nbsp;
                                <IoMdCloudUpload />
                            </>
                        ) : (
                            <>
                                Add your first image&nbsp;
                                <IoMdCloudUpload />
                            </>
                        )
                    }
                    styles={
                        'h-[90%] ' +
                        (signedImageUrls && signedImageUrls.length > 0 ? 'w-[10rem]' : 'w-full')
                    }
                    bold={false}
                    backgroundColor="bg-[pink]"
                    fontSize="text-[0.9rem]"
                    padding="p-[0.6rem]"
                ></GenericFormButton>
                {signedImageUrls && signedImageUrls.length > 0 && (
                    <div className="flex h-full w-[40%] items-center justify-end">
                        {currentIndex + 1 + '/' + signedImageUrls.length}
                    </div>
                )}
            </div>
        </div>
    );
}
