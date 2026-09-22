import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DemoJwtAuthGuard } from '../../common/guards/demo-jwt-auth.guard';

/**
 * Admin-only role management - the one write path D10 owns. Everything
 * else in this module is read-side (view/feature scoping). Shows the
 * intended guard composition order: auth first, then role check.
 * Swap DemoJwtAuthGuard for P1's real guard when linking in.
 */
@ApiTags('rbac')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(DemoJwtAuthGuard, RolesGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.rbacService.assignRole(id, dto.role);
  }
}
