import * as React from 'react';
import { TipTap } from '../components/TipTap';

export interface IHomePageProps {}

export function HomePage(props: IHomePageProps) {
    const [jwt, setJWT] = React.useState('')

    // this is temporary 
    const getJWT = async () => {
        try {
          const response = await fetch('http://localhost:3002/');
          const data = await response.json();
          setJWT(data)
        } catch (error) {
          console.error('Error:', error);
        }
      };

    React.useEffect(() => {
        getJWT()
    }, [])
    return (
        <div>
            {jwt ? <TipTap jwt = {jwt}/>: <div>Loading bruh</div> }
        </div>
    );
}
