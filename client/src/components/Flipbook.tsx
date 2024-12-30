import { useEffect, useState } from 'react';

export interface IFlipbookProps {}

export function Flipbook(props: IFlipbookProps) {
    const debug = false;
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
            state: 'initial',
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

    const goToPage = (pageNum: number) => {
        setGoToPageCalled(pageNum);
    };

    useEffect(() => {
        setTimeout(() => {
            // goToPage(3);
        }, 3000);
    }, []);

    useEffect(() => {
        if (goToPageCalled !== 0) {
            setPageStylesState({
                state: 'goToPageCalled',
                styles: documents.map((document, i) => {
                    return i < goToPageCalled
                        ? { ...pageStylesState[i], flipped: true, goToPageTriggered: true }
                        : pageStylesState[i];
                })
            });
            console.log('here?');
            setCurrentLocation(goToPageCalled + 1);
            setGoToPageCalled(0);
        } else {
            if (pageStylesState) {
                setPageStylesState({
                    state: 'goToPageCalled',
                    styles: documents.map((document, i) => {
                        return { ...pageStylesState[i], goToPageTriggered: false };
                    })
                });
            }
        }
    }, [goToPageCalled]);

    /* Next page */

    useEffect(() => {
        if (nextPageTriggered) {
            saveCurrentState();
        }
    }, [nextPageTriggered]);

    useEffect(() => {
        if (nextPageTriggered) {
            const goNextPage = async () => {
                console.log('Go next page triggered.');
                // set all Z-indices after this page to be LESS or equal to this page, just set em all to 0.
                if (currentLocation < maxLocation - 1) {
                    setPageStylesState({
                        state: 'GoToNextPageState1SettingZIndexZero',
                        styles: pageStylesState.styles.map((page: any, i: number) => {
                            if (i === currentLocation - 1) return { ...page, flipped: true };
                            if (i > currentLocation - 1) return { ...page, regularZIndex: 0 };
                            return page;
                        })
                    });
                }
            };
            goNextPage();
        }
    }, [tempCurrentPageStylesStateForMovingToNextPage]);

    useEffect(() => {
        if (nextPageTriggered) {
            if (pageStylesState.state === 'GoToNextPageState2RestoringZIndex') {
                setCurrentLocation(currentLocation + 1);
                return;
            }
            const restoreZIndices = () => {
                console.log('Restore Z indices triggered.');
                setPageStylesState({
                    state: 'GoToNextPageState2RestoringZIndex',
                    styles: pageStylesState.styles.map((page: any, i: number) => {
                        if (i > currentLocation - 1)
                            return {
                                ...page,
                                regularZIndex:
                                    tempCurrentPageStylesStateForMovingToNextPage.styles[i]
                                        .regularZIndex + 1
                            };
                        return page;
                    })
                });
            };
            restoreZIndices();
        }
    }, [pageStylesState]);

    const saveCurrentState = () => {
        setTempCurrentPageStylesStateForMovingToNextPage(pageStylesState);
    };

    // useEffect(() => {
    //     if (nextPageTriggered) {
    //         setPageStylesState(
    //             pageStylesState.map((page: any, i: number) => {
    //                 if (i === currentLocation - 1) return { ...page, flipped: true };
    //                 if (i > currentLocation - 1) return { ...page, regularZIndex: 0 };
    //                 return page;
    //             })
    //         );
    //         setCurrentLocation(currentLocation + 1);
    //     }
    // }, []);

    useEffect(() => {
        if (nextPageTriggered) {
            setNextPageTriggered(false);
        }
    }, [currentLocation]);

    const goPrevPage = () => {
        if (currentLocation > 2) {
            setPageStylesState({
                state: 'initial',
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

    useEffect(() => {
        if (debug) console.log(currentLocation);
    }, [currentLocation]);

    useEffect(() => {
        if (debug) console.log(pageStylesState);
    }, [pageStylesState]);

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
