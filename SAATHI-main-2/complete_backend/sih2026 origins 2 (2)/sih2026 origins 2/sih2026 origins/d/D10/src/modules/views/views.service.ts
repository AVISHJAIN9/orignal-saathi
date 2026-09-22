import { Injectable } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { ViewConfigResponseDto } from './dto/view-config.response.dto';

/**
 * Maps a role onto a nav-section lens. Deliberately separate from
 * featureAccessConfig: nav sections are a presentation grouping, while
 * feature IDs are the fine-grained access-control unit FeatureAccessGuard
 * checks. Keeping them distinct means a page can be added to a role's
 * nav without silently granting every feature under it, and vice versa.
 */
const NAV_SECTIONS: Record<Role, string[]> = {
  [Role.PUBLIC]: ['chat', 'browse-standards', 'about'],
  [Role.INDUSTRY]: ['chat', 'browse-standards', 'history', 'checklist', 'api-keys'],
  [Role.ADMIN]: ['chat', 'browse-standards', 'documents', 'analytics', 'ops', 'users'],
};

@Injectable()
export class ViewsService {
  buildConfig(role: Role, allowedFeatures: string[]): ViewConfigResponseDto {
    return {
      role,
      visibleFeatures: allowedFeatures,
      navSections: NAV_SECTIONS[role],
    };
  }
}
