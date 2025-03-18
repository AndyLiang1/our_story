import { EventMetaData } from '../types/DocumentTypes';
import { Tooltip } from './Tooltip';

export interface IGenericCalendarEventsProps {
    events: EventMetaData[];
    handleClick: (id: string) => void;
}

export function GenericCalendarEvents({ events, handleClick }: IGenericCalendarEventsProps) {
    return (
        <div className="flex h-[45%] w-full items-center justify-evenly">
            {events.map((event, index) => {
                return (
                    <div
                        key = {index}
                        className="flex h-2 w-2 items-center justify-center"
                        onClick={() => handleClick(event.id)}
                    >
                        <Tooltip tooltipContent={event.name}>
                            <img
                                src="/Light_Blue_Circle.png"
                                className="event-img h-1 max-h-2 w-1 max-w-2"
                                alt=""
                            />
                        </Tooltip>
                    </div>
                );
            })}
        </div>
    );
}
