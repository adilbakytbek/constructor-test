import { Types } from 'mongoose'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class UserDto {
	_id?: Types.ObjectId
	@IsEmail({} ,{message: 'Некорректный E-mail'})
	email: string
	@IsString()
	@MinLength(4, {message: 'Минимальный количества символа 4'})
	password: string
}
