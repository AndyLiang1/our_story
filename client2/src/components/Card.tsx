export interface ICardProps {
    title: string;
    date: Date;
    image?: string;
    defaultImage?: string;
}

export function Card({ title, date, image }: ICardProps) {
    const defaultImage = (
        <div className="relative box-border flex h-[70%] w-full items-center overflow-hidden text-center">
            <img
                src="/autumn-landscape-building-city-blue-600nw-2174533935.png"
                className="absolute z-[2] h-full w-full object-contain"
                alt=""
            />
            <img
                src="/autumn-landscape-building-city-blue-600nw-2174533935.png"
                className="absolute inset-0 z-[1] h-full w-full overflow-hidden rounded-t-[2.5rem] bg-center object-cover opacity-70 blur-sm"
                alt=""
            />
        </div>
    );
    const imageComponent = (
        <div className="relative box-border flex h-[70%] w-full items-center overflow-hidden text-center">
            <img src={image} className="absolute z-[2] h-full w-full object-contain" alt="" />
            <img
                src={image}
                className="absolute inset-0 z-[1] h-full w-full overflow-hidden rounded-t-[2.5rem] bg-center object-cover opacity-70 blur-sm"
                alt=""
            />
        </div>
    );
    return (
        <div className="mr-2 h-[13rem] w-[12rem] cursor-pointer rounded-[1rem] bg-white transition duration-200 hover:scale-105">
            {image ? imageComponent : defaultImage}
            {/* <img src={image ? image : '/autumn-landscape-building-city-blue-600nw-2174533935.png'} className="h-[70%] w-full" alt="" /> */}
            <div className="h-[30%] w-full">
                <div className="flex h-[50%] w-full items-center justify-center text-center">
                    {title}
                </div>
                <div className="box-border flex h-[50%] w-full items-center justify-center pb-2 text-center">
                    {date
                        .toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                        })
                        .replace(',', '')}
                </div>
            </div>
        </div>
    );
}
