import cron from 'node-cron';
import { services } from '../services/services';

export const syncDocuments = () => {
    cron.schedule(
        '0 0 * * *',
        async () => {
            const numberOfUpdatedDocs = await services.documentService.syncDocuments();
            console.log(`Synced ${numberOfUpdatedDocs} documents`);
        },
        {
            timezone: 'America/Vancouver'
        }
    );
};
