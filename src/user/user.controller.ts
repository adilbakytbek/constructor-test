import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { UserService } from './user.service'
import { USER_FOUND } from './user.constants'

@Controller('auth')
export class UserController {
	constructor(private readonly userService: UserService) {
	}

	@HttpCode(200)
	@Post('login')
	async login(@Body() userDto: UserDto) {
		const user = await this.userService.validate(userDto)
		return this.userService.login(user)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() userDto: UserDto) {
		const newUser = await this.userService.findbyUser(userDto.email)
		if (newUser) {
			throw new BadRequestException(USER_FOUND)
		}

		return this.userService.register(userDto)

	}
}
