import * as React from 'react';
import { useEffect, useState } from 'react';
import { HasName } from '../types/GenericTypes';

export interface IGenericSearchBarProps<T extends HasName> {
    dataList: T[];
    setFilteredDataList: React.Dispatch<React.SetStateAction<T[]>>;
}

export function GenericSearchBar<T extends HasName>({
    dataList,
    setFilteredDataList
}: IGenericSearchBarProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleClick = () => {};

    useEffect(() => {
        const filteredList = dataList.filter((data: T) => {
            if (searchTerm === '') {
                return data;
            } else if (data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return data;
            }
            return;
        });
        setFilteredDataList(filteredList);
    }, [searchTerm]);

    return (
        <div className="relative flex h-full w-full items-center justify-center bg-pink-600 text-center">
            <input
                onChange={(event) => {
                    setSearchTerm(event?.target.value);
                }}
                className="h-[75%] w-[90%] min-w-[90%] pl-2 focus:outline-none"
                placeholder="Search here..."
            />
        </div>
    );
}
