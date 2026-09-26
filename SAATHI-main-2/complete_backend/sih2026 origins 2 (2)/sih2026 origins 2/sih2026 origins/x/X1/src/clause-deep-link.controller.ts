import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ClauseDeepLinkService } from './clause-deep-link.service';
import { DeepLinkParams } from './deep-link.builder';

@Controller('standards/citations')
export class ClauseDeepLinkController {
  constructor(private readonly deepLinkService: ClauseDeepLinkService) {}

  @Post('parse')
  public parseCitation(@Body('citation') citation: string) {
    return this.deepLinkService.parseReference(citation);
  }

  @Post('extract-all')
  public extractAll(@Body('text') text: string) {
    return this.deepLinkService.extractCitationsFromText(text);
  }

  @Post('build-link')
  public buildLink(@Body() params: DeepLinkParams) {
    const url = this.deepLinkService.buildLink(params);
    return { url };
  }

  @Get('resolve-link')
  public resolveLink(@Query('url') url: string) {
    return this.deepLinkService.resolveUrl(url);
  }

  @Get('most-cited')
  public getMostCited(@Query('top') top?: string) {
    const limit = top ? parseInt(top, 10) : 10;
    return this.deepLinkService.getMostCitedClauses(limit);
  }
}
