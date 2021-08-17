import { SavedUser, UserDocument } from '../../models/User'
import DatabaseWrapper from '../../services/Database'
import SnowflakeEntity from '../../entities/Snowflake'
import Bot from '../../entities/Bot'

export default class UserRepository extends DatabaseWrapper<SnowflakeEntity, UserDocument> {
  constructor(
    private client: Bot
  ) { super() }

  async getOrCreate({ id }: SnowflakeEntity) {
    const savedUser = await SavedUser.findById(id)

    return savedUser ?? new SavedUser({ _id: id }).save()
  }

  async create({ id }: SnowflakeEntity) {
    return new SavedUser({ _id: id }).save()
  }

  async delete({ id }: SnowflakeEntity) {
    return await SavedUser.findByIdAndDelete(id)
  }
}