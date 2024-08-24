import * as React from 'react';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { CalendarEvents } from './CalendarEvents';
import { EventMetaData } from '../types/DocumentTypes';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface ICustomCalendarProps {
    events: EventMetaData[];
}

export function CustomCalendar({ events }: ICustomCalendarProps) {
    const [value, onChange] = useState<Value>(new Date());

    const addEventsToCalendarDay = ({ date, view }: any) => {
        if (view !== 'month') return null;
        const calendarDate = date.toISOString().split('T')[0];
        let eventsOnThisDay = [];

        for (let event of events) {
            if (event.eventDate > calendarDate) break;
            if (event.eventDate === calendarDate) {
                eventsOnThisDay.push(event);
            }
        }

        return eventsOnThisDay.length ? (
            // <div className="h-[40%] w-full bg-blue-500">boochi</div>
            // <div className="absolute z-50 h-[2000px] min-h-[2000px] w-[2000px] min-w-[2000px] bg-red-500"></div>
            <CalendarEvents events={eventsOnThisDay} />
        ) : null;
    };

    return <Calendar onChange={onChange} value={value} tileContent={addEventsToCalendarDay} />;
}
