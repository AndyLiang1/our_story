import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import BeatLoader from 'react-spinners/BeatLoader';
import { getNeighbouringDocuments } from '../apis/documentApi';
import { useUserContext } from '../context/userContext';
import { DocumentData, ShareDocumentFormInfo, UploadImageModalInfo } from '../types/DocumentTypes';
import { DateCalendar } from './DateCalendar';
import { ImageCarousel } from './ImageCarousel';
import { TipTapCollab } from './TipTapCollab';

export interface IFlipbookProps {
    showUploadModalInfo: UploadImageModalInfo;
    setShowUploadModalInfo: React.Dispatch<React.SetStateAction<UploadImageModalInfo>>;
    triggerFlipBookRefetch: string;
    setTriggerFlipBookRefetch: React.Dispatch<React.SetStateAction<string>>;
    setShowShareDocumentForm: React.Dispatch<React.SetStateAction<ShareDocumentFormInfo>>;
}

enum PAGE_STYLE_POSSIBLE_STATES {
    'INITIAL' = 'initial',
    'GO_TO_PAGE_CALLED' = 'goToPageCalled',
    'GO_NEXT_PAGE_1' = 'goToNextPageState1SettingZIndexZero',
    'GO_NEXT_PAGE_2' = 'goToNextPageState2RestoringZIndex',
    'GO_PREV' = 'goPrev',
    'REFETCH' = 'refetch'
}

const loadingSpinnerPages = [
    <div className={'paper'}>
        <div className="front rotate-y-neg-180deg transition duration-0">
            <div className="front-content"></div>
        </div>
        <div className="back rotate-y-neg-180deg transition duration-0">
            <div className="back-content">
                <BeatLoader color="#94bfff" size={50}></BeatLoader>
            </div>
        </div>
    </div>,

    <div className="paper">
        <div className="front">
            <div className="front-content">
                <BeatLoader color="#94bfff" size={50}></BeatLoader>
            </div>
        </div>
        <div className="back">
            <div className="back-content"></div>
        </div>
    </div>
];

