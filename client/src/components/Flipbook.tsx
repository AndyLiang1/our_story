import { useEffect, useState } from 'react';

export interface IFlipbookProps {}

enum BOOKSTATE {
    'INITIAL' = 'initial',
    'OPENED' = 'opened',
    'CLOSED_START' = 'closedStart',
    'CLOSED_END' = 'closedEnd'
}

export function Flipbook(props: IFlipbookProps) {
    const [documents, setDocuments] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [currentLocation, setCurrentLocation] = useState(1);

    const [pageStylesState, setPageStylesState] = useState<any>(null);

    useEffect(() => {
        setPageStylesState(
            documents.map((document, i) => {
                return {
                    flipped: false,
                    regularZIndex: documents.length - i,
                    flippedZIndex: i + 1
                };
            })
        );
    }, [documents]);

    const [bookState, setBookState] = useState<BOOKSTATE>(BOOKSTATE.INITIAL);

    const getTranslationFromBookState = () => {
        if (bookState === BOOKSTATE.INITIAL) return '';
        if (bookState === BOOKSTATE.OPENED) return ' translate-x-[50%]';
        if (bookState === BOOKSTATE.CLOSED_START) return ' translate-x-[0%]';
        if (bookState === BOOKSTATE.CLOSED_END) return ' translate-x-[100%]';
    };

    let numOfPapers = documents.length;
    let maxLocation = numOfPapers + 1;
    const openBook = () => {
        setBookState(BOOKSTATE.OPENED);
    };
    const closeBook = (isAtBeginning: boolean) => {
        if (isAtBeginning) {
            setBookState(BOOKSTATE.CLOSED_START);
        } else {
            setBookState(BOOKSTATE.CLOSED_END);
        }
    };
    const goNextPage = () => {
        if (currentLocation < maxLocation) {
            if (currentLocation === 1) openBook();
            setPageStylesState(
                pageStylesState.map((page: any, i: number) => {
                    return i === currentLocation - 1 ? { ...page, flipped: true } : page;
                })
            );
            if (currentLocation === documents.length) closeBook(false);
            setCurrentLocation(currentLocation + 1);
        }
    };
    const goPrevPage = () => {
        if (currentLocation > 1) {
            if (currentLocation === 2) closeBook(true);
            if (currentLocation === documents.length + 1) openBook();
            setPageStylesState(
                pageStylesState.map((page: any, i: number) => {
                    return i === currentLocation - 2 ? { ...page, flipped: false } : page;
                })
            );
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
                    goNextPage();
                }}
            >
                R
            </button>

            <div className="relative flex h-[95%] w-[90%] items-center justify-center border-black bg-blue-200 text-center">
                <div className={`book` + getTranslationFromBookState()}>
                    {pageStylesState &&
                        documents.map((doc, index) => {
                            const flippedZIndex = pageStylesState[index].flippedZIndex;
                            const regularZIndex = pageStylesState[index].regularZIndex;
                            return (
                                <div
                                    className={'paper'}
                                    // unfortunately, putting z-index into styles because tailwind
                                    // does not like dynamic classnames 
                                    style={{
                                        zIndex: pageStylesState[index].flipped
                                            ? flippedZIndex
                                            : regularZIndex
                                    }}
                                >
                                    <div
                                        className={
                                            'front' +
                                            (pageStylesState[index].flipped
                                                ? ' rotate-y-neg-180deg'
                                                : '')
                                        }
                                    >
                                        <div className="front-content">
                                            <h1>Front {index + 1}</h1>
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            'back' +
                                            (pageStylesState[index].flipped
                                                ? ' rotate-y-neg-180deg'
                                                : '')
                                        }
                                    >
                                        <div className="back-content">
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
