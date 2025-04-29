import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrashAlt } from 'react-icons/fa';
import { IoMdCloudUpload } from 'react-icons/io';
import { getDocument } from '../apis/documentApi';
import { deleteDocumentImages, getGeneratedDownloadImageSignedUrls } from '../apis/imageApi';
import { useUserContext } from '../context/userContext';
import { DocumentData } from '../types/DocumentTypes';
import { UploadImageModalInfo } from '../types/ModalInfoTypes';

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
    const [signedImageUrlsWGuidNamesWDisplayValues, setSignedImageUrlsWGuidNamesWDisplayValues] =
        useState<{ signedImageUrl: string; imageNameWithGuid: string; onDisplay: boolean }[]>([]);
    const DEFAULT_IMG_URL = '/autumn-landscape-building-city-blue-600nw-2174533935.png';
    const [showDeleteConfirmationButton, setShowDeleteConfirmationButton] = useState(false);
    useEffect(() => {
        getAndSetSignedImageUrls(null, document.documentId, 0);
    }, []);

    const getAndSetSignedImageUrls = async (
        imagesNameWGuid: string[] | null,
        documentId: string,
        indexToDisplay: number
    ) => {
        const listOfImageNamesWithGuid = imagesNameWGuid ? imagesNameWGuid : document.images;
        const { signedDownloadUrls } = await getGeneratedDownloadImageSignedUrls(
            collabToken,
            documentId,
            listOfImageNamesWithGuid
        );

        const result = listOfImageNamesWithGuid.map((imageNameWithGuid: string, index: number) => ({
            signedImageUrl: signedDownloadUrls[index],
            imageNameWithGuid,
            onDisplay: index === indexToDisplay
        }));
        setSignedImageUrlsWGuidNamesWDisplayValues(result);
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
                const indexToBe = signedImageUrlsWGuidNamesWDisplayValues.length;
                const doc = await getDocument(document.documentId, collabToken);
                getAndSetSignedImageUrls(doc.images, document.documentId, indexToBe);
                resetUploadImageModalStateToInitial();
            }
        };
        fetchDocumentAndPopulateImagesForCurrentCarousel();
    }, [showUploadModalInfo]);

    const changeIndex = (direction: DIRECTION) => {
        const signedImageUrlsWithGuidNamesWithUpdatedDisplayValues = [
            ...signedImageUrlsWGuidNamesWDisplayValues
        ];
        const totalLength = signedImageUrlsWithGuidNamesWithUpdatedDisplayValues.length;
        if (direction === DIRECTION.LEFT) {
            for (const [
                index,
                imageInfo
            ] of signedImageUrlsWithGuidNamesWithUpdatedDisplayValues.entries()) {
                if (imageInfo.onDisplay) {
                    signedImageUrlsWithGuidNamesWithUpdatedDisplayValues[index].onDisplay = false;
                    if (!index) {
                        signedImageUrlsWithGuidNamesWithUpdatedDisplayValues[
                            totalLength - 1
                        ].onDisplay = true;
                    } else {
                        signedImageUrlsWithGuidNamesWithUpdatedDisplayValues[index - 1].onDisplay =
                            true;
                    }
                    break;
                }
            }
        } else {
            for (const [
                index,
                imageInfo
            ] of signedImageUrlsWithGuidNamesWithUpdatedDisplayValues.entries()) {
                if (imageInfo.onDisplay) {
                    signedImageUrlsWithGuidNamesWithUpdatedDisplayValues[index].onDisplay = false;
                    if (index === totalLength - 1) {
                        signedImageUrlsWithGuidNamesWithUpdatedDisplayValues[0].onDisplay = true;
                    } else {
                        signedImageUrlsWithGuidNamesWithUpdatedDisplayValues[index + 1].onDisplay =
                            true;
                    }
                    break;
                }
            }
        }
        setSignedImageUrlsWGuidNamesWDisplayValues([
            ...signedImageUrlsWithGuidNamesWithUpdatedDisplayValues
        ]);
    };

    const handleDeleteImageButtonClicked = async () => {
        const currentlyDisplayedImageInfo = getCurrentlyDisplayedImageInfo();
        const indexToDelete = currentlyDisplayedImageInfo.index;
        const imageNameWithGuidToDelete = currentlyDisplayedImageInfo.imageNameWithGuid;
        const updatedSignedImageUrlsWithGuidNames = signedImageUrlsWGuidNamesWDisplayValues.filter(
            (_, index) => index !== indexToDelete
        );
        if (updatedSignedImageUrlsWithGuidNames.length) {
            if (indexToDelete === 0) {
                updatedSignedImageUrlsWithGuidNames[0].onDisplay = true;
            } else {
                updatedSignedImageUrlsWithGuidNames[indexToDelete - 1].onDisplay = true;
            }
        }
        setSignedImageUrlsWGuidNamesWDisplayValues(updatedSignedImageUrlsWithGuidNames);
        setShowDeleteConfirmationButton(false)
        await deleteDocumentImages(collabToken, imageNameWithGuidToDelete, document.documentId);
    };

    const getCurrentlyDisplayedImageInfo = () => {
        if (!signedImageUrlsWGuidNamesWDisplayValues.length)
            return {
                imageNameWithGuid: '',
                signedImageUrl: DEFAULT_IMG_URL,
                index: 0
            };
        for (const [index, imageInfo] of signedImageUrlsWGuidNamesWDisplayValues.entries()) {
            if (imageInfo.onDisplay) {
                return {
                    imageNameWithGuid: imageInfo.imageNameWithGuid,
                    signedImageUrl: imageInfo.signedImageUrl,
                    index
                };
            }
        }
        return {
            imageNameWithGuid: '',
            signedImageUrl: DEFAULT_IMG_URL,
            index: 0
        };
    };

    return (
        <div className={`relative h-full w-full flex-col items-center justify-evenly text-center`}>
            <div className="relative box-border flex h-[90%] w-full items-center overflow-hidden rounded-t-[2.5rem] border-x-2 border-t-2 border-gray-100 text-center">
                {signedImageUrlsWGuidNamesWDisplayValues.length && (
                    <button
                        onClick={() => {
                            changeIndex(DIRECTION.LEFT);
                        }}
                        className="absolute top-[50%] left-2 z-[3] translate-x-0 translate-y-[-50%] transform"
                    >
                        <FaChevronLeft className="text-[2rem]" />
                    </button>
                )}
                {signedImageUrlsWGuidNamesWDisplayValues.length && (
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
                    src={getCurrentlyDisplayedImageInfo().signedImageUrl}
                    className="absolute z-[2] h-full w-full object-contain"
                    alt=""
                />
                <img
                    src={getCurrentlyDisplayedImageInfo().signedImageUrl}
                    className="absolute inset-0 z-[1] h-full w-full overflow-hidden rounded-t-[2.5rem] bg-center object-cover opacity-70 blur-sm"
                    alt=""
                />
            </div>

            <div className="flex h-[10%] w-full items-center justify-around bg-red-200">
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
                        (signedImageUrlsWGuidNamesWDisplayValues &&
                        signedImageUrlsWGuidNamesWDisplayValues.length > 0
                            ? 'w-[10rem]'
                            : 'w-full') +
                        ' bg-red-200 p-[0.6rem] text-[0.9rem] transition duration-200 hover:bg-white' +
                        ' flex items-center justify-center text-center'
                    }
                >
                    {signedImageUrlsWGuidNamesWDisplayValues &&
                    signedImageUrlsWGuidNamesWDisplayValues.length > 0 ? (
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

                {signedImageUrlsWGuidNamesWDisplayValues &&
                    signedImageUrlsWGuidNamesWDisplayValues.length > 0 && (
                        <div className="flex h-full w-[30%] justify-center">
                            <div className="flex flex-col h-full w-[50%] items-center justify-end">
                                {showDeleteConfirmationButton && (
                                    <button
                                        className="rounded bg-red-500 p-2 text-white z-10"
                                        onClick={handleDeleteImageButtonClicked}
                                    >
                                        Delete
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowDeleteConfirmationButton(!showDeleteConfirmationButton)}
                                    className="flex aspect-square h-full min-h-full items-center justify-center text-center transition duration-200 hover:bg-white"
                                >
                                    <FaTrashAlt className="text-[1rem]" />
                                </button>
                            </div>
                            <div className="flex h-full w-[50%] items-center justify-center">
                                {getCurrentlyDisplayedImageInfo().index +
                                    1 +
                                    '/' +
                                    signedImageUrlsWGuidNamesWDisplayValues.length}
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}
