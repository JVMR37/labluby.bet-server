import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TypeValidator from 'App/Validators/TypeValidator'
import Type from 'App/Models/Type'

export default class TypesController {
  public async index() {
    const types = await Type.all()

    return types
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(TypeValidator)

    try {
      const newTypes = await request.input('types')
      let type: any

      if (newTypes) {
        type = await Type.createMany(newTypes)
      } else {
        type = await Type.create(request.all())
      }

      return response.ok(type)
    } catch (error) {
      return response.badRequest(...error)
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const typeId = params.id

      const type = await Type.findByOrFail('id', typeId)

      return type
    } catch (error) {
      return response.badRequest(...error)
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const typeId = params.id

      const type = await Type.findByOrFail('id', typeId)
      const newDataType = request.all()

      type.merge(newDataType)

      await type.save()

      return type.serialize()
    } catch (error) {
      return response.badRequest(...error)
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const typeId = params.id

      const type = await Type.findByOrFail('id', typeId)

      return await type.delete()
    } catch (error) {
      return response.badRequest(...error)
    }
  }
}
