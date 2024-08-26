import * as React from 'react';
import { useEffect, useState } from 'react';
import { BiCollapseHorizontal } from 'react-icons/bi';
import { GenericSearchBar } from './GenericSearchBar';
import { EventMetaData } from '../types/DocumentTypes';

export interface ISideBarProps {
    dataList: EventMetaData[];
}

export function SideBar({ dataList }: ISideBarProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    return isOpen ? (
        <SideBarOpen dataList={dataList} isOpen={isOpen} setIsOpen={setIsOpen} />
    ) : (
        <SideBarClosed isOpen={isOpen} setIsOpen={setIsOpen} />
    );
}

interface ISideBarOpenProps {
    dataList: EventMetaData[];
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SideBarOpen({ dataList, isOpen, setIsOpen }: ISideBarOpenProps) {
    const [filteredDataList, setFilteredDataList] = useState<EventMetaData[]>(dataList);

    return (
        <div className="relative h-full w-[15%] flex-col items-center justify-center bg-blue-50 text-center">
            <BiCollapseHorizontal
                className="absolute right-0 top-0"
                onClick={() => setIsOpen(!isOpen)}
            />
            <div className="h-[2rem] w-full bg-red-400 text-[1rem]">Stories</div>

            <div className="flex h-[5%] w-full items-center justify-center">
                <GenericSearchBar dataList={dataList} setFilteredDataList={setFilteredDataList} />
            </div>
            <div className="flex-col items-center justify-center">
                {filteredDataList.map((data) => {
                    return <DataItem itemName={data.name} />;
                })}
            </div>
        </div>
    );
}
interface ISideBarClosedProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SideBarClosed({ isOpen, setIsOpen }: ISideBarClosedProps) {
    return (
        <div className="relative h-full w-[3%] bg-blue-50">
            <BiCollapseHorizontal
                className="absolute right-0 top-0"
                onClick={() => setIsOpen(!isOpen)}
            />
        </div>
    );
}

interface IDataItemProps {
    itemName: string;
}

function DataItem({ itemName }: IDataItemProps) {
    return <div>{itemName}</div>;
}
