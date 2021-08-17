import { Message, Permissions } from 'discord.js'
import { ICommand } from '../interfaces/ICommand'
import { IVerifyPermissions } from '../interfaces/IVerifyPermissions'
import { UserDocument } from '../models/User'
import { readdir } from 'fs'

import Bot from '../entities/Bot'
import GuildRepository from '../repositories/guild/Repository'
import MemberRepository from '../repositories/member/Repository'
import UserRepository from '../repositories/user/Repository'
import config from '../config'

export default class CommandManager {
    constructor(
        private client: Bot,
        public guildRepository: GuildRepository,
        public memberRepository: MemberRepository,
        public userRepository: UserRepository
    ) {}

    public commands = new Map<String, ICommand>()
    public aliases = new Map<String, String>()

    public async handle(): Promise<any> {
        readdir('./src/commands/', (err, files) => {
            if (err) throw new TypeError(err.message)
            files.forEach(async props => {
                if (props.split('.').slice(-1)[0] !== 'ts') return
                const { default: command } = await import(`../commands/${props}`)

                this.commands.set(command.config.name
                    .toLowerCase(), command)

                command.config.aliases
                    .forEach(alias => {
                        this.aliases
                            .set(alias, command.config.name
                                .toLowerCase())
                    })

                console.log(`[LOADING] Command: ${command.config.name}`)
            })
        })
    }

    public async invoke(message: Message): Promise<any> {
        const guild = await this.guildRepository.getOrCreate(message.guild)
        const prefix = guild.settings.prefix || config.prefix

        if (message.author.bot) return
        if (!message.content.startsWith(prefix)) return

        const member = await this.memberRepository.getOrCreate(message.member)
        const user = await this.userRepository.getOrCreate(message.author)

        const args = message.content
            .slice(prefix.length)
            .split(/ +/g)

        const target = args
            .shift()
            .toLowerCase()

        const command = await this.findCommand(target)
        
        if (command.config.maintenance) return message.channel.send('O comando está em manutenção!')
        if (command.config.disabled) return message.channel.send('O comando está desativado!')

        if (command.config.permissions.length >= 1) {
            const result = await this.verifyPermissions(message, command.config.permissions, user)

            if (typeof result.memberHasOwnerPermissions === 'boolean') {
                if (!result.memberHasOwnerPermissions) return message.channel
                    .send(`Você não tem permissão para usar esse comando.`)
            } else {
                if (!result.botHasPermissions) return message.channel
                .send(`O bot precisa das permissões\n\`\`\`${result.permissions
                    .map(e => e).join(',')}\`\`\``)

                if (!result.memberHasPermissions) return message.channel
                    .send(`Você precisa das permissões\n\`\`\`${result.permissions
                        .map(e => e).join(',')}\`\`\``)
            }
        }

        if (
            command.config.onlyGuilds &&
            message.channel.type !== 'DM') {
                try {
                    command.invoke({
                        client: this.client,
                        message,
                        args: args
                    })
                } catch(err) {
                    throw new TypeError(err.message)
                }
        } else if (
            !command.config.onlyGuilds &&
            message.channel.type === 'DM'){
                try {
                    command.invoke({
                        client: this.client,
                        message,
                        args: args
                    })
                } catch(err) {
                    throw new TypeError(err.message)
                }
        } else {
            message.channel
                .send(`O comando não é permitido nesse canal.`)
        }
    }

    private async findCommand(target: string): Promise<ICommand> {
        return this.commands.get(target)
        ?? this.commands.get(this.aliases.get(target))
    }

    private async verifyPermissions(message: Message, permissions: string[], user: UserDocument): Promise<IVerifyPermissions> {
        let result = {
            botHasPermissions: false,
            memberHasPermissions: false,
            memberHasOwnerPermissions: false,
            permissions: null
        }

        permissions.forEach(permission => {
            if (permission === 'OWNER') {
                if (
                    user.settings.isAdmin ||
                    message.author.id === config.owner
                ) result.memberHasOwnerPermissions = true
            
                return result
            } else {
                result.memberHasOwnerPermissions = null
            }

            result.permissions = permissions
            if (message.member.permissions
                .has(Permissions.FLAGS[permission])) result
                    .memberHasPermissions = true
            
            if (message.guild.members.cache
                .get(message.client.user.id).permissions
                .has(Permissions.FLAGS[permission])) result
                    .botHasPermissions = true
        })

        return result
    }
}
