import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Type extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public description: string

  @column()
  public range: number

  @column({ serializeAs: 'maxNumber' })
  public maxNumber: number

  @column()
  public price: number

  @column({ serializeAs: 'minCartValue' })
  public minCartValue: number

  @column()
  public color: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime
}
