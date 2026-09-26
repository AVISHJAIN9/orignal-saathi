/**
 * S30: Application Progress Bar Calculator Service
 * MERN Stack Service - Multi-stage progression percentage engine.
 */

class ProgressBarCalculatorService {
  calculateProgress(currentStep = 3) {
    const step = Number(currentStep) || 1;
    const totalSteps = 6;
    const progressPct = Math.round((step / totalSteps) * 100);

    return {
      current_step: step,
      total_steps: totalSteps,
      progress_percentage: progressPct,
      next_milestone: "Lab Sample Allotment",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  ProgressBarCalculatorService
};
