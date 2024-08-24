import * as React from 'react';
import { EventMetaData } from '../types/DocumentTypes';
import { useState } from 'react';
import {Tooltip} from "./Tooltip"
export interface ICalendarEventsProps {
    events: EventMetaData[];
}

export function CalendarEvents({ events }: ICalendarEventsProps) {
    console.log(events.length)
    return (
        <div className="flex h-[45%] w-full items-center justify-evenly">
            {events.map((event) => {
                return (
                    <div className="h-2 w-2">
                        <Tooltip>
                            <img
                                src="/Light_Blue_Circle.png"
                                className="event-img h-1 max-h-2 w-1 max-w-2"
                                alt=""
                            />
                        </Tooltip>
                        {/* <div className="absolute h-[200px] w-[200px] min-h-[200px] min-w-[200px] bg-red-700 z-10">Hello</div> */}
                    </div>
                );
            })}
        </div>
    );
}
