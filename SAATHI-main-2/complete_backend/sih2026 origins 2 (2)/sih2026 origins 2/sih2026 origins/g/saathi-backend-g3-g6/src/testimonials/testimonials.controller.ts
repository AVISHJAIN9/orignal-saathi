import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import {
  TestimonialsService
} from './testimonials.service';
import {
  CreateTestimonialDto
} from './dto/create-testimonial.dto';
import {
  UpdateTestimonialDto
} from './dto/update-testimonial.dto';
import {
  ListTestimonialsDto
} from './dto/list-testimonials.dto';
import {
  JwtAuthGuard
} from '../common/auth/jwt-auth.guard';
import {
  RolesGuard
} from '../common/auth/roles.guard';
import {
  Roles
} from '../common/auth/roles.decorator';
import {
  Role
} from '../common/auth/role.enum';
import {
  Testimonial
} from './testimonial.entity';

@ApiTags(
  'testimonials'
)
@Controller(
  'testimonials'
)
export class TestimonialsController {

  constructor(
    private readonly testimonialsService: TestimonialsService
  ) {

  }

  // Public listing returning approved testimonials
  @Get(
  )
  @ApiOperation(
    {
      summary: 'Public listing of approved testimonials'
    }
  )
  async listPublic(
    @Query(
    )
    queryDto: ListTestimonialsDto
  ): Promise<
    {
      items: Testimonial[];
      total: number;
    }
  > {

    return this.testimonialsService.list(
      {
        ...queryDto,
        status: 'approved'
      }
    );

  }

  // Admin listing supporting status filter
  @Get(
    'admin'
  )
  @ApiBearerAuth(
  )
  @UseGuards(
    JwtAuthGuard,
    RolesGuard
  )
  @Roles(
    Role.ADMIN
  )
  @ApiOperation(
    {
      summary: 'Admin listing of testimonials with status filtering'
    }
  )
  async listAdmin(
    @Query(
    )
    queryDto: ListTestimonialsDto
  ): Promise<
    {
      items: Testimonial[];
      total: number;
    }
  > {

    return this.testimonialsService.list(
      queryDto
    );

  }

  @Post(
  )
  @ApiBearerAuth(
  )
  @UseGuards(
    JwtAuthGuard,
    RolesGuard
  )
  @Roles(
    Role.ADMIN
  )
  @ApiOperation(
    {
      summary: 'Admin creates a new curated testimonial'
    }
  )
  async create(
    @Body(
    )
    createDto: CreateTestimonialDto
  ): Promise<
    Testimonial
  > {

    return this.testimonialsService.create(
      createDto
    );

  }

  @Patch(
    ':id'
  )
  @ApiBearerAuth(
  )
  @UseGuards(
    JwtAuthGuard,
    RolesGuard
  )
  @Roles(
    Role.ADMIN
  )
  @ApiOperation(
    {
      summary: 'Admin updates or toggles approval status of a testimonial'
    }
  )
  async update(
    @Param(
      'id',
      ParseUUIDPipe
    )
    testimonialId: string,
    @Body(
    )
    updateDto: UpdateTestimonialDto
  ): Promise<
    Testimonial
  > {

    return this.testimonialsService.update(
      testimonialId,
      updateDto
    );

  }

  @Delete(
    ':id'
  )
  @ApiBearerAuth(
  )
  @UseGuards(
    JwtAuthGuard,
    RolesGuard
  )
  @Roles(
    Role.ADMIN
  )
  @ApiOperation(
    {
      summary: 'Admin deletes a testimonial'
    }
  )
  async remove(
    @Param(
      'id',
      ParseUUIDPipe
    )
    testimonialId: string
  ): Promise<
    {
      success: boolean;
    }
  > {

    await this.testimonialsService.remove(
      testimonialId
    );

    return {
      success: true
    };

  }

}
