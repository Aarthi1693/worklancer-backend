import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
} from "@nestjs/common";

import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-applications.dto";

@Controller("applications")
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @Patch(":id/accept")
  accept(@Param("id") id: string) {
    return this.applicationsService.accept(id);
  }

  @Patch(":id/reject")
  reject(@Param("id") id: string) {
    return this.applicationsService.reject(id);
  }
}