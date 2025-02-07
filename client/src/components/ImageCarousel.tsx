import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrashAlt } from 'react-icons/fa';
import { IoMdCloudUpload } from 'react-icons/io';
import { getDocument } from '../apis/documentApi';
import { deleteDocumentImages, getGeneratedDownloadImageSignedUrls } from '../apis/imageApi';
import { DocumentData, UploadImageModalInfo } from '../types/DocumentTypes';
import { GenericFormButton } from './GenericFormButton';

export interface IImageCarouselProps {
    userId: string;
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
    userId,
    collabToken,
    document,
    showUploadModalInfo,
    setShowUploadModalInfo
}: IImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [signedImageUrlsWithGuidNames, setSignedImageUrlsWithGuidNames] = useState<
        { signedImageUrl: string; imageNameWithGuid: string }[]
    >([]);

    useEffect(() => {
        getSignedImageUrls();
    }, []);

    const getSignedImageUrls = async (imagesNameWGuid?: string[]) => {
        const listOfImageNamesWithGuid = imagesNameWGuid ? imagesNameWGuid : document.images;
        const { signedDownloadUrls } = await getGeneratedDownloadImageSignedUrls(
            collabToken,
            listOfImageNamesWithGuid
        );

        const result = listOfImageNamesWithGuid.map((imageNameWithGuid: string, index: number) => ({
            signedImageUrl: signedDownloadUrls[index],
            imageNameWithGuid
        }));
        setSignedImageUrlsWithGuidNames(result);
    };

    const resetUploadImageModalStateToInitial = () => {
        setShowUploadModalInfo({ documentId: '', status: false, refetch: false });
    };

    useEffect(() => {
        // only refetch the images for a single imageCarousel, as opposed to all 8 carousels
        const fetchDocumentAndPopulateImagesForCurrentCarousel = async () => {
            if (
                showUploadModalInfo.documentId === document.documentId &&
                showUploadModalInfo.refetch
            ) {
                const indexToBe = signedImageUrlsWithGuidNames.length;
                const doc = await getDocument(document.documentId, collabToken, userId);
                await getSignedImageUrls(doc.images);
                resetUploadImageModalStateToInitial();
                setCurrentIndex(indexToBe);
            }
        };
        fetchDocumentAndPopulateImagesForCurrentCarousel();
    }, [showUploadModalInfo]);

    const changeIndex = (direction: DIRECTION) => {
        if (direction === DIRECTION.LEFT) {
            setCurrentIndex(
                currentIndex !== 0 ? currentIndex - 1 : signedImageUrlsWithGuidNames.length - 1
            );
        } else {
            setCurrentIndex(
                currentIndex !== signedImageUrlsWithGuidNames.length - 1 ? currentIndex + 1 : 0
            );
        }
    };

    const handleDeleteImageButtonClicked = async () => {
        const imageNameWithGuidToDelete =
            signedImageUrlsWithGuidNames[currentIndex].imageNameWithGuid;
        const updatedSignedImageUrlsWithGuidNames = signedImageUrlsWithGuidNames.filter(
            (signedImageUrlWImageGuidName) =>
                signedImageUrlWImageGuidName.imageNameWithGuid !== imageNameWithGuidToDelete
        );
        setSignedImageUrlsWithGuidNames(updatedSignedImageUrlsWithGuidNames);
        setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0);
        await deleteDocumentImages(
            userId,
            collabToken,
            imageNameWithGuidToDelete,
            document.documentId
        );
    };

    return (
        <div className={`relative h-full w-full flex-col items-center justify-evenly text-center`}>
            {signedImageUrlsWithGuidNames && signedImageUrlsWithGuidNames.length > 0 ? (
                <div className="relative h-[90%] w-full overflow-hidden rounded-t-[2.5rem] border-l border-r border-t">
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
                        src={signedImageUrlsWithGuidNames[currentIndex].signedImageUrl}
                        className="absolute z-[2] h-full w-full object-contain"
                        alt=""
                    />
                    <img
                        src={signedImageUrlsWithGuidNames[currentIndex].signedImageUrl}
                        className="absolute inset-0 z-[1] h-full w-full overflow-hidden rounded-t-[2.5rem] bg-center object-cover opacity-70 blur-sm"
                        alt=""
                    />
                </div>
            ) : (
                <div className="relative h-[90%] w-full overflow-hidden rounded-t-[2.5rem] border-l border-r border-t">
                    <img
                        src="/autumn-landscape-building-city-blue-600nw-2174533935.png"
                        className="absolute z-[2] h-full w-full object-contain"
                        alt=""
                    />
                    <img
                        src="/autumn-landscape-building-city-blue-600nw-2174533935.png"
                        className="absolute inset-0 z-[1] h-full w-full overflow-hidden rounded-t-[2.5rem] bg-center object-cover opacity-70 blur-sm"
                        alt=""
                    />
                </div>
            )}
            <div className="flex h-[10%] w-full items-center justify-between bg-red-200">
                <GenericFormButton
                    // className="flex h-full w-[50%] items-center justify-start  pl-2"
                    onClick={() => {
                        setShowUploadModalInfo({
                            documentId: document.documentId,
                            status: true,
                            refetch: false
                        });
                    }}
                    displayMessage={
                        signedImageUrlsWithGuidNames && signedImageUrlsWithGuidNames.length > 0 ? (
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
                        'h-full ' +
                        (signedImageUrlsWithGuidNames && signedImageUrlsWithGuidNames.length > 0
                            ? 'w-[10rem]'
                            : 'w-full') +
                        ' ' +
                        'transition duration-200 hover:bg-white'
                    }
                    bold={false}
                    backgroundColor="bg-red-200"
                    fontSize="text-[0.9rem]"
                    textColor="text-black"
                    padding="p-[0.6rem]"
                    rounded={false}
                ></GenericFormButton>
                <div className="flex h-full w-[30%] justify-center">
                    <button
                        onClick={handleDeleteImageButtonClicked}
                        className="flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-white"
                    >
                        <FaTrashAlt />
                    </button>
                    {signedImageUrlsWithGuidNames && signedImageUrlsWithGuidNames.length > 0 && (
                        <div className="flex h-full w-[40%] items-center justify-end">
                            {currentIndex + 1 + '/' + signedImageUrlsWithGuidNames.length}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
