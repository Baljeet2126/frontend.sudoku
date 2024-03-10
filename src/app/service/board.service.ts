import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board, BoardResponse, Difficulty, SudokuRequest, SudokuResponse } from '../model/board';


const baseUrl = 'https://sugoku.onrender.com';
const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) { }

  getBoard(gameLevel:Difficulty): Observable<BoardResponse> {
    return this.http.get<BoardResponse>(`${baseUrl}/board?difficulty=${gameLevel}`);
  }

  validateBoard(board : any): Observable<any> {
    return this.http.post(`${baseUrl}/validate`,board,{headers})
  }

  solveBoard(board : SudokuRequest): Observable<any> {
    return this.http.post(`${baseUrl}/solve`, board,{headers});
  }

  


}