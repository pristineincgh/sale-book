import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StockBatchesService } from './stock-batches.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CreateStockBatchDto } from './dto/create-stock-batch.dto';
import { UpdateStockBatchDto } from './dto/update-stock-batch.dto';

@Controller('stock-batches')
@UseGuards(JwtAuthGuard)
export class StockBatchesController {
  constructor(private readonly stockBatchesService: StockBatchesService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createStockBatchDto: CreateStockBatchDto,
  ) {
    return this.stockBatchesService.create(user.id, createStockBatchDto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.stockBatchesService.findAll(user.id);
  }

  @Get('active')
  findActive(@CurrentUser() user: AuthenticatedUser) {
    return this.stockBatchesService.findActive(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.stockBatchesService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateStockBatchDto: UpdateStockBatchDto,
  ) {
    return this.stockBatchesService.update(user.id, id, updateStockBatchDto);
  }

  @Patch(':id/complete')
  complete(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.stockBatchesService.complete(user.id, id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.stockBatchesService.remove(user.id, id);
  }
}
