import { Test, TestingModule } from '@nestjs/testing';
import { CareerAiController } from './career-ai.controller';

describe('CareerAiController', () => {
  let controller: CareerAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CareerAiController],
    }).compile();

    controller = module.get<CareerAiController>(CareerAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
