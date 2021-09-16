import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Types extends BaseSchema {
  protected tableName = 'types'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('type', 144).notNullable().unique()
      table.string('description', 255).notNullable()

      table.integer('range').notNullable()
      table.integer('max_number').notNullable()

      table.float('price').notNullable()
      table.integer('min_cart_value').notNullable()
      table.string('color', 20).notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
