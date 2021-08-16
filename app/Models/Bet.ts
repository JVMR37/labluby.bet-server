import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Type from './Type'
import User from './User'

export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public numbers: string

  @column()
  public price: number

  @belongsTo(() => Type, {
    foreignKey: 'id',
    serializeAs: 'betType',
  })
  public type: BelongsTo<typeof Type>

  @column()
  public typeId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
