import { EventMetaData } from '../types/DocumentTypes';
import { Tooltip } from './Tooltip';

export interface IGenericCalendarEventsProps {
    events: EventMetaData[];
}

export function GenericCalendarEvents({ events }: IGenericCalendarEventsProps) {
    return (
        <div className="flex h-[45%] w-full items-center justify-evenly">
            {events.map((event) => {
                return (
                    <div className="flex h-2 w-2 items-center justify-center">
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
