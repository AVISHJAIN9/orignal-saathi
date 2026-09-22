import {
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import {
  InjectRepository
} from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  Repository
} from 'typeorm';
import to from 'await-to-js';
import {
  Testimonial
} from './testimonial.entity';
import {
  CreateTestimonialDto
} from './dto/create-testimonial.dto';
import {
  UpdateTestimonialDto
} from './dto/update-testimonial.dto';
import {
  ListTestimonialsDto
} from './dto/list-testimonials.dto';

@Injectable(
)
export class TestimonialsService {

  private readonly logger = new Logger(
    TestimonialsService.name
  );

  constructor(
    @InjectRepository(
      Testimonial
    )
    private readonly testimonialRepository: Repository<
      Testimonial
    >
  ) {

  }

  async create(
    createDto: CreateTestimonialDto
  ): Promise<
    Testimonial
  > {

    let resolvedOrganization: string | null = null;
    if (
      createDto.organization
    ) {
      resolvedOrganization = createDto.organization;
    } else {
      resolvedOrganization = null;
    }

    let isApprovedFlag = false;
    if (
      createDto.approved !== undefined && createDto.approved !== null
    ) {
      isApprovedFlag = createDto.approved;
    } else {
      isApprovedFlag = false;
    }

    const testimonialEntity = this.testimonialRepository.create(
      {
        name: createDto.name,
        organization: resolvedOrganization,
        quote: createDto.quote,
        approved: isApprovedFlag
      }
    );

    const [
      saveError,
      savedTestimonialRecord
    ] = await to(
      this.testimonialRepository.save(
        testimonialEntity
      )
    );

    if (
      saveError || !savedTestimonialRecord
    ) {
      this.logger.error(
        `Failed saving testimonial from ${createDto.name}`
      );
      throw saveError;
    }

    return savedTestimonialRecord;

  }

  // Lists testimonials according to approval status and pagination parameters
  async list(
    queryDto: ListTestimonialsDto
  ): Promise<
    {
      items: Testimonial[];
      total: number;
    }
  > {

    const whereConditions: FindOptionsWhere<
      Testimonial
    > = {
    };

    if (
      queryDto.status === 'approved'
    ) {
      whereConditions.approved = true;
    }

    if (
      queryDto.status === 'pending'
    ) {
      whereConditions.approved = false;
    }

    const [
      queryError,
      queryResultTuple
    ] = await to(
      this.testimonialRepository.findAndCount(
        {
          where: whereConditions,
          order: {
            createdAt: 'DESC'
          },
          take: queryDto.limit,
          skip: queryDto.offset
        }
      )
    );

    if (
      queryError || !queryResultTuple
    ) {
      this.logger.error(
        'Failed querying testimonials list'
      );
      throw queryError;
    }

    const [
      testimonialItemsList,
      totalCountNumber
    ] = queryResultTuple;

    return {
      items: testimonialItemsList,
      total: totalCountNumber
    };

  }

  async findOne(
    testimonialId: string
  ): Promise<
    Testimonial
  > {

    const [
      lookupError,
      foundTestimonialRecord
    ] = await to(
      this.testimonialRepository.findOne(
        {
          where: {
            id: testimonialId
          }
        }
      )
    );

    if (
      lookupError
    ) {
      throw lookupError;
    }

    if (
      !foundTestimonialRecord
    ) {
      throw new NotFoundException(
        'Testimonial not found'
      );
    }

    return foundTestimonialRecord;

  }

  async update(
    testimonialId: string,
    updateDto: UpdateTestimonialDto
  ): Promise<
    Testimonial
  > {

    const targetTestimonialRecord = await this.findOne(
      testimonialId
    );

    Object.assign(
      targetTestimonialRecord,
      updateDto
    );

    const [
      saveError,
      savedUpdatedTestimonial
    ] = await to(
      this.testimonialRepository.save(
        targetTestimonialRecord
      )
    );

    if (
      saveError || !savedUpdatedTestimonial
    ) {
      this.logger.error(
        `Failed updating testimonial ${testimonialId}`
      );
      throw saveError;
    }

    return savedUpdatedTestimonial;

  }

  async remove(
    testimonialId: string
  ): Promise<
    void
  > {

    const [
      deleteError,
      deleteResultRecord
    ] = await to(
      this.testimonialRepository.delete(
        testimonialId
      )
    );

    if (
      deleteError
    ) {
      throw deleteError;
    }

    if (
      deleteResultRecord?.affected === 0
    ) {
      throw new NotFoundException(
        'Testimonial not found'
      );
    }

  }

}
