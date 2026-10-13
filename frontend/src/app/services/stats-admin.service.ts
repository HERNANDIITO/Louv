import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpContext } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { BudgetDistributionResponse } from "../interfaces/stats/budget-distribution.interface";
import { MaterialUsageResponse } from "../interfaces/stats/material-usage.interface";
import { GemCutUsageResponse } from "../interfaces/stats/gem-cut-usage.interface";
import { SettingUsageResponse } from "../interfaces/stats/setting-usage.interface";
import { MetalGemCombinationsResponse } from "../interfaces/stats/metal-gem-combination.interface";
import { UserStatsResponse } from "../interfaces/stats/user-stats.interface";
import { USE_AUTH } from "../context/auth.context";
import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StatsAdminService {
  http = inject(HttpClient);

  constructor() {}

  // -------------------------------------------------------------------
  // -   METALES Y GEMAS -----------------------------------------------
  // -------------------------------------------------------------------

  // DISTRIBUCIÓN PRESUPUESTO
  getBudgetDistribution(year?: number) {
    const params = year ? `?year=${year}` : "";

    return this.http.get<any>(
      `${environment.apiUrl}/stats/budget-distribution${params}`,
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true),
      },
    );
  }

  getMaterialUsage(year?: number) {
    const params = year ? `?year=${year}` : "";

    return this.http.get<any>(
      `${environment.apiUrl}/stats/material-usage${params}`,
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true),
      },
    );
  }

  // USO GEMAS Y CORTES
  getGemCutUsage(year?: number) {
    const params = year ? `?year=${year}` : "";

    return this.http.get<any>(
      `${environment.apiUrl}/stats/gem-cut-usage${params}`,
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true),
      },
    );
  }

  // COMBINACIÓN METAL GEMA
  getMetalGemCombinations(year?: number) {
    const params = year ? `?year=${year}` : "";

    return this.http.get<any>(
      `${environment.apiUrl}/stats/metal-gem-combinations${params}`,
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true),
      },
    );
  }

  // -------------------------------------------------------------------
  // -   BASES Y ENGASATES  --------------------------------------------
  // -------------------------------------------------------------------

  // USO ENGASTES
  getSettingUsage(year?: number) {
    const params = year ? `?year=${year}` : "";

    return this.http.get<any>(
      `${environment.apiUrl}/stats/setting-usage${params}`,
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true),
      },
    );
  }

  // USO TALLAS
  getSizeUsage(year?: number) {
    const params = year ? `?year=${year}` : "";

    return this.http.get<any>(
      `${environment.apiUrl}/stats/size-usage${params}`,
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true),
      },
    );
  }

  // COMBINACIONES BASES Y ENGASTES
  getBaseSettingCombinations(year?: number) {
    const params = year ? `?year=${year}` : "";

    return this.http.get<any>(
      `${environment.apiUrl}/stats/base-setting-combinations${params}`,
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true),
      },
    );
  }

  // USO BASES
  getBaseUsage(year?: number) {
    const params = year ? `?year=${year}` : "";

    return this.http.get<any>(
      `${environment.apiUrl}/stats/base-usage${params}`,
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true),
      },
    );
  }

  // -------------------------------------------------------------------
  // -   FACTURACIÓN  --------------------------------------------------
  // -------------------------------------------------------------------

  getYearlyStats(year: number) {
    return this.http.get<any>(`${environment.apiUrl}/stats/year?year=${year}`, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true),
    });
  }

  getYearlyDesignStats(year: number) {
    return this.http.get<{
      result: string;
      year: number;
      data: number[];
    }>(`${environment.apiUrl}/stats/yearly?year=${year}`, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true),
    });
  }

  // -------------------------------------------------------------------
  // -   USUARIOS  -----------------------------------------------------
  // -------------------------------------------------------------------

  getUserStats() {
    return this.http.get<UserStatsResponse>(
      `${environment.apiUrl}/stats/users-report`,
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true),
      },
    );
  }

  getUserFullStats(year: number) {
    return this.http.get<{
      result: string;
      year: number;
      data: any[];
    }>(`${environment.apiUrl}/stats/users-full?year=${year}`, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true),
    });
  }

  getFullReportData(year: number) {
    return forkJoin({
      facturacion: this.getYearlyStats(year),
      disenos: this.getYearlyDesignStats(year),
      usuariosTotales: this.getUserStats(),
      usuariosMensual: this.getUserFullStats(year),
      materiales: this.getMaterialUsage(year),
      gemas: this.getGemCutUsage(year),
      bases: this.getBaseUsage(year),
      engastes: this.getSettingUsage(year),
      tallas: this.getSizeUsage(year),
    });
  }

  getReportZipped() {
    return this.http.get(`${environment.apiUrl}/stats/zip`, {
      responseType: "blob",
    });
  }
}
