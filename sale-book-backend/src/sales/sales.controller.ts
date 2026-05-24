import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SalesService } from './sales.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/types/authenticated-user.type';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createSaleDto: CreateSaleDto,
  ) {
    return this.salesService.create(user.id, createSaleDto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.salesService.findAll(user.id);
  }

  @Get('today')
  findToday(@CurrentUser() user: AuthenticatedUser) {
    return this.salesService.findToday(user.id);
  }

  @Get('batch/:batchId')
  findByBatch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('batchId') batchId: string,
  ) {
    return this.salesService.findByBatch(user.id, batchId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.salesService.findOne(user.id, id);
  }
}
