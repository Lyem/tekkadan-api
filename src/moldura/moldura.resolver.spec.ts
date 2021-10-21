import { Test, TestingModule } from '@nestjs/testing';
import { MolduraResolver } from './moldura.resolver';

describe('MolduraResolver', () => {
  let resolver: MolduraResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MolduraResolver],
    }).compile();

    resolver = module.get<MolduraResolver>(MolduraResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
