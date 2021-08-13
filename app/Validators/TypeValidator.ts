import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TypeValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    types: schema.array.optional([rules.minLength(1), rules.distinct('type')]).members(
      schema.object().members({
        type: schema.string({}, [
          rules.required(),
          rules.unique({ table: 'types', column: 'type', caseInsensitive: true }),
        ]),
        description: schema.string({}, [rules.required()]),
        range: schema.number([rules.required()]),
        max_number: schema.number([rules.required()]),
        price: schema.number([rules.required()]),
        min_cart_value: schema.number([rules.required()]),
        color: schema.string({}, [rules.required()]),
      })
    ),
    type: schema.string.optional({}, [
      rules.requiredIfNotExists('types'),
      rules.unique({ table: 'types', column: 'type', caseInsensitive: true }),
    ]),
    description: schema.string.optional({}, [rules.requiredIfNotExists('types')]),
    range: schema.number.optional([rules.requiredIfNotExists('types')]),
    max_number: schema.number.optional([rules.requiredIfNotExists('types')]),
    price: schema.number.optional([rules.requiredIfNotExists('types')]),
    min_cart_value: schema.number.optional([rules.requiredIfNotExists('types')]),
    color: schema.string.optional({}, [rules.requiredIfNotExists('types')]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
