import { Test, TestingModule } from '@nestjs/testing';
import { StockBatchesService } from './stock-batches.service';

describe('StockBatchesService', () => {
  let service: StockBatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockBatchesService],
    }).compile();

    service = module.get<StockBatchesService>(StockBatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
