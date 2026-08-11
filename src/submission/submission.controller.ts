import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  // ==========================
  // Upload Files
  // ==========================
  @Post('files')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      dest: './uploads',
    }),
  )
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return files.map((file) => ({
      url: `/uploads/${file.filename}`,
      originalName: file.originalname,
    }));
  }

  // ==========================
  // Create Submission
  // ==========================
  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  // ==========================
  // Get All
  // ==========================
  @Get()
  findAll() {
    return this.submissionService.findAll();
  }

  // ==========================
  // Provider Submissions
  // ==========================
  @Get('provider')
  getProviderSubmissions() {
    return this.submissionService.getAllSubmissions();
  }

  // ==========================
  // Get One
  // ==========================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  // ==========================
  // Update
  // ==========================
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionService.update(id, updateSubmissionDto);
  }

  // ==========================
  // Delete
  // ==========================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }
}