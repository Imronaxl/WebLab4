import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PointRequest, PointResult } from '../models/point.model';

@Injectable({
  providedIn: 'root'
})
export class PointService {
  private readonly API_URL = '/api/points';
  
  constructor(private http: HttpClient) {}
  
  getPoints(): Observable<PointResult[]> {
    return this.http.get<PointResult[]>(this.API_URL);
  }
  
  addPoint(request: PointRequest): Observable<PointResult> {
    return this.http.post<PointResult>(this.API_URL, request);
  }
  
  clearPoints(): Observable<any> {
    return this.http.delete(this.API_URL);
  }
}
