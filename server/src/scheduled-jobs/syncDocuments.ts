

import cron from 'node-cron';
import {services} from "../services/services"

export const syncDocuments = () => {
    cron.schedule('0 */6 * * *', () => {
        services.documentService.syncDocuments();
    });

    // You can define other cron jobs here as well
};

