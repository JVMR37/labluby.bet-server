import { DateTime } from 'luxon'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Bet from './Bet'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public password: string

  @hasMany(() => Bet, {
    onQuery(query) {
      if (!query.isRelatedSubQuery) {
        query.preload('type')
      }
    },
  })
  public bets: HasMany<typeof Bet>

  @column()
  public isAdmin: boolean

  @column({ columnName: 'reset_password_token' })
  public resetPasswordToken: string | null

  @column.dateTime({ columnName: 'reset_password_token_created_at' })
  public resetPasswordTokenCreatedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
