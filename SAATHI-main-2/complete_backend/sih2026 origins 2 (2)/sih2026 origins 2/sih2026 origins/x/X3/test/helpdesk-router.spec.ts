import { HelpdeskRouter } from '../src/helpdesk-router';

describe('X3: Helpdesk Router (All 36 States & UTs)', () => {
  let router: HelpdeskRouter;

  beforeEach(() => {
    router = new HelpdeskRouter();
  });

  it('should route all Indian regions correctly', () => {
    // North & Hill states
    expect(router.resolveRegion('Jammu and Kashmir')).toBe('NORTH_REGIONAL_OFFICE_DELHI');
    expect(router.resolveRegion('Ladakh')).toBe('NORTH_REGIONAL_OFFICE_DELHI');
    expect(router.resolveRegion('Uttarakhand')).toBe('NORTH_REGIONAL_OFFICE_DELHI');

    // Central
    expect(router.resolveRegion('Punjab')).toBe('CENTRAL_REGIONAL_OFFICE_CHANDIGARH');
    expect(router.resolveRegion('Himachal Pradesh')).toBe('CENTRAL_REGIONAL_OFFICE_CHANDIGARH');

    // West
    expect(router.resolveRegion('Maharashtra')).toBe('WEST_REGIONAL_OFFICE_MUMBAI');
    expect(router.resolveRegion('Chhattisgarh')).toBe('WEST_REGIONAL_OFFICE_MUMBAI');
    expect(router.resolveRegion('Goa')).toBe('WEST_REGIONAL_OFFICE_MUMBAI');

    // East & North-East
    expect(router.resolveRegion('Assam')).toBe('EAST_REGIONAL_OFFICE_KOLKATA');
    expect(router.resolveRegion('Sikkim')).toBe('EAST_REGIONAL_OFFICE_KOLKATA');
    expect(router.resolveRegion('Jharkhand')).toBe('EAST_REGIONAL_OFFICE_KOLKATA');

    // South
    expect(router.resolveRegion('Kerala')).toBe('SOUTH_REGIONAL_OFFICE_CHENNAI');
    expect(router.resolveRegion('Telangana')).toBe('SOUTH_REGIONAL_OFFICE_CHENNAI');
    expect(router.resolveRegion('Puducherry')).toBe('SOUTH_REGIONAL_OFFICE_CHENNAI');
  });

  it('should classify queries into appropriate technical departments', () => {
    expect(router.classifyCategory('water sample testing at laboratory')).toBe('LABORATORY_TESTING');
    expect(router.classifyCategory('QCO mandatory certification compliance')).toBe('QUALITY_CONTROL_ORDER_COMPLIANCE');
    expect(router.classifyCategory('fee concession micro enterprise')).toBe('FEE_AND_PAYMENT_DISPUTE');
  });
});
