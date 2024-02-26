import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsUUID()
  id?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  content?: string;
  authorEmail?: string;
  published?: boolean;
}
