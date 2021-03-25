import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  
  private _apikey     : string = 'DSZwtqhyHFXi8F8csBsDXZkCMVOXFi48';
  private _ServicioUrl: string = 'http://api.giphy.com/v1/gifs';
  private _historial  : string[] = [];

  public resultados: Gif[] = [];

  get historial() {    
    return [...this._historial];
  }

  constructor( private http: HttpClient ) {
    
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

    /*if (localStorage.getItem('historial')) {
      this._historial = JSON.parse( localStorage.getItem('historial')! );
    }*/

  }

  buscarGifs( query: string ) {    

    query = query.trim().toLowerCase();

    if (!this._historial.includes( query ) ) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      localStorage.setItem( 'historial', JSON.stringify( this._historial ) );
      
    }        

    const params = new HttpParams()
      .set('api_key', this._apikey)
      .set('q', query)
      .set('limit', '10');

    this.http.get<SearchGifsResponse>(`${this._ServicioUrl}/search`, { params } )
      .subscribe( ( res ) => {
        //console.log( res.data )
        this.resultados = res.data;        
        localStorage.setItem( 'resultados', JSON.stringify( this.resultados ) );
      })

  }

}
