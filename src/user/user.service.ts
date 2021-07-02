import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UserDto } from './dto/user.dto'
import { compare, genSalt, hash } from 'bcryptjs'
import { PASSWORD_NOT_MATCH, USER_NOT_FOUND } from './user.constants'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
	constructor
	(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {
	}

	async register(userDto: UserDto) {
		const salt = await genSalt(10)
		return new this.userModel({
			email: userDto.email,
			password: await hash(userDto.password, salt),
		}).save()
	}

	async findbyUser(email: string) {
		return this.userModel.findOne({ email }).exec()
	}

	async validate(userDto: UserDto) {
		const candidate = await this.findbyUser(userDto.email)

		if (!candidate) {
			throw new UnauthorizedException(USER_NOT_FOUND)
		}

		const correctPassword = await compare(userDto.password, candidate.password)

		if (!correctPassword) {
			throw new UnauthorizedException(PASSWORD_NOT_MATCH)
		}

		return candidate

	}

	async login(userDto: UserDto) {
		const payload = { email: userDto.email, _id: userDto._id }
		const token = await this.jwtService.signAsync(payload)
		const verify = await this.jwtService.verify(token)
		return {
			accessToken: 'Bearer ' + token,
			expiresIn: verify.exp
		}
	}


}
