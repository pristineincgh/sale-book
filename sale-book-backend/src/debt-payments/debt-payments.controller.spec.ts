import { Test, TestingModule } from '@nestjs/testing';
import { DebtPaymentsController } from './debt-payments.controller';

describe('DebtPaymentsController', () => {
  let controller: DebtPaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtPaymentsController],
    }).compile();

    controller = module.get<DebtPaymentsController>(DebtPaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
