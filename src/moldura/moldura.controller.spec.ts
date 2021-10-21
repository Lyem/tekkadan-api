import { Test, TestingModule } from '@nestjs/testing';
import { MolduraController } from './moldura.controller';

describe('MolduraController', () => {
  let controller: MolduraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MolduraController],
    }).compile();

    controller = module.get<MolduraController>(MolduraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
