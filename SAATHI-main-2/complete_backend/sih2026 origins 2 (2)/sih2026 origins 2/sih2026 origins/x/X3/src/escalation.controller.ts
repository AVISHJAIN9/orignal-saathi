import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EscalationService } from './escalation.service';
import { CreateTicketDto, ResolveTicketDto, TicketStatus, UserRole } from './escalation.types';

@Controller('escalations')
export class EscalationController {
  constructor(private readonly escalationService: EscalationService) {}

  @Post('create')
  public async createTicket(@Body() dto: CreateTicketDto) {
    return this.escalationService.createTicket(dto);
  }

  @Get(':id')
  public getTicket(@Param('id') id: string) {
    return this.escalationService.getTicketById(id);
  }

  @Patch(':id/status')
  public updateStatus(
    @Param('id') id: string,
    @Body('status') status: TicketStatus,
    @Body('actor') actor?: string,
    @Body('callerRole') callerRole?: UserRole
  ) {
    return this.escalationService.updateStatus(id, status, actor, callerRole);
  }

  @Post('resolve')
  public resolveTicket(@Body() dto: ResolveTicketDto) {
    return this.escalationService.resolveTicket(dto);
  }

  @Get('sla/scan-breaches')
  public async scanBreaches() {
    return this.escalationService.scanAndAlertSlaBreaches();
  }

  @Get()
  public listTickets(
    @Query('status') status?: TicketStatus,
    @Query('category') category?: string,
    @Query('conversationId') conversationId?: string
  ) {
    return this.escalationService.listTickets({ status, category, conversationId });
  }
}
