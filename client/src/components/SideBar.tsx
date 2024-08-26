import * as React from 'react';
import { useState } from 'react';
import { BiCollapseHorizontal } from 'react-icons/bi';

export interface ISideBarProps {
    dataList: string[];
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
    dataList: string[];
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SideBarOpen({ dataList, isOpen, setIsOpen }: ISideBarOpenProps) {
    return (
        <div className="relative h-full w-[15%] bg-blue-50">
            <BiCollapseHorizontal
                className="absolute right-0 top-0"
                onClick={() => setIsOpen(!isOpen)}
            />
            <div className="">Stories</div>
            {dataList.map((itemTitle: string) => {
                return <DataItem itemTitle={itemTitle} />;
            })}
        </div>
    );
}
interface ISideBarClosedProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SideBarClosed({isOpen, setIsOpen}: ISideBarClosedProps) {
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
    itemTitle: string;
}

function DataItem({ itemTitle }: IDataItemProps) {
    return <div>{itemTitle}</div>;
}
