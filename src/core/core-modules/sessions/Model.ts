
import mongoose from 'mongoose';
import { kmSchema } from './../../../core/db-manager/schema'

export let sessionsSchema = new kmSchema({
    dateCreation: { type: Date, default: Date.now() },
    UID: String,
    Platform: String,
    username: String,
    devicePlatform: String,
    registrationId: String,
    deviceId: String,
    MarketCode: String,
    IsPartner: String,
    CompanyID: String,
    CompanyName: String,
    isSA: String,
    hosturl: String,
    token: String,
    permissions: [String]

});

export const Sessions = mongoose.model('sessions', sessionsSchema, 'sessions');
