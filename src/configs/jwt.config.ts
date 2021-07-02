import { JwtModuleOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

export const getJWTConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
	return {
		secret: configService.get('SECRET_KEY'),
		signOptions: {
			expiresIn: '24h'
		}
	}
}
