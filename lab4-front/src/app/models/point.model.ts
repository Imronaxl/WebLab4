export interface PointRequest {
  x: number;
  y: number;
  r: number;
}

export interface PointResult {
  id: number;
  x: number;
  y: number;
  r: number;
  hit: boolean;
  checkDate: string;
}
