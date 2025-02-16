import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllDocuments } from '../apis/documentApi';
import { Card } from '../components/Card';
import { DocumentData } from '../types/DocumentTypes';
import { User } from '../types/UserTypes';

export interface IAllStoriesPageProps {}

export function AllStoriesPage(props: IAllStoriesPageProps) {
    const [user, setUser] = useState<User>(useLocation().state);
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [refetchTrigger, setRefetchTrigger] = useState<Object>({});
    // const [showForm, setShowForm] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (user.collabToken) {
                const documents = await getAllDocuments(user.userId, user.collabToken, null, null);
                setDocuments(documents);
            }
        };
        fetchData();
    }, [user, refetchTrigger]);

    return (
        <div className="v-screen relative h-screen flex-wrap items-center">
            {/* {showForm && user && (
                <CreateDocumentForm
                    user={user}
                    setShowForm={setShowForm}
                    setRefetchTrigger={setRefetchTrigger}
                />
            )}
            <NavBar setShowForm={setShowForm} /> */}
            {/* {documents.length ? <div>Docs</div> : <div>Loading</div>} */}
            <div className="h-[10%] bg-red-500"></div>
            <div className="grid h-[80%] w-full grid-cols-[repeat(auto-fit,12rem)] justify-center gap-[3rem] bg-pink-500">
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
                <Card title="hey" date={new Date()} image="/Light_Blue_Circle.png" />
            </div>
        </div>
    );
}
