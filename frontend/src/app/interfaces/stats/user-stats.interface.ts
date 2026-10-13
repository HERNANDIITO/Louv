export interface UserStatsResponse {
  result: string;
  data: {
    totalRegistrados: number;
    provincias: { _id: string; total: number }[];
    sexo: { etiqueta: string; total: number }[];
    evolucionMensual: {
      year: number;
      month: number;
      total: number;
    }[];
  };
}