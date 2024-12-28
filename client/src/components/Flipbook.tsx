import { useEffect, useState } from 'react';

export interface IFlipbookProps {}



export function Flipbook(props: IFlipbookProps) {
    const [documents, setDocuments] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [currentLocation, setCurrentLocation] = useState(2);

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

    let numOfPapers = documents.length;
    let maxLocation = numOfPapers + 1;
   
    const goNextPage = () => {
        if (currentLocation < maxLocation - 1) {
            setPageStylesState(
                pageStylesState.map((page: any, i: number) => {
                    return i === currentLocation - 1 ? { ...page, flipped: true } : page;
                })
            );
            setCurrentLocation(currentLocation + 1);
        }
    };
    const goPrevPage = () => {
        if (currentLocation > 2) {
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
                <div className={`book translate-x-[50%]`}>
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
                                        zIndex: pageStylesState[index].flipped || index === 0
                                            ? flippedZIndex
                                            : regularZIndex
                                    }}
                                >
                                    <div
                                        className={
                                            'front' +
                                            (pageStylesState[index].flipped || index === 0
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
                                            (pageStylesState[index].flipped || index === 0
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
