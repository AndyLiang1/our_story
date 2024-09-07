import { useState } from 'react';
import Calendar from 'react-calendar';
import { EventMetaData } from '../types/DocumentTypes';
import { GenericCalendarEvents } from './GenericCalendarEvents';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface IGenericCalendarProps {
    events: EventMetaData[];
}

export function GenericCalendar({ events }: IGenericCalendarProps) {
    const [value, onChange] = useState<Value>(new Date());

    const addEventsToCalendarDay = ({ date, view }: any) => {
        if (view !== 'month') return null;
        const calendarDate = date.toISOString().split('T')[0];
        let eventsOnThisDay = [];

        for (let event of events) {
            if (event.date > calendarDate) break;
            if (event.date === calendarDate) {
                eventsOnThisDay.push(event);
            }
        }

        return eventsOnThisDay.length ? <GenericCalendarEvents events={eventsOnThisDay} /> : null;
    };

    return <Calendar onChange={onChange} value={value} tileContent={addEventsToCalendarDay} />;
}
