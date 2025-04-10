import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsObject, IsOptional, IsString, Max, Min } from "class-validator";

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PagerOptionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;

  @IsOptional()
  @IsString()
  cursor?: string;
}
