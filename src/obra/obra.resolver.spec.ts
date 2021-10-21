import { Test, TestingModule } from '@nestjs/testing';
import { ObraResolver } from './obra.resolver';

describe('ObraResolver', () => {
  let resolver: ObraResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObraResolver],
    }).compile();

    resolver = module.get<ObraResolver>(ObraResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
