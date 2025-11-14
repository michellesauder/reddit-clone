import { IsString, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  link?: string;

  // Either content OR link must be provided
  @ValidateIf((o) => !o.content && !o.link)
  @IsNotEmpty({ message: 'Either content or link must be provided' })
  _validateContentOrLink?: string;
}
