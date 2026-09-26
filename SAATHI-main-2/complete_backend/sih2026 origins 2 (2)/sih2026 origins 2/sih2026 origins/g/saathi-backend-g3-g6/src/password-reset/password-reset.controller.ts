import {
  Body,
  Controller,
  Post
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import {
  PasswordResetService
} from './password-reset.service';
import {
  RequestPasswordResetDto
} from './dto/request-password-reset.dto';
import {
  ConfirmPasswordResetDto
} from './dto/confirm-password-reset.dto';

@ApiTags(
  'password-reset'
)
@Controller(
  'auth/password-reset'
)
export class PasswordResetController {

  constructor(
    private readonly passwordResetService: PasswordResetService
  ) {

  }

  @Post(
    'request'
  )
  @ApiOperation(
    {
      summary: 'Request a password reset link via email'
    }
  )
  async request(
    @Body(
    )
    requestDto: RequestPasswordResetDto
  ): Promise<
    {
      message: string;
    }
  > {

    return this.passwordResetService.requestReset(
      requestDto.email
    );

  }

  @Post(
    'confirm'
  )
  @ApiOperation(
    {
      summary: 'Confirm password reset using token and update credentials'
    }
  )
  async confirm(
    @Body(
    )
    confirmDto: ConfirmPasswordResetDto
  ): Promise<
    {
      message: string;
    }
  > {

    return this.passwordResetService.confirmReset(
      confirmDto.token,
      confirmDto.newPassword
    );

  }

}