export function Flipbook({
    showUploadModalInfo,
    setShowUploadModalInfo,
    triggerFlipBookRefetch,
    setTriggerFlipBookRefetch,
    setShowShareDocumentForm
}: IFlipbookProps) {
    const user = useUserContext();
    const { collabToken, userId } = user;
    // a location n is defined as where we see the FRONT of paper n. So a location of 2 is
    // where we see the front of paper 2 (not zero indexed). In reality, this is the first document.
    const [currentLocationFlipbook, setCurrentLocationFlipbook] = useState(2);
    const [pageStylesState, setPageStylesState] = useState<any>({
        state: PAGE_STYLE_POSSIBLE_STATES.INITIAL,
        styles: []
    });
    // given a param n, we will flip the first n papers (not zero indexed?).
    const [goToPageCalled, setGoToPageCalled] = useState<number | boolean>(false);
    const [nextPageTriggered, setNextPageTriggered] = useState(false);
    const [
        tempCurrentPageStylesStateForMovingToNextPage,
        setTempCurrentPageStylesStateForMovingToNextPage
    ] = useState<any>(null);

    const [documentsWindow, setDocumentsWindow] = useState<{
        documents: DocumentData[];
        firstDocumentFlag: boolean;
        lastDocumentFlag: boolean;
    } | null>(null);
    // const [documentId, setDocumentId] = useState('');
    const documentId = triggerFlipBookRefetch ? triggerFlipBookRefetch : '';
    const documentsFlipBook = documentsWindow ? documentsWindow.documents : [];
    const firstDocumentFlag = documentsWindow ? documentsWindow.firstDocumentFlag : true;
    const lastDocumentFlag = documentsWindow ? documentsWindow.lastDocumentFlag : true;
    const [arrowClickPause, setArrowClickPause] = useState(false);

    const fetchData = async (documentId: string | null) => {
        if (user && user.collabToken) {
            const documentsWindow = await getNeighbouringDocuments(
                userId,
                collabToken,
                new Date(),
                documentId
            );
            setDocumentsWindow(documentsWindow);
            // setTriggerFlipBookRefetch('')
        }
    };

    useEffect(() => {
        if (documentId) {
            fetchData(documentId);
        }
    }, [triggerFlipBookRefetch]);

    useEffect(() => {
        if (user) fetchData(null);
    }, [user]);

    /**
     * Important info:
     * Definition: A paper is like a paper in a book, it consists of a front and a back.
     * RULES:
     * 1) THE PAPER BEING TURNED LEFT DUE TO FLIPPING FORWARD MUST END UP WITH A LOWER Z-INDEX THAN THE SUBSEQUENT PAPER
     * When turning forwards, we must incremement all the z-indices of the papers behind the one being flipped.
     * Otherwise we may have something like the situation below:
     * Initially z-indices are: 7,6,5,4,3,2,1. Then we flip 5x and get 1,2,3,4,5,2,1.
     * This is an issue because paper 6 has z-index 2, but paper 5 has z-index 5. We cannot click things on paper 6,
     * despite paper 5 having been flipped.
     * The current paper MUST have a >= z-index than the paper before it.
     * Hence, our result after flipping 5x should be 1,2,3,4,5,6,7
     *
     * 2) From rule 1) when we flip backwards, we decrease the z-indices of the papers after the one being flipped,
     * to restore to the previous state.
     *
     * === THE FOLLOWING 2 RULES ENSURES THE PAGE FLIP ANIMATION LOOKS CORRECT ===
     * 3) When turning a paper left due to flipping forward, we must momentarily, set all z-indices of the paper after,
     * to be LESS than the current z-index of the page being flipped. Otherwise, the contents of the upcoming paper, will
     * present itself ON TOP of the flip animation.
     *
     * 4) When turning a paper right due to flipping backwards, we do not need to tinker with the z-indices.
     * The flipped z-indices are always in order: 1,2,3,4,5,6,7. So the previous paper's content, would
     * never appear above the flipping animation as the previous paper would also have a lower z-index.
     */

    useEffect(() => {
        if (documentsFlipBook.length) {
            let styles = [];
            for (let i = 0; i < documentsFlipBook.length + 1; i++) {
                styles.push({
                    flipped: i !== 0 ? false : true,
                    regularZIndex:
                        i === 0
                            ? documentsFlipBook.length - i + 1
                            : documentsFlipBook.length - i + 2, // mocking one flip for the others
                    flippedZIndex: i + 1,
                    goToPageTriggered: true
                });
            }
            setPageStylesState({
                state: documentId
                    ? PAGE_STYLE_POSSIBLE_STATES.REFETCH
                    : PAGE_STYLE_POSSIBLE_STATES.INITIAL,
                styles
            });
        }
    }, [documentsFlipBook]);

    let numOfPapers = documentsFlipBook.length + 1;
    let maxLocation = numOfPapers + 1;

    useEffect(() => {
        if (typeof goToPageCalled === 'number') {
            // going to page called, should effectively mimic turning a page manually
            // so all the flipped and regular z-indices should be the same as if we flipped here manually
            let styles = [];
            for (let i = 0; i < documentsFlipBook.length + 1; i++) {
                if (i === 0) {
                    styles.push({
                        ...pageStylesState.styles[i],
                        flipped: true,
                        goToPageTriggered: true,
                        regularZIndex: pageStylesState.styles[i].regularZIndex
                        // first paper never gets the +1 in regularZIndex as a result from flipping
                    });
                    continue;
                }
                if (i < goToPageCalled) {
                    styles.push({
                        ...pageStylesState.styles[i],
                        flipped: true,
                        goToPageTriggered: true,
                        regularZIndex: pageStylesState.styles[i].regularZIndex + i - 1
                        // we must adjust regular z-index as well because, well,
                        // turning a papers increments this value for all subsequent papers
                    });
                } else {
                    styles.push({
                        ...pageStylesState.styles[i],
                        regularZIndex: pageStylesState.styles[i].regularZIndex + goToPageCalled - 1
                    });
                }
            }
            setPageStylesState({
                state: PAGE_STYLE_POSSIBLE_STATES.GO_TO_PAGE_CALLED,
                styles
            });
            setCurrentLocationFlipbook(goToPageCalled + 1);
            setGoToPageCalled(false);
        } else {
            if (pageStylesState) {
                let styles = [];
                for (let i = 0; i < documentsFlipBook.length + 1; i++) {
                    styles.push({ ...pageStylesState.styles[i], goToPageTriggered: false });
                }
                setPageStylesState({
                    state: PAGE_STYLE_POSSIBLE_STATES.GO_TO_PAGE_CALLED,
                    styles
                });
            }
        }
    }, [goToPageCalled]);

    /* Next page useEffectchains */

    useEffect(() => {
        if (nextPageTriggered) setTempCurrentPageStylesStateForMovingToNextPage(pageStylesState);
    }, [nextPageTriggered]);

    useEffect(() => {
        if (nextPageTriggered) {
            const goNextPage = async () => {
                // temporarily set all Z-indices after this page to be LESS or equal to this page,
                // just set em all to negative values.
                let styles = [];
                for (let i = 0; i < documentsFlipBook.length + 1; i++) {
                    if (i === currentLocationFlipbook - 1)
                        styles.push({ ...pageStylesState.styles[i], flipped: true });
                    else if (i > currentLocationFlipbook - 1)
                        styles.push({ ...pageStylesState.styles[i], regularZIndex: 0 - i });
                    else styles.push(pageStylesState.styles[i]);
                }
                if (currentLocationFlipbook < maxLocation - 1) {
                    setPageStylesState({
                        state: PAGE_STYLE_POSSIBLE_STATES.GO_NEXT_PAGE_1,
                        styles
                    });
                }
                // after this, we will go to the onTransitionEnd in the TSX below
            };
            goNextPage();
        }
    }, [tempCurrentPageStylesStateForMovingToNextPage]);

    useEffect(() => {
        if (
            nextPageTriggered &&
            pageStylesState.state === PAGE_STYLE_POSSIBLE_STATES.GO_NEXT_PAGE_2
        ) {
            setCurrentLocationFlipbook(currentLocationFlipbook + 1);
            return;
        }
        if (pageStylesState && pageStylesState.state === PAGE_STYLE_POSSIBLE_STATES.INITIAL) {
            setGoToPageCalled(documentsFlipBook.length);
        }
        if (pageStylesState && pageStylesState.state === PAGE_STYLE_POSSIBLE_STATES.REFETCH) {
            const index = documentsFlipBook.findIndex((doc) => doc.documentId === documentId);
            setGoToPageCalled(index + 1);
        }
    }, [pageStylesState]);

    useEffect(() => {
        if (nextPageTriggered) {
            setNextPageTriggered(false);
        }
        if (documentsWindow) {
            if (currentLocationFlipbook === maxLocation - 1 && !documentsWindow.lastDocumentFlag) {
                setTriggerFlipBookRefetch(
                    documentsFlipBook[currentLocationFlipbook - 2].documentId
                );
                return;
            }
            if (currentLocationFlipbook === 2 && !documentsWindow.firstDocumentFlag) {
                setTriggerFlipBookRefetch(documentsFlipBook[0].documentId);
                return;
            }
        }
    }, [currentLocationFlipbook]);

    /* End of next page useEffect chains */

    const goPrevPage = () => {
        if (currentLocationFlipbook > 2) {
            let styles = [];
            for (let i = 0; i < documentsFlipBook.length + 1; i++) {
                if (i === currentLocationFlipbook - 2)
                    styles.push({ ...pageStylesState.styles[i], flipped: false });
                else if (i > currentLocationFlipbook - 2)
                    styles.push({
                        ...pageStylesState.styles[i],
                        regularZIndex: pageStylesState.styles[i].regularZIndex - 1
                    });
                else styles.push({ ...pageStylesState.styles[i] });
            }
            setPageStylesState({
                state: PAGE_STYLE_POSSIBLE_STATES.GO_PREV,
                styles
            });
            setCurrentLocationFlipbook(currentLocationFlipbook - 1);
        }
    };

    const renderedPapers = () => {
        const renderedPages = [];
        if (documentsFlipBook.length + 1 !== pageStylesState.styles.length) {
            return loadingSpinnerPages;
        }

        for (let index = 0; index < documentsFlipBook.length + 1; index++) {
            const flippedZIndex = pageStylesState.styles[index].flippedZIndex;
            const regularZIndex = pageStylesState.styles[index].regularZIndex;
            renderedPages.push(
                <div
                    className={'paper'}
                    // unfortunately, putting z-index into styles because tailwind
                    // does not like dynamic classnames
                    style={{
                        zIndex:
                            pageStylesState.styles[index].flipped || index === 0
                                ? flippedZIndex
                                : regularZIndex
                    }}
                >
                    <div
                        className={
                            'front' +
                            (pageStylesState.styles[index].goToPageTriggered
                                ? ' transition duration-0'
                                : ' transition duration-[1000ms]') +
                            (pageStylesState.styles[index].flipped || index === 0
                                ? ' rotate-y-neg-180deg'
                                : '')
                        }
                        onTransitionEnd={() => {
                            if (
                                nextPageTriggered &&
                                pageStylesState.state === PAGE_STYLE_POSSIBLE_STATES.GO_NEXT_PAGE_1
                            ) {
                                const restoreZIndices = () => {
                                    let styles = [];
                                    for (let i = 0; i < documentsFlipBook.length + 1; i++) {
                                        if (i > currentLocationFlipbook - 1)
                                            styles.push({
                                                ...pageStylesState.styles[i],
                                                regularZIndex:
                                                    tempCurrentPageStylesStateForMovingToNextPage
                                                        .styles[i].regularZIndex + 1 // from RULE 1. Because all subsequent papers will still pull its z-indices from the regularZIndex
                                            });
                                        else styles.push({ ...pageStylesState.styles[i] });
                                    }
                                    setPageStylesState({
                                        state: PAGE_STYLE_POSSIBLE_STATES.GO_NEXT_PAGE_2,
                                        styles
                                    });
                                };
                                restoreZIndices();
                            }
                        }}
                    >
                        <div className="front-content">
                            {index > 0 && (
                                <div className="flex h-full w-full flex-col items-center justify-evenly p-[2rem]">
                                    <div className="h-[52%] w-full">
                                        {user && documentsFlipBook.length && (
                                            <ImageCarousel
                                                document={documentsFlipBook[index - 1]}
                                                showUploadModalInfo={showUploadModalInfo}
                                                setShowUploadModalInfo={setShowUploadModalInfo}
                                            />
                                        )}
                                    </div>
                                    <div className="h-[2%] w-full"></div>
                                    <div className="h-[45%] w-full">
                                        {documentsFlipBook && documentsFlipBook.length && (
                                            <DateCalendar
                                                disabled={index !== currentLocationFlipbook - 1}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className={
                            'back' +
                            (pageStylesState.styles[index].goToPageTriggered
                                ? ' transition duration-0'
                                : ' transition duration-[1000ms]') +
                            (pageStylesState.styles[index].flipped || index === 0
                                ? ' rotate-y-neg-180deg'
                                : '')
                        }
                    >
                        <div className="back-content">
                            {index < documentsFlipBook.length && (
                                <TipTapCollab
                                    key={documentsFlipBook[index].documentId}
                                    documentId={documentsFlipBook[index].documentId}
                                    documentTitle={documentsFlipBook[index].title}
                                    collabFlag={index === currentLocationFlipbook - 2}
                                    setShowShareDocumentForm={setShowShareDocumentForm}
                                />
                            )}
                        </div>
                    </div>
                </div>
            );
        }
        return renderedPages;
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            {!(firstDocumentFlag && currentLocationFlipbook === 2) && (
                <button
                    className={
                        'absolute left-[5rem] top-[50%] z-[3] translate-x-0 translate-y-[-50%] transform text-[8rem] ' +
                        (arrowClickPause ? 'text-gray-300' : 'text-white')
                    }
                    onClick={async () => {
                        if (arrowClickPause) return;
                        setArrowClickPause(true);
                        goPrevPage();
                        setTimeout(() => {
                            setArrowClickPause(false);
                        }, 1500);
                    }}
                >
                    <FaChevronLeft />
                </button>
            )}
            {!(lastDocumentFlag && currentLocationFlipbook === maxLocation - 1) && (
                <button
                    onClick={async () => {
                        if (arrowClickPause) return;
                        setArrowClickPause(true);
                        setNextPageTriggered(true);
                        setTimeout(() => {
                            setArrowClickPause(false);
                        }, 1500);
                    }}
                    className={
                        'absolute right-[5rem] top-[50%] z-[3] translate-x-0 translate-y-[-50%] transform text-[8rem] ' +
                        (arrowClickPause ? 'text-gray-300' : 'text-white')
                    }
                    disabled={arrowClickPause}
                >
                    <FaChevronRight />
                </button>
            )}
            <div className="relative flex h-[95%] w-[90%] items-center justify-center overflow-y-hidden border-black">
                <div className={`book h-[80%] w-[30%] translate-x-[50%]`}>
                    {pageStylesState && pageStylesState.styles.length && renderedPapers()}
                </div>
            </div>
        </div>
    );
}
