import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsStrongPassword,
	MaxLength,
} from 'class-validator';
export class SignUpDto {
	@IsNotEmpty()
	@MaxLength(50)
	first_name: string;

	@IsNotEmpty()
	@MaxLength(50)
	last_name: string;

	@IsOptional()
	@MaxLength(50)
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;

	@IsOptional()
	organizationId: string;
}

export class SignUpGoogleDto {
	@IsNotEmpty()
	code?: string;

	first_name: string;

	last_name: string;

	email: string;

	avatar?: string;

	is_registered_with_google?: boolean;
}
