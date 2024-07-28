import * as React from 'react';
import { TipTap } from '../components/TipTap';

export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
    return (
        <div>
            <TipTap />
        </div>
    );
}
