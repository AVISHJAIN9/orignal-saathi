import { Module } from '@nestjs/common';
import { Tier2Controller } from './tier2_controllers';

@Module({
  controllers: [Tier2Controller],
  exports: []
})
export class Tier2Module {}
