import { createContext, useContext } from 'react';
import { User } from '../types/UserTypes';

export const UserContext = createContext<User | undefined>(undefined);

export function useUserContext() {
    const user = useContext(UserContext);
    if (!user) {
        throw new Error('Please sign in again :)');
    }
    return user;
}
