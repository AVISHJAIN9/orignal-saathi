import { AmbientBackground } from "@/components/ambient-background";
import { PersonalizedDashboard } from "@/components/dashboard/personalized-dashboard";

export function DashboardPage() {
  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
        <PersonalizedDashboard />
      </div>
    </div>
  );
}
