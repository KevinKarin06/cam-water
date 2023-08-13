import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsString()
  priority: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  deviceId?: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  teamId?: number;
}
