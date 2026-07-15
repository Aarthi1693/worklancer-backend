import { Test, TestingModule } from '@nestjs/testing';
import { CareerAiService } from './career-ai.service';

describe('CareerAiService', () => {
  let service: CareerAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CareerAiService],
    }).compile();

    service = module.get<CareerAiService>(CareerAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
