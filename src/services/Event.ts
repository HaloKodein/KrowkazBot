import { readdir } from 'fs'

import Bot from '../entities/Bot'
import GuildRepository from '../repositories/guild/Repository'
import MemberRepository from '../repositories/member/Repository'
import UserRepository from '../repositories/user/Repository'

export default class EventManager {
    constructor(
        private client: Bot,
        public guildRepository: GuildRepository,
        public memberRepository: MemberRepository,
        public userRepository: UserRepository
    ) {}

    public async handle(): Promise<void> {
        readdir('./src/events', (err, files) => {
            if (err)  throw new TypeError(err.message)
            files.forEach(async props => {
                const { default: event } = await import(`../events/${props}`)
               
                try {
                    this.client.on(
                        event.name,
                        event.invoke
                            .bind(null, this.client)
                    )

                    console.log(`[LOADING] Event: ${event.name}`)
                } catch(err) {
                    throw new TypeError(err.message)
                }
            })
        })
    }
}
