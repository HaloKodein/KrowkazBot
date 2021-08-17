import { Client, Intents } from 'discord.js'
import EventManager from '../services/Event'
import CommandManager from '../services/Command'
import InteractionCommandManager from '../services/Interaction'
import UserRepository from '../repositories/user/Repository'
import GuildRepository from '../repositories/guild/Repository'
import MemberRepository from '../repositories/member/Repository'

export default class Bot extends Client {
    constructor(
    ) {
        super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
    }

    public commandManager = new CommandManager(
        this,
        new GuildRepository(this),
        new MemberRepository(this),
        new UserRepository(this)
    )

    public eventManager = new EventManager(
        this,
        new GuildRepository(this),
        new MemberRepository(this),
        new UserRepository(this)
    )

    public interactionCommandManager = new InteractionCommandManager(
        this,
        new GuildRepository(this),
        new MemberRepository(this),
        new UserRepository(this)
    )
}
