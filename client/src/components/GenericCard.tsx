export interface IGenericCardProps {
    title: string;
    date: Date;
    image: string | undefined;
    defaultImage: string;
    handleClick?: () => void;
}

export function GenericCard({ title, date, image, defaultImage, handleClick }: IGenericCardProps) {
    const imageComponent = (
        <div className="relative box-border flex h-[70%] w-full items-center overflow-hidden text-center">
            <img
                src={image ? image : defaultImage}
                className="absolute z-[2] h-full w-full object-contain"
                alt=""
            />
            <img
                src={image ? image : defaultImage}
                className="absolute inset-0 z-[1] h-full w-full overflow-hidden rounded-t-[2.5rem] bg-center object-cover opacity-70 blur-sm"
                alt=""
            />
        </div>
    );
    return (
        <div
            className="mr-2 h-[13rem] w-[12rem] cursor-pointer rounded-[1rem] bg-white transition duration-200 hover:scale-105"
            onClick={handleClick}
        >
            {imageComponent}
            <div className="h-[30%] w-full">
                <div className="flex h-[50%] w-full items-center justify-center text-center">
                    {title}
                </div>
                <div className="box-border flex h-[50%] w-full items-center justify-center pb-2 text-center">
                    {date.toISOString().split('T')[0]}
                </div>
            </div>
        </div>
    );
}
