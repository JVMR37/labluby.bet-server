import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Type from './Type'

export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column({
    serialize: (value: string) => {
      return value.split(' ').map((number) => {
        return Number(number)
      })
    },
  })
  public numbers: string

  @column()
  public price: number

  @belongsTo(() => Type, {
    serializeAs: 'betType',
  })
  public type: BelongsTo<typeof Type>

  @column()
  public typeId: number

  @column.dateTime({
    autoCreate: true,
    serializeAs: 'createdAt',
  })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime
}
