import { useEffect, useState } from 'react';

export interface IFlipbookProps {}

enum PAGE_STYLE_POSSIBLE_STATES {
    'INITIAL' = 'initial',
    'GO_TO_PAGE_CALLED' = 'goToPageCalled',
    'GO_NEXT_PAGE_1' = 'goToNextPageState1SettingZIndexZero',
    'GO_NEXT_PAGE_2' = 'goToNextPageState2RestoringZIndex'
}

export function Flipbook(props: IFlipbookProps) {
    const [documents, setDocuments] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [currentLocation, setCurrentLocation] = useState(2);

    const [pageStylesState, setPageStylesState] = useState<any>(null);
    const [goToPageCalled, setGoToPageCalled] = useState(0);
    const [nextPageTriggered, setNextPageTriggered] = useState(false);
    const [
        tempCurrentPageStylesStateForMovingToNextPage,
        setTempCurrentPageStylesStateForMovingToNextPage
    ] = useState<any>(null);

    useEffect(() => {
        setPageStylesState({
            state: PAGE_STYLE_POSSIBLE_STATES.INITIAL,
            styles: documents.map((document, i) => {
                return {
                    flipped: i !== 0 ? false : true,
                    regularZIndex: documents.length - i,
                    flippedZIndex: i + 1,
                    goToPageTriggered: false
                };
            })
        });
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
            setPageStylesState({
                state: PAGE_STYLE_POSSIBLE_STATES.GO_TO_PAGE_CALLED,
                styles: documents.map((document, i) => {
                    return i < goToPageCalled
                        ? { ...pageStylesState.styles[i], flipped: true, goToPageTriggered: true }
                        : pageStylesState.styles[i];
                })
            });
            setCurrentLocation(goToPageCalled + 1);
            setGoToPageCalled(0);
        } else {
            if (pageStylesState) {
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
        console.log('Pagestyle state updated: ', pageStylesState)
        if (
            nextPageTriggered &&
            pageStylesState.state === PAGE_STYLE_POSSIBLE_STATES.GO_NEXT_PAGE_2
        ) {
            setCurrentLocation(currentLocation + 1);
            return;
        }
    }, [pageStylesState]);

    useEffect(() => {
        console.log("Current location: ", currentLocation)
        if (nextPageTriggered) {
            setNextPageTriggered(false);
        }
    }, [currentLocation]);

    /* End of next page useEffect chains */

    const goPrevPage = () => {
        if (currentLocation > 2) {
            setPageStylesState({
                state: PAGE_STYLE_POSSIBLE_STATES.INITIAL,
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
                                            console.log('On transition end: ', pageStylesState, String(nextPageTriggered))
                                            if (nextPageTriggered && pageStylesState.state === PAGE_STYLE_POSSIBLE_STATES.GO_NEXT_PAGE_1) {
                                                console.log("Restoring z-indices")
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
                                                                                .regularZIndex + 1
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
