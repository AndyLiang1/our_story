import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getDocumentsInMonth } from '../apis/documentApi';
import { useUserContext } from '../context/userContext';
import { DocumentData, EventMetaData } from '../types/DocumentTypes';
import { GenericCalendarEvents } from './GenericCalendarEvents';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface IDateCalendarProps {
    handleEventClick: (id: string) => void;
    disabled: boolean;
    startDate: Date;
    currEventId?: string;
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

export function DateCalendar({
    handleEventClick,
    disabled,
    startDate,
    currEventId
}: IDateCalendarProps) {
    const user = useUserContext();
    const navigate = useNavigate();
    const { collabToken, userId } = user;
    const [selectedDate, setSelectedDate] = useState<Value>(startDate);
    const [events, setEventsInMonth] = useState<EventMetaData[]>([]);

    useEffect(() => {
        if (!disabled) {
            const fetchDocumentsInMonth = async () => {
                const documents: DocumentData[] = await getDocumentsInMonth(
                    startDate,
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
        if (!events.length) return;
        if (view !== 'month') return null;
        const calendarDate = date.toISOString().split('T')[0];
        const eventsOnThisDay: any[] = [];
        for (const event of events) {
            if (event.date.toISOString().split('T')[0] === calendarDate) {
                eventsOnThisDay.push(event);
            }
        }

        return eventsOnThisDay.length ? (
            <GenericCalendarEvents
                events={eventsOnThisDay}
                handleClick={handleEventClick}
                currEventId={currEventId}
            />
        ) : null;
    };

    const addStyleToCurrEvent = ({ date, view }: any) => {
        const calendarDate = date.toISOString().split('T')[0];

        for (const event of events) {
            if (
                event.id === currEventId &&
                event.date.toISOString().split('T')[0] === calendarDate
            ) {
                return 'curr_event_date';
            }
        }
        return null;
    };

    const handleMonthChange = ({ action, activeStartDate, value, view }: any) => {
        if (!disabled) {
            const fetchDocumentsInMonth = async () => {
                const documents: DocumentData[] = await getDocumentsInMonth(
                    activeStartDate,
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
    };

    return (
        <Calendar
            // onChange={setSelectedDate}
            value={selectedDate}
            tileContent={addEventsToCalendarDay}
            tileClassName={addStyleToCurrEvent}
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            calendarType={'gregory'}
            formatShortWeekday={formatShortWeekday}
            minDetail="year"
            onActiveStartDateChange={handleMonthChange}
        />
    );
}
