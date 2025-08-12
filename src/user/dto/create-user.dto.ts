import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  bio: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  age: number;

  @ApiProperty({ required: false, type: () => CreateProfileDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile?: CreateProfileDto;

  @ApiProperty({ required: false, type: [CreatePostDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostDto)
  posts?: CreatePostDto[];

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  roleIds?: number[];
}
