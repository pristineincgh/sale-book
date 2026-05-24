import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/types/authenticated-user.type';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('today')
  getTodayReport(@CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.getTodayReport(user.id);
  }

  @Get('summary')
  getSummaryReport(@CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.getSummaryReport(user.id);
  }

  @Get('active-batch')
  getActiveBatchReport(@CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.getActiveBatchReport(user.id);
  }

  @Get('batches/:batchId')
  getBatchReport(
    @CurrentUser() user: AuthenticatedUser,
    @Param('batchId') batchId: string,
  ) {
    return this.reportsService.getBatchReport(user.id, batchId);
  }

  @Get('debts/outstanding')
  getOutstandingDebtsReport(@CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.getOutstandingDebtsReport(user.id);
  }
}
