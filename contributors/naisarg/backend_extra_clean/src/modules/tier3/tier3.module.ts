import { Module } from '@nestjs/common';
import { Tier3Controller } from './tier3_controllers';

@Module({
  controllers: [Tier3Controller],
  exports: []
})
export class Tier3Module {}
