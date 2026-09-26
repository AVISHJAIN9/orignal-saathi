import {
  IsString
} from 'class-validator';

// Query parameters for GET /conversations/:id/resume
export class ResumeQueryDto {

  @IsString(
  )
  userId!: string;

}
