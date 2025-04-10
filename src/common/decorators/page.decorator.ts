import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PagerOptionsDto } from '../dto/pager.option.dto';

export const Pager = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PagerOptionsDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const pager = plainToInstance(PagerOptionsDto, query, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(pager, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });

    if (errors.length > 0) {
      throw new Error('Invalid pagination parameters');
    }

    return pager;
  },
);
