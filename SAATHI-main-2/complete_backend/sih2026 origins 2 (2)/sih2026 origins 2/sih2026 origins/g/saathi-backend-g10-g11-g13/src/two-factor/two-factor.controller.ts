import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { EnableTwoFactorDto } from './dto/enable-two-factor.dto';
import { DisableTwoFactorDto } from './dto/disable-two-factor.dto';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { RolesGuard } from '../common/auth/roles.guard';
import { Roles } from '../common/auth/roles.decorator';
import { Role } from '../common/auth/role.enum';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../common/auth/current-user.interface';

// Self-service only — an admin manages their own 2FA. The login-time
// verification step is NOT here; see TwoFactorService.verifyLoginCode(),
// called directly by P1's login controller.
@Controller('auth/2fa')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class TwoFactorController {
  constructor(private readonly service: TwoFactorService) {}

  @Get('status')
  async status(@CurrentUser() user: CurrentUserType) {
    return this.service.status(user.id);
  }

  @Post('setup')
  async setup(@CurrentUser() user: CurrentUserType) {
    return this.service.setup(user.id, user.email);
  }

  @Post('enable')
  async enable(@CurrentUser() user: CurrentUserType, @Body() dto: EnableTwoFactorDto) {
    return this.service.enable(user.id, dto.code);
  }

  @Post('disable')
  async disable(@CurrentUser() user: CurrentUserType, @Body() dto: DisableTwoFactorDto) {
    return this.service.disable(user.id, dto.code);
  }
}
