import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

/**
 * The payload D1's frontend shell reads to decide which nav sections
 * and feature entry points to render for the current identity -
 * "same data, different lens" per the Feature Matrix's description of
 * D10's frontend half. This DTO is the contract between that frontend
 * switch and this backend module.
 */
export class ViewConfigResponseDto {
  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ type: [String], description: 'Feature IDs visible to this role.' })
  visibleFeatures: string[];

  @ApiProperty({
    type: [String],
    description: 'Top-level nav sections this role sees (Public/Industry/Admin lens).',
  })
  navSections: string[];
}
