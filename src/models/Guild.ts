import { model, Schema, Document } from 'mongoose'

export class Module {
    enabled: boolean = true
}

export interface DefaultObject {
    _id: string,
    name: string
}

export class LogModule extends Module {
    roles: DefaultObject[] = []
}

export class autoRoleModule extends Module {
    channels: DefaultObject[] = []
}

export class GuildSettings {
    isPremium: boolean = false
    blackListChannel: DefaultObject[] = []
    blackListRole:  DefaultObject[] = []
    prefix: string = '.'
}

const GuildSchema = new Schema({
    _id: String,
    settings: { type: Object, default: new GuildSettings() },
    autoRoleModule: { type: Object, default: new autoRoleModule() },
    logModule: { type: Object, default: new LogModule() }
}, {
    timestamps: true
})

export interface GuildDocument extends Document {
    _id: string,
    settings: GuildSettings,
    autoRoleModule: autoRoleModule,
    logModule: LogModule,
}

export const SavedGuild = model<GuildDocument>('Guild', GuildSchema)
