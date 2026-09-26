/**
 * G21_onboarding_video_walkthrough (MERN Stack)
 */
class OnboardingVideoService {
  static getVideoList(payload = {}) {
    return Object.assign({ status: "ok", timestamp: new Date().toISOString() }, {"videos":[{"id":"vid_1","title":"How to apply for ISI Mark","duration":"4:20"}]}, payload);
  }
}

const getVideoList = (p) => OnboardingVideoService.getVideoList(p);

module.exports = { OnboardingVideoService, getVideoList };
