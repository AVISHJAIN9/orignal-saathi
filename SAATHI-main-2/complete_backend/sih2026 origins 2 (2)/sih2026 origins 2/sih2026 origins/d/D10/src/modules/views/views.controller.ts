import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ViewsService } from './views.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DemoJwtAuthGuard } from '../../common/guards/demo-jwt-auth.guard';
import { DEFAULT_ROLE } from '../../common/constants';
import type {
  AuthenticatedRequest,
  RequestUser,
} from '../../common/interfaces/authenticated-request.interface';

@ApiTags('views')
@ApiBearerAuth()
@Controller('views')
@UseGuards(DemoJwtAuthGuard)
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Get('config')
  getConfig(
    @CurrentUser() user: RequestUser | undefined,
    @Req() req: AuthenticatedRequest,
  ) {
    const role = user?.role ?? DEFAULT_ROLE;
    return this.viewsService.buildConfig(role, req.allowedFeatures ?? []);
  }
}
