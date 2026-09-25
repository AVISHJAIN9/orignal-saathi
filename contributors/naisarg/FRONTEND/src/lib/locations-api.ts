import { API_BASE_URL } from "./developer-data";
import {
  S26_DEMO_PLANTS,
  type ManufacturingPlant,
} from "./demo/s26-demo-data";

export interface LocationsResult {
  plants: ManufacturingPlant[];
  activePlant: ManufacturingPlant;
  isDemoFallback: boolean;
  summary: {
    totalPlants: number;
    totalActiveLicenses: number;
    totalScheduledAudits: number;
    avgComplianceScore: number;
  };
}

const ACTIVE_PLANT_KEY = "saathi:active_plant_id";

class PlantEventEmitter {
  private listeners: ((plantId: string) => void)[] = [];

  subscribe(listener: (plantId: string) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(plantId: string) {
    this.listeners.forEach((l) => l(plantId));
  }
}

export const plantEvents = new PlantEventEmitter();

export const locationsApi = {
  /**
   * Retrieves active plant ID for location-scoped features.
   * Default is "plant-manesar-01".
   */
  getActivePlantId(): string {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(ACTIVE_PLANT_KEY);
      if (saved) return saved;
    }
    return "plant-manesar-01";
  },

  /**
   * Sets the active plant without corrupting global user/organization identity.
   */
  setActivePlantId(plantId: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(ACTIVE_PLANT_KEY, plantId);
    }
    plantEvents.emit(plantId);
  },

  /**
   * Fetches manufacturing locations and compliance status.
   */
  async getPlants(): Promise<LocationsResult> {
    const targetUrl = `${API_BASE_URL}/locations`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        const plants: ManufacturingPlant[] = Array.isArray(data) ? data : data.plants || [];
        const activeId = this.getActivePlantId();
        const activePlant = plants.find((p) => p.id === activeId) || plants[0] || S26_DEMO_PLANTS[0];
        return this.calculateSummary(plants, activePlant, false);
      }
    } catch {
      // Offline fallback to canonical demo plants
    }

    const plants = S26_DEMO_PLANTS;
    const activeId = this.getActivePlantId();
    const activePlant = plants.find((p) => p.id === activeId) || plants[0];
    return this.calculateSummary(plants, activePlant, true);
  },

  async getPlantById(id: string): Promise<ManufacturingPlant | null> {
    const res = await this.getPlants();
    return res.plants.find((p) => p.id === id) || null;
  },

  calculateSummary(
    plants: ManufacturingPlant[],
    activePlant: ManufacturingPlant,
    isDemo: boolean
  ): LocationsResult {
    const totalLicenses = plants.reduce((acc, p) => acc + p.licenses.length, 0);
    const totalAudits = plants.reduce(
      (acc, p) => acc + p.audits.filter((a) => a.status === "SCHEDULED").length,
      0
    );
    const avgScore = Math.round(
      plants.reduce((acc, p) => acc + p.complianceScore, 0) / (plants.length || 1)
    );

    return {
      plants,
      activePlant,
      isDemoFallback: isDemo,
      summary: {
        totalPlants: plants.length,
        totalActiveLicenses: totalLicenses,
        totalScheduledAudits: totalAudits,
        avgComplianceScore: avgScore,
      },
    };
  },
};
