import cron from 'node-cron';
import { services } from '../services/services';

export const pingTipTap = () => {
    cron.schedule(
        '0 0 * * *',
        async () => {
            console.log(`Ping tiptap`);

            const latestDoc = await services.documentService.getLatestDocument();
            if (latestDoc !== null) {
                await services.tiptapDocumentService.getDocument(latestDoc.getDataValue('documentId'));
            }
        },
        {
            timezone: 'America/Vancouver'
        }
    );
};
