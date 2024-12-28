import axios, { AxiosInstance } from 'axios';

class CoinService {

  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string = 'https://api.coingecko.com/api/v3';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-type': 'application/json'
      }
    });
  }


  // load a list of coins
  load(): Promise<any> {
    return this.axiosInstance.get(`${this.baseUrl}/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
  }

  // load all favourite coins
  loadFavouriteCoins(id: string): Promise<any> {
    return this.axiosInstance.get(`${this.baseUrl}/coins/markets?vs_currency=eur&ids=${id}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
  }

  // load a single coin
  loadOne(id: string): Promise<any> {
    return this.axiosInstance.get(`${this.baseUrl}/coins/markets?vs_currency=eur&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false`);
  }

  // get chart of selected coin
  getChart(id: string): Promise<any> {
    return this.axiosInstance.get(`${this.baseUrl}/coins/${id}/market_chart?vs_currency=eur&days=30&interval=daily`);
  }

}

export default new CoinService();