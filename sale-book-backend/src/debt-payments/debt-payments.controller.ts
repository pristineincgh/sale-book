import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DebtPaymentsService } from './debt-payments.service';
import type { AuthenticatedUser } from 'src/auth/types/authenticated-user.type';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateDebtPaymentDto } from './dto/create-debt-payment.dto';

@Controller('debt-payments')
@UseGuards(JwtAuthGuard)
export class DebtPaymentsController {
  constructor(private readonly debtPaymentsService: DebtPaymentsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createDebtPaymentDto: CreateDebtPaymentDto,
  ) {
    return this.debtPaymentsService.create(user.id, createDebtPaymentDto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.debtPaymentsService.findAll(user.id);
  }

  @Get('outstanding')
  findOutstanding(@CurrentUser() user: AuthenticatedUser) {
    return this.debtPaymentsService.findOutstanding(user.id);
  }

  @Get('sale/:saleId')
  findBySale(
    @CurrentUser() user: AuthenticatedUser,
    @Param('saleId') saleId: string,
  ) {
    return this.debtPaymentsService.findBySale(user.id, saleId);
  }
}
