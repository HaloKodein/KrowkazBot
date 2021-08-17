import {
    ICommand,
    ICommandConfig,
    ICommandContext
} from '../interfaces/ICommand'
import {
    MessageEmbed,
    TextChannel
} from 'discord.js'

import config from '../config'

export default new class Clear implements ICommand {
    public config: ICommandConfig = {
        name: 'eval',
        usage: `${config.prefix}eval <code>`,
        description: 'Executa um código javascript.',
        aliases: ['e'],
        permissions: ['OWNER'],
        maintenance: false,
        disabled: false,
        onlyGuilds: true
    }

    public async invoke({ message, args }: ICommandContext): Promise<any> {
        const code = args.join(' ')
        await eval(code)

        message.channel.send('Executado')
    }
}
