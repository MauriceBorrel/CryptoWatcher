export interface CoinModel{
    id: string;
    name: string;
    symbol: string;
    image: string;
    ath: number;
    atl: number;
    ath_change_percentage: number;
    alt_change_percentage: number;
    ath_date: string;
    atl_date: string;
    circulating_supply: number;
    current_price: number;
    fully_diluted_valuation: number;
    high_24h: number;
    low_24h: number;
    last_updated: string;
    market_cap: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    market_cap_rank: number;
    max_supply: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    roi: string;
    total_supply: number;
    total_volume: number;
}