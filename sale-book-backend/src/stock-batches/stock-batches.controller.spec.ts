import { Test, TestingModule } from '@nestjs/testing';
import { StockBatchesController } from './stock-batches.controller';

describe('StockBatchesController', () => {
  let controller: StockBatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockBatchesController],
    }).compile();

    controller = module.get<StockBatchesController>(StockBatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
