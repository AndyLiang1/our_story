import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getDocumentsInMonth } from '../apis/documentApi';
import { DocumentData, EventMetaData } from '../types/DocumentTypes';
import { GenericCalendarEvents } from './GenericCalendarEvents';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface IDateCalendarProps {
    events?: EventMetaData[];
    goToEvent?: Function;
    userId: string;
    collabToken: string;
    disabled: boolean;
}

const prevLabel = (
    <div className="flex justify-start pl-2 text-[0.8rem]">
        <FaChevronLeft />
    </div>
);

const nextLabel = (
    <div className="flex justify-end pr-2 text-[0.8rem]">
        <FaChevronRight />
    </div>
);

const formatShortWeekday = (locale: any, date: Date) =>
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];

export function DateCalendar({ userId, collabToken, disabled }: IDateCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Value>(new Date());
    const [events, setEventsInMonth] = useState<EventMetaData[]>([]);

    useEffect(() => {
        if (!disabled) {
            const fetchDocumentsInMonth = async () => {
                const documents: DocumentData[] = await getDocumentsInMonth(
                    new Date(),
                    userId,
                    collabToken
                );
                setEventsInMonth(
                    documents.map((doc: DocumentData) => {
                        return { id: doc.documentId, name: doc.title, date: doc.eventDate };
                    })
                );
            };
            fetchDocumentsInMonth();
        }
    }, [disabled]);

    const addEventsToCalendarDay = ({ date, view }: any) => {
        if (view !== 'month') return null;
        const calendarDate = date.toISOString().split('T')[0];
        let eventsOnThisDay: any[] = [];
        for (let event of events) {
            if (event.date.toISOString().split('T')[0] > calendarDate) continue;
            if (event.date.toISOString().split('T')[0] === calendarDate) {
                eventsOnThisDay.push(event);
            }
        }

        return eventsOnThisDay.length ? <GenericCalendarEvents events={eventsOnThisDay} /> : null;
    };

    const handleMonthChange = ({ action, activeStartDate, value, view }: any) => {
        if (!disabled) {
            const fetchDocumentsInMonth = async () => {
                const documents: DocumentData[] = await getDocumentsInMonth(
                    activeStartDate,
                    userId,
                    collabToken
                );
                console.log('Docs', documents);
                setEventsInMonth(
                    documents.map((doc: DocumentData) => {
                        return { id: doc.documentId, name: doc.title, date: doc.eventDate };
                    })
                );
            };
            fetchDocumentsInMonth();
        }
    };

    return (
        <Calendar
            // onChange={setSelectedDate}
            value={selectedDate}
            tileContent={addEventsToCalendarDay}
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            calendarType={'gregory'}
            formatShortWeekday={formatShortWeekday}
            minDetail="year"
            onActiveStartDateChange={handleMonthChange}
        />
    );
}
