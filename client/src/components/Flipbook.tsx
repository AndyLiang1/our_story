import { useEffect, useState } from 'react';

export interface IFlipbookProps {}

enum BOOKSTATE {
    'INITIAL' = 'initial',
    'OPENED' = 'opened',
    'CLOSED_START' = 'closedStart',
    'CLOSED_END' = 'closedEnd'
}

export function Flipbook(props: IFlipbookProps) {
    const [documents, setDocuments] = useState([1, 2, 3]);
    const [currentLocation, setCurrentLocation] = useState(1);
    const [pageStylesState, setPageStylesState] = useState<any>([
        {
            flipped: false,
            regularZIndex: 3,
            flippedZIndex: 1
        },
        {
            flipped: false,
            regularZIndex: 2,
            flippedZIndex: 2
        },
        {
            flipped: false,
            regularZIndex: 1,
            flippedZIndex: 3
        }
    ]);
    const [bookState, setBookState] = useState<BOOKSTATE>(BOOKSTATE.INITIAL);

    useEffect(() => {
        console.log(pageStylesState);
    }, [pageStylesState]);

    const getTranslationFromBookState = () => {
        if (bookState === BOOKSTATE.INITIAL) return '';
        if (bookState === BOOKSTATE.OPENED) return ' translate-x-[50%]';
        if (bookState === BOOKSTATE.CLOSED_START) return ' translate-x-[0%]';
        if (bookState === BOOKSTATE.CLOSED_END) return ' translate-x-[100%]';
    };

    const zIndex1 = ` z-[${pageStylesState[0].regularZIndex}]`;
    const flippedZIndex1 = ` z-[${pageStylesState[0].flippedZIndex}]`;
    const zIndex2 = ` z-[${pageStylesState[1].regularZIndex}]`;
    const flippedZIndex2 = ` z-[${pageStylesState[1].flippedZIndex}]`;
    const zIndex3 = ` z-[${pageStylesState[2].regularZIndex}]`;
    const flippedZIndex3 = ` z-[${pageStylesState[2].flippedZIndex}]`;

    let numOfPapers = 3;
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
            switch (currentLocation) {
                case 1:
                    openBook();
                    setPageStylesState(
                        pageStylesState.map((page: any, i: number) => {
                            return i === 0 ? { ...page, flipped: true } : page;
                        })
                    );
                    break;
                case 2:
                    setPageStylesState(
                        pageStylesState.map((page: any, i: number) => {
                            return i === 1 ? { ...page, flipped: true } : page;
                        })
                    );
                    break;
                case 3:
                    setPageStylesState(
                        pageStylesState.map((page: any, i: number) => {
                            return i === 2 ? { ...page, flipped: true } : page;
                        })
                    );
                    closeBook(false);
                    break;
                default:
                    throw new Error('unkown state');
            }
            setCurrentLocation(currentLocation + 1);
        }
    };
    const goPrevPage = () => {
        if (currentLocation > 1) {
            switch (currentLocation) {
                case 2:
                    closeBook(true);
                    setPageStylesState(
                        pageStylesState.map((page: any, i: number) => {
                            return i === 0 ? { ...page, flipped: false } : page;
                        })
                    );
                    break;
                case 3:
                    setPageStylesState(
                        pageStylesState.map((page: any, i: number) => {
                            return i === 1 ? { ...page, flipped: false } : page;
                        })
                    );
                    break;
                case 4:
                    openBook();
                    setPageStylesState(
                        pageStylesState.map((page: any, i: number) => {
                            return i === 2 ? { ...page, flipped: false } : page;
                        })
                    );
                    break;
                default:
                    throw new Error('unkown state');
            }

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
                    <div
                        className={
                            'paper' + (pageStylesState[0].flipped ? flippedZIndex1 : zIndex1)
                        }
                    >
                        <div
                            className={
                                'front' + (pageStylesState[0].flipped ? ' rotate-y-neg-180deg' : '')
                            }
                        >
                            <div className="front-content">
                                <h1>Front 1</h1>
                            </div>
                        </div>
                        <div
                            className={
                                'back' + (pageStylesState[0].flipped ? ' rotate-y-neg-180deg' : '')
                            }
                        >
                            <div className="back-content">
                                <h1>Back 1</h1>
                            </div>
                        </div>
                    </div>
                    <div
                        className={
                            'paper' + (pageStylesState[1].flipped ? flippedZIndex2 : zIndex2)
                        }
                    >
                        <div
                            className={
                                'front' + (pageStylesState[1].flipped ? ' rotate-y-neg-180deg' : '')
                            }
                        >
                            <div className="front-content">
                                <h1>Front 2</h1>
                            </div>
                        </div>
                        <div
                            className={
                                'back' + (pageStylesState[1].flipped ? ' rotate-y-neg-180deg' : '')
                            }
                        >
                            <div className="back-content">
                                <h1>Back 2</h1>
                            </div>
                        </div>
                    </div>
                    <div
                        className={
                            'paper' + (pageStylesState[2].flipped ? flippedZIndex3 : zIndex3)
                        }
                    >
                        <div
                            className={
                                'front' + (pageStylesState[2].flipped ? ' rotate-y-neg-180deg' : '')
                            }
                        >
                            <div className="front-content">
                                <h1>Front 3</h1>
                            </div>
                        </div>
                        <div
                            className={
                                'back' + (pageStylesState[2].flipped ? ' rotate-y-neg-180deg' : '')
                            }
                        >
                            <div className="back-content">
                                <h1>Back 3</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
