export interface ICardProps {
    title: string;
    date: Date;
    image: string;
}

export function Card({title, date, image}: ICardProps) {
    return (
        <div className="h-[14rem] w-[12rem] bg-blue-200 mr-2">
            
            <img
                src={image}
                className="h-1 max-h-2 w-1 max-w-2"
                alt=""
            />
            <div className=""></div>
        </div>
    );
}
