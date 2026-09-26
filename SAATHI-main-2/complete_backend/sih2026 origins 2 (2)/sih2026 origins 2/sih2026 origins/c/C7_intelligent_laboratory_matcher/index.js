/**
 * C7 — Intelligent Laboratory Matcher
 * Tables: labs, lab_test_scopes, lab_locations
 * Logic: Search & ranking engine matching specific test requirements
 * to recognized BIS/NABL laboratories by capability, test scope, and geographical location.
 */

const { db } = require('../database');

class IntelligentLaboratoryMatcher {
  async matchLabs(standardArg, locationArg) {
    let standardNumber = 'IS 269:2015';
    let location = 'Delhi';

    if (typeof standardArg === 'object' && standardArg !== null) {
      standardNumber = standardArg.standardNumber || standardArg.standard || standardNumber;
      location = standardArg.location || standardArg.city || standardArg.state || location;
    } else {
      standardNumber = standardArg || standardNumber;
      location = locationArg || location;
    }

    const cleanStd = standardNumber.replace(/:.*/, '').trim().toUpperCase();
    const locTerm = (location || '').toLowerCase().trim();

    // Query tables
    const allLabs = await db.getTable('labs');
    const allScopes = await db.getTable('lab_test_scopes');
    const allLocations = await db.getTable('lab_locations');

    // Find scopes matching standard
    const matchingScopes = allScopes.filter(s => s.standard_number.toUpperCase().includes(cleanStd));

    const matchedLabIds = matchingScopes.map(s => s.lab_id);

    // Join with labs and locations
    const candidateLabs = allLabs.filter(l => matchedLabIds.includes(l.id));

    // Rank candidates by location matching and turnaround
    const rankedResults = candidateLabs.map(lab => {
      const scope = matchingScopes.find(s => s.lab_id === lab.id);
      const loc = allLocations.find(locItem => locItem.lab_id === lab.id);

      let locationScore = 0;
      if (locTerm) {
        if (lab.city.toLowerCase().includes(locTerm) || lab.state.toLowerCase().includes(locTerm)) {
          locationScore = 50;
        } else if (loc && loc.region.toLowerCase().includes(locTerm)) {
          locationScore = 30;
        }
      }

      const turnaroundScore = scope ? Math.max(0, 30 - scope.turnaround_days) : 10;
      const bisScore = lab.bis_recognition_number ? 20 : 0;
      const totalRankScore = locationScore + turnaroundScore + bisScore;

      return {
        lab_id: lab.id,
        lab_name: lab.lab_name,
        bis_recognition: lab.bis_recognition_number,
        nabl_accreditation: lab.nabl_accreditation_number,
        address: lab.address,
        city: lab.city,
        state: lab.state,
        contact_email: lab.contact_email,
        phone: lab.phone,
        status: lab.status,
        test_method: scope ? scope.test_method : 'Standard Mechanical and Chemical Testing',
        turnaround_days: scope ? scope.turnaround_days : 21,
        sample_required: scope ? scope.sample_size_required : 'Standard sample packet',
        match_score: totalRankScore,
        location_proximity: locationScore >= 50 ? 'LOCAL_CITY' : (locationScore >= 30 ? 'REGIONAL' : 'NATIONAL')
      };
    }).sort((a, b) => b.match_score - a.match_score);

    return {
      standard_number: standardNumber,
      requested_location: location,
      total_accredited_labs_found: rankedResults.length,
      matched_laboratories: rankedResults,
      recommendation: rankedResults.length > 0
        ? `Matched ${rankedResults.length} BIS-recognized laboratory(ies) accredited for ${standardNumber}. Top recommendation: ${rankedResults[0].lab_name} (${rankedResults[0].city}).`
        : `No recognized labs currently indexed within immediate proximity for ${standardNumber}. Contact Central BIS Laboratory Sahibabad.`,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { IntelligentLaboratoryMatcher };