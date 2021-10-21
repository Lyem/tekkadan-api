import { Test, TestingModule } from '@nestjs/testing';
import { MolduraService } from './moldura.service';

describe('MolduraService', () => {
  let service: MolduraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MolduraService],
    }).compile();

    service = module.get<MolduraService>(MolduraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
