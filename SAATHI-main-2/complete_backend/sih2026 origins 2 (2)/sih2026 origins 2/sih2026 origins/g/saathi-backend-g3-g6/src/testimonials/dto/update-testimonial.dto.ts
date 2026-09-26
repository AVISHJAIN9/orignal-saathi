import {
  PartialType
} from '@nestjs/mapped-types';
import {
  CreateTestimonialDto
} from './create-testimonial.dto';

// Covers both content updates and approval toggles
export class UpdateTestimonialDto extends PartialType(
  CreateTestimonialDto
) {

}
