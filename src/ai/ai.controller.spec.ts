import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiModule } from './ai.module';

describe('AiController', () => {
  let controller: AiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AiModule],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
