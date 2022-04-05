
import mongoose from 'mongoose';
import { kmSchema } from '../../db-manager/schema'

export let scansSchema = new kmSchema({
    dateCreation: { type: Date, default: Date.now() },
    url: String,
    linkedTo: String,
    type: String

});

export const Scans = mongoose.model('scans', scansSchema, 'scans');
