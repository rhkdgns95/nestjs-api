import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get()
  getHome(): string {
    return 'Welcome to...';
  }
}
