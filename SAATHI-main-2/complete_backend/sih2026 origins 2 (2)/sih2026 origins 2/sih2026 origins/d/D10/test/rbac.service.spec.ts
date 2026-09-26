import { Test } from '@nestjs/testing';
import { RbacService } from '../src/modules/rbac/rbac.service';
import { UsersService } from '../src/modules/users/users.service';
import { Role } from '../src/common/enums/role.enum';

describe('RbacService', () => {
  it('delegates role assignment to UsersService', async () => {
    const setRole = jest.fn().mockResolvedValue({ id: 'u1', role: Role.INDUSTRY });
    const moduleRef = await Test.createTestingModule({
      providers: [RbacService, { provide: UsersService, useValue: { setRole } }],
    }).compile();

    const service = moduleRef.get(RbacService);
    const result = await service.assignRole('u1', Role.INDUSTRY);

    expect(setRole).toHaveBeenCalledWith('u1', Role.INDUSTRY);
    expect(result).toEqual({ id: 'u1', role: Role.INDUSTRY });
  });
});
