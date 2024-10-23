import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { EventMetaData } from '../types/DocumentTypes';
import { GenericCalendarEvents } from './GenericCalendarEvents';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface IGenericCalendarProps {
    events: EventMetaData[];
}

export function GenericCalendar({ events }: IGenericCalendarProps) {
    const [value, setValue] = useState<Value>(new Date('2024-10-02'));

    const addEventsToCalendarDay = ({ date, view }: any) => {
        if (view !== 'month') return null;
        const calendarDate = date.toISOString().split('T')[0];
        let eventsOnThisDay = [];
        for (let event of events) {
            if (event.date.toISOString().split('T')[0] > calendarDate) continue;
            if (event.date.toISOString().split('T')[0] === calendarDate) {
                eventsOnThisDay.push(event);
            }
        }

        return eventsOnThisDay.length ? <GenericCalendarEvents events={eventsOnThisDay} /> : null;
    };

    return <Calendar onChange={setValue} value={value} tileContent={addEventsToCalendarDay} />;
}
