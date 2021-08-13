import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Type from './Type'

export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public numbers: string

  @column()
  public price: number

  @hasOne(() => Type, {
    serializeAs: 'betType',
  })
  public type: HasOne<typeof Type>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
