import cron from 'node-cron';
import { services } from '../services/services';

export const syncDocumentsYdocBinaryDataToJson= () => {
    cron.schedule(
        '0 0 * * *',
        async () => {
            console.log("Begin sync...")
            const numberOfUpdatedDocs = await services.documentService.syncDocumentsYdocBinaryDataToJson();
            console.log(`Synced ${numberOfUpdatedDocs} documents' ydoc information into JSON.`);
        },
        {
            timezone: 'America/Vancouver'
        }
    );
};
