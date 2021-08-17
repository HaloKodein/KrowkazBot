import { SavedMember, MemberDocument } from '../../models/Member'
import { GuildMember } from 'discord.js'
import DatabaseWrapper from '../../services/Database'
import Bot from '../../entities/Bot'

export default class MemberRepository extends DatabaseWrapper<GuildMember, MemberDocument> {
  constructor(
    private client: Bot
  ) { super() }

  async getOrCreate(member: GuildMember) {
    const savedMember = await SavedMember.findById(member.user.id)

    return savedMember ?? new SavedMember(member).save()
  }

  async create(member: GuildMember) {
    return new SavedMember(member).save()
  }

  async delete(member: GuildMember) {
    return await SavedMember.findByIdAndDelete(member.user.id)
  }
}