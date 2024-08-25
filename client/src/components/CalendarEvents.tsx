import { EventMetaData } from '../types/DocumentTypes';
import { Tooltip } from './Tooltip';

// import { Tooltip } from 'react-tooltip'

export interface ICalendarEventsProps {
    events: EventMetaData[];
}

export function CalendarEvents({ events }: ICalendarEventsProps) {
    console.log(events.length);
    return (
        <div className="flex h-[45%] w-full items-center justify-evenly">
            {events.map((event) => {
                return (
                    <div className="flex h-2 w-2 items-center justify-center">
                        <Tooltip tooltipContent={event.eventTitle}>
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
