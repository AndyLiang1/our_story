import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrashAlt } from 'react-icons/fa';
import { IoMdCloudUpload } from 'react-icons/io';
import { getDocument } from '../apis/documentApi';
import { deleteDocumentImages, getGeneratedDownloadImageSignedUrls } from '../apis/imageApi';
import { useUserContext } from '../context/userContext';
import { UploadImageModalInfo } from '../types/ModalInfoTypes';
import { DocumentData } from '../types/DocumentTypes';

export interface IImageCarouselProps {
    document: DocumentData;
    showUploadModalInfo: UploadImageModalInfo;
    setShowUploadModalInfo: React.Dispatch<React.SetStateAction<UploadImageModalInfo>>;
}

enum DIRECTION {
    LEFT = 'left',
    RIGHT = 'right'
}

export function ImageCarousel({
    document,
    showUploadModalInfo,
    setShowUploadModalInfo
}: IImageCarouselProps) {
    const user = useUserContext();
    const { collabToken } = user;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [signedImageUrlsWithGuidNames, setSignedImageUrlsWithGuidNames] = useState<
        { signedImageUrl: string; imageNameWithGuid: string }[]
    >([]);
    const DEFAULT_IMG_URL = '/autumn-landscape-building-city-blue-600nw-2174533935.png';

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
                const doc = await getDocument(document.documentId, collabToken);
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
        await deleteDocumentImages(collabToken, imageNameWithGuidToDelete, document.documentId);
    };

    return (
        <div className={`relative h-full w-full flex-col items-center justify-evenly text-center`}>
            <div className="relative box-border flex h-[90%] w-full items-center overflow-hidden rounded-t-[2.5rem] border-x-2 border-t-2 border-gray-100 text-center">
                {signedImageUrlsWithGuidNames.length && (
                    <button
                        onClick={() => {
                            changeIndex(DIRECTION.LEFT);
                        }}
                        className="absolute top-[50%] left-2 z-[3] translate-x-0 translate-y-[-50%] transform"
                    >
                        <FaChevronLeft className="text-[2rem]" />
                    </button>
                )}
                {signedImageUrlsWithGuidNames.length && (
                    <button
                        onClick={() => {
                            changeIndex(DIRECTION.RIGHT);
                        }}
                        className="absolute top-[50%] right-2 z-[3] translate-x-0 translate-y-[-50%] transform"
                    >
                        <FaChevronRight className="text-[2rem]" />
                    </button>
                )}
                <img
                    src={
                        signedImageUrlsWithGuidNames.length
                            ? signedImageUrlsWithGuidNames[currentIndex].signedImageUrl
                            : DEFAULT_IMG_URL
                    }
                    className="absolute z-[2] h-full w-full object-contain"
                    alt=""
                />
                <img
                    src={
                        signedImageUrlsWithGuidNames.length
                            ? signedImageUrlsWithGuidNames[currentIndex].signedImageUrl
                            : DEFAULT_IMG_URL
                    }
                    className="absolute inset-0 z-[1] h-full w-full overflow-hidden rounded-t-[2.5rem] bg-center object-cover opacity-70 blur-sm"
                    alt=""
                />
            </div>

            <div className="flex h-[10%] w-full items-center justify-between bg-red-200">
                <button
                    onClick={() => {
                        setShowUploadModalInfo({
                            documentId: document.documentId,
                            status: true,
                            refetch: false
                        });
                    }}
                    className={
                        'mt-0 h-full ' +
                        (signedImageUrlsWithGuidNames && signedImageUrlsWithGuidNames.length > 0
                            ? 'w-[10rem]'
                            : 'w-full') +
                        ' bg-red-200 p-[0.6rem] text-[0.9rem] transition duration-200 hover:bg-white' +
                        ' flex items-center justify-center text-center'
                    }
                >
                    {signedImageUrlsWithGuidNames && signedImageUrlsWithGuidNames.length > 0 ? (
                        <div className="flex items-center justify-center text-center">
                            Upload images&nbsp;
                            <IoMdCloudUpload className="text-[1rem]" />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center text-center">
                            Add your first image&nbsp;
                            <IoMdCloudUpload className="text-[1rem]" />
                        </div>
                    )}
                </button>
                <div className="flex h-full w-[30%] justify-center">
                    <button
                        onClick={handleDeleteImageButtonClicked}
                        className="flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-white"
                    >
                        <FaTrashAlt className="text-[1rem]" />
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
