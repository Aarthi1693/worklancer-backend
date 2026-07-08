import { Test, TestingModule } from '@nestjs/testing';
import { ProviderService } from './provider.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('ProviderService', () => {
  let service: ProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ProviderService],
    }).compile();

    service = module.get<ProviderService>(ProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
