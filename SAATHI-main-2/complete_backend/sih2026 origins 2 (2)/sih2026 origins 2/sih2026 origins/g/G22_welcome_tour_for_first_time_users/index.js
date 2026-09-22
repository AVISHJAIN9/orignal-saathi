/**
 * G22_welcome_tour_for_first_time_users (MERN Stack)
 */
class WelcomeTourService {
  static getTourSteps(payload = {}) {
    return Object.assign({ status: "ok", timestamp: new Date().toISOString() }, {"steps":[{"target":"#qco-search","content":"Check if your product is under mandatory QCO"}]}, payload);
  }
}

const getTourSteps = (p) => WelcomeTourService.getTourSteps(p);

module.exports = { WelcomeTourService, getTourSteps };
