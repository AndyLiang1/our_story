import { useState } from 'react';
import Calendar from 'react-calendar';
import { EventMetaData } from '../types/DocumentTypes';
import { CalendarEvents } from './CalendarEvents';

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

        return eventsOnThisDay.length ? <CalendarEvents events={eventsOnThisDay} /> : null;
    };

    return <Calendar onChange={onChange} value={value} tileContent={addEventsToCalendarDay} />;
}
