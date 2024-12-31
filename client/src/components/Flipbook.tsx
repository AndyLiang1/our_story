import { useEffect, useState } from 'react';
import { DocumentData } from '../types/DocumentTypes';

export interface IFlipbookProps {
    documentsWindow: {
        documents: DocumentData[];
        firstDocumentFlag: boolean;
        lastDocumentFlag: boolean;
    } | null;
}

enum PAGE_STYLE_POSSIBLE_STATES {
    'INITIAL' = 'initial',
    'GO_TO_PAGE_CALLED' = 'goToPageCalled',
    'GO_NEXT_PAGE_1' = 'goToNextPageState1SettingZIndexZero',
    'GO_NEXT_PAGE_2' = 'goToNextPageState2RestoringZIndex',
    'GO_PREV' = 'goPrev'
}

export function Flipbook({ documentsWindow }: IFlipbookProps) {
    const [currentLocation, setCurrentLocation] = useState(2);

    const [pageStylesState, setPageStylesState] = useState<any>(null);
    // given a param n, we will flip the first n papers.
    const [goToPageCalled, setGoToPageCalled] = useState(0);
    const [nextPageTriggered, setNextPageTriggered] = useState(false);
    const [
        tempCurrentPageStylesStateForMovingToNextPage,
        setTempCurrentPageStylesStateForMovingToNextPage
    ] = useState<any>(null);

    const documents = documentsWindow ? documentsWindow.documents : [];

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
     *
     *
     */

    useEffect(() => {
        if (documents.length) {
            setPageStylesState({
                state: PAGE_STYLE_POSSIBLE_STATES.INITIAL,
                styles: documents.map((document, i) => {
                    return {
                        flipped: i !== 0 ? false : true,
                        regularZIndex:
                            i === 0 ? documents.length - i + 1 : documents.length - i + 2, // mocking one flip for the others
                        flippedZIndex: i + 1,
                        goToPageTriggered: true
                    };
                })
            });
        }
    }, [documents]);

    let numOfPapers = documents.length;
    let maxLocation = numOfPapers + 1;

    useEffect(() => {
        setTimeout(() => {
            // setGoToPageCalled(4);
        }, 3000);
    }, []);

    useEffect(() => {
        if (goToPageCalled !== 0) {
            // going to page called, should effectively mimic turning a page manually
            // so all the flipped and regular z-indices should be the same as if we flipped here manually
            setPageStylesState({
                state: PAGE_STYLE_POSSIBLE_STATES.GO_TO_PAGE_CALLED,
                styles: documents.map((document, i) => {
                    if (i === 0) {
                        return {
                            ...pageStylesState.styles[i],
                            flipped: true,
                            goToPageTriggered: true,
                            regularZIndex: pageStylesState.styles[i].regularZIndex
                            // first paper never gets the +1 in regularZIndex as a result from flipping
                        };
                    }
                    if (i < goToPageCalled) {
                        return {
                            ...pageStylesState.styles[i],
                            flipped: true,
                            goToPageTriggered: true,
                            regularZIndex: pageStylesState.styles[i].regularZIndex + i - 1
                            // we must adjust regular z-index as well because, well,
                            // turning a papers increments this value for all subsequent papers
                        };
                    } else {
                        return {
                            ...pageStylesState.styles[i],
                            regularZIndex:
                                pageStylesState.styles[i].regularZIndex + goToPageCalled - 1
                        };
                        // return {...pageStylesState.styles[i]}
                    }
                })
            });
            setCurrentLocation(goToPageCalled + 1);
            console.log('setting istriggered');
            setGoToPageCalled(0);
        } else {
            if (pageStylesState) {
                console.log('unsetting istriggered');
                setPageStylesState({
                    state: PAGE_STYLE_POSSIBLE_STATES.GO_TO_PAGE_CALLED,
                    styles: documents.map((document, i) => {
                        return { ...pageStylesState.styles[i], goToPageTriggered: false };
                    })
                });
            }
        }
    }, [goToPageCalled]);

    /* Next page useEffectchains */

    useEffect(() => {
        if (nextPageTriggered) setTempCurrentPageStylesStateForMovingToNextPage(pageStylesState);
    }, [nextPageTriggered]);

    useEffect(() => {
        console.log('Current state: ', tempCurrentPageStylesStateForMovingToNextPage);
        if (nextPageTriggered) {
            const goNextPage = async () => {
                // temporarily set all Z-indices after this page to be LESS or equal to this page,
                // just set em all to negative values.
                if (currentLocation < maxLocation - 1) {
                    setPageStylesState({
                        state: PAGE_STYLE_POSSIBLE_STATES.GO_NEXT_PAGE_1,
                        styles: pageStylesState.styles.map((page: any, i: number) => {
                            if (i === currentLocation - 1) return { ...page, flipped: true };
                            if (i > currentLocation - 1) return { ...page, regularZIndex: 0 - i };
                            return page;
                        })
                    });
                }
                // after this, we will go to the onTransitionEnd in the TSX below
            };
            goNextPage();
        }
    }, [tempCurrentPageStylesStateForMovingToNextPage]);

    useEffect(() => {
        console.log(pageStylesState);
        if (
            nextPageTriggered &&
            pageStylesState.state === PAGE_STYLE_POSSIBLE_STATES.GO_NEXT_PAGE_2
        ) {
            setCurrentLocation(currentLocation + 1);
            return;
        }
        if (pageStylesState && pageStylesState.state === PAGE_STYLE_POSSIBLE_STATES.INITIAL) {
            console.log('Going to page called');

            setGoToPageCalled(4);
        }
    }, [pageStylesState]);

    useEffect(() => {
        // console.log('Current location: ', currentLocation, maxLocation, documents);
        if (nextPageTriggered) {
            setNextPageTriggered(false);
        }
        if (currentLocation === maxLocation - 1) {
            console.log('Reached end');
        }
        if (currentLocation === 2) {
            console.log('Reached beginning');
        }
    }, [currentLocation]);

    /* End of next page useEffect chains */

    const goPrevPage = () => {
        if (currentLocation > 2) {
            setPageStylesState({
                state: PAGE_STYLE_POSSIBLE_STATES.GO_PREV,
                styles: pageStylesState.styles.map((page: any, i: number) => {
                    if (i === currentLocation - 2) return { ...page, flipped: false };
                    if (i > currentLocation - 2)
                        return { ...page, regularZIndex: page.regularZIndex - 1 };
                    return page;
                })
            });
            setCurrentLocation(currentLocation - 1);
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center bg-red-100">
            <button
                className="absolute left-10"
                onClick={() => {
                    goPrevPage();
                }}
            >
                L
            </button>
            <button
                className="absolute right-10"
                onClick={() => {
                    setNextPageTriggered(true);
                }}
            >
                R
            </button>

            <div className="relative flex h-[95%] w-[90%] items-center justify-center border-black bg-blue-200 text-center">
                <div className={`book translate-x-[50%]`}>
                    {pageStylesState &&
                        pageStylesState.styles.length &&
                        documents.map((doc, index) => {
                            const flippedZIndex = pageStylesState.styles[index].flippedZIndex;
                            const regularZIndex = pageStylesState.styles[index].regularZIndex;
                            return (
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
                                                : ' transition duration-1000') +
                                            (pageStylesState.styles[index].flipped || index === 0
                                                ? ' rotate-y-neg-180deg'
                                                : '')
                                        }
                                        onTransitionEnd={() => {
                                            if (
                                                nextPageTriggered &&
                                                pageStylesState.state ===
                                                    PAGE_STYLE_POSSIBLE_STATES.GO_NEXT_PAGE_1
                                            ) {
                                                const restoreZIndices = () => {
                                                    setPageStylesState({
                                                        state: PAGE_STYLE_POSSIBLE_STATES.GO_NEXT_PAGE_2,
                                                        styles: pageStylesState.styles.map(
                                                            (page: any, i: number) => {
                                                                if (i > currentLocation - 1)
                                                                    return {
                                                                        ...page,
                                                                        regularZIndex:
                                                                            tempCurrentPageStylesStateForMovingToNextPage
                                                                                .styles[i]
                                                                                .regularZIndex + 1 // from RULE 1. Because all subsequent papers will still pull its z-indices from the regularZIndex
                                                                    };
                                                                return page;
                                                            }
                                                        )
                                                    });
                                                };
                                                restoreZIndices();
                                            }
                                        }}
                                    >
                                        <div className="front-content">
                                            <input className="bg-red-500"></input>
                                            <h1>Front {index + 1}</h1>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            'back' +
                                            (pageStylesState.styles[index].goToPageTriggered
                                                ? ' transition duration-0'
                                                : ' transition duration-1000') +
                                            (pageStylesState.styles[index].flipped || index === 0
                                                ? ' rotate-y-neg-180deg'
                                                : '')
                                        }
                                    >
                                        <div className="back-content">
                                            <input className="bg-blue-500"></input>
                                            <h1>Back {index + 1}</h1>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
