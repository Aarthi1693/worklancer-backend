import { Test, TestingModule } from '@nestjs/testing';
import { MasterService } from './master.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('MasterService', () => {
  let service: MasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [MasterService],
    }).compile();

    service = module.get<MasterService>(MasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
