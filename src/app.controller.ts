import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService) {}

  onModuleInit() {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
