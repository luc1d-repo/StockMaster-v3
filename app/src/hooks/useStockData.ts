import { useState, useEffect, useCallback } from 'react';
import type { StockData, HistoricalData, NewsItem, MarketReport, TechnicalIndicator, WatchlistItem, PatternSignal } from '@/types/stock';

// Top 100 US Stocks by Trading Volume (as of 2024)
const mockStocks: Record<string, StockData> = {
  // Mega Cap Tech
  'AAPL': { symbol: 'AAPL', name: 'Apple Inc.', price: 178.35, change: 2.45, changePercent: 1.39, volume: 52436700, marketCap: 2780000000000, peRatio: 28.5, high52Week: 199.62, low52Week: 164.08, avgVolume: 54600000, assetType: 'stock' },
  'MSFT': { symbol: 'MSFT', name: 'Microsoft Corporation', price: 421.65, change: -1.23, changePercent: -0.29, volume: 22145600, marketCap: 3120000000000, peRatio: 32.1, high52Week: 468.35, low52Week: 362.90, avgVolume: 24500000, assetType: 'stock' },
  'GOOGL': { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', price: 175.98, change: 3.12, changePercent: 1.81, volume: 28123400, marketCap: 2180000000000, peRatio: 24.8, high52Week: 191.75, low52Week: 129.40, avgVolume: 26500000, assetType: 'stock' },
  'GOOG': { symbol: 'GOOG', name: 'Alphabet Inc. Class C', price: 177.25, change: 3.45, changePercent: 1.98, volume: 25432100, marketCap: 2185000000000, peRatio: 25.0, high52Week: 193.00, low52Week: 130.50, avgVolume: 23800000, assetType: 'stock' },
  'AMZN': { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.45, change: 1.87, changePercent: 1.01, volume: 38952100, marketCap: 1940000000000, peRatio: 42.3, high52Week: 201.20, low52Week: 144.00, avgVolume: 41200000, assetType: 'stock' },
  'META': { symbol: 'META', name: 'Meta Platforms Inc.', price: 505.68, change: 8.92, changePercent: 1.79, volume: 18965400, marketCap: 1290000000000, peRatio: 26.4, high52Week: 531.49, low52Week: 279.40, avgVolume: 21000000, assetType: 'stock' },
  'NVDA': { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44, volume: 45632100, marketCap: 2150000000000, peRatio: 72.5, high52Week: 974.00, low52Week: 262.20, avgVolume: 48500000, assetType: 'stock' },
  'TSLA': { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.23, changePercent: -2.06, volume: 98234500, marketCap: 790000000000, peRatio: 68.2, high52Week: 299.29, low52Week: 152.37, avgVolume: 105000000, assetType: 'stock' },
  'AVGO': { symbol: 'AVGO', name: 'Broadcom Inc.', price: 1425.80, change: 18.50, changePercent: 1.31, volume: 3214500, marketCap: 665000000000, peRatio: 48.5, high52Week: 1550.00, low52Week: 850.00, avgVolume: 2850000, assetType: 'stock' },
  'AMD': { symbol: 'AMD', name: 'Advanced Micro Devices', price: 164.25, change: 3.85, changePercent: 2.40, volume: 52345600, marketCap: 265000000000, peRatio: 185.2, high52Week: 227.30, low52Week: 93.12, avgVolume: 48500000, assetType: 'stock' },
  'INTC': { symbol: 'INTC', name: 'Intel Corporation', price: 43.85, change: -0.45, changePercent: -1.02, volume: 45234500, marketCap: 188000000000, peRatio: 85.4, high52Week: 51.28, low52Week: 25.50, avgVolume: 42500000, assetType: 'stock' },
  'CRM': { symbol: 'CRM', name: 'Salesforce Inc.', price: 285.40, change: 4.20, changePercent: 1.49, volume: 8543200, marketCap: 275000000000, peRatio: 62.5, high52Week: 318.00, low52Week: 193.00, avgVolume: 7800000, assetType: 'stock' },
  'ADBE': { symbol: 'ADBE', name: 'Adobe Inc.', price: 525.60, change: 7.80, changePercent: 1.51, volume: 3245600, marketCap: 235000000000, peRatio: 32.8, high52Week: 638.25, low52Week: 433.00, avgVolume: 2950000, assetType: 'stock' },
  'ORCL': { symbol: 'ORCL', name: 'Oracle Corporation', price: 128.45, change: 1.25, changePercent: 0.98, volume: 12456800, marketCap: 355000000000, peRatio: 32.5, high52Week: 145.00, low52Week: 99.50, avgVolume: 11500000, assetType: 'stock' },
  'NFLX': { symbol: 'NFLX', name: 'Netflix Inc.', price: 685.20, change: 12.50, changePercent: 1.86, volume: 4567800, marketCap: 295000000000, peRatio: 42.5, high52Week: 725.00, low52Week: 400.00, avgVolume: 4200000, assetType: 'stock' },
  'UBER': { symbol: 'UBER', name: 'Uber Technologies', price: 78.50, change: 1.85, changePercent: 2.41, volume: 18564200, marketCap: 165000000000, peRatio: 85.2, high52Week: 87.00, low52Week: 40.00, avgVolume: 17200000, assetType: 'stock' },
  'PYPL': { symbol: 'PYPL', name: 'PayPal Holdings', price: 68.45, change: -1.20, changePercent: -1.72, volume: 15234500, marketCap: 72000000000, peRatio: 18.5, high52Week: 76.50, low52Week: 52.00, avgVolume: 14500000, assetType: 'stock' },
  'ABNB': { symbol: 'ABNB', name: 'Airbnb Inc.', price: 145.80, change: 2.45, changePercent: 1.71, volume: 6543200, marketCap: 92000000000, peRatio: 22.5, high52Week: 170.00, low52Week: 105.00, avgVolume: 6100000, assetType: 'stock' },
  'SNOW': { symbol: 'SNOW', name: 'Snowflake Inc.', price: 185.60, change: 4.80, changePercent: 2.66, volume: 5234500, marketCap: 61000000000, peRatio: -45.2, high52Week: 237.00, low52Week: 128.00, avgVolume: 4850000, assetType: 'stock' },
  'ZM': { symbol: 'ZM', name: 'Zoom Video Communications', price: 68.25, change: 1.45, changePercent: 2.17, volume: 4567800, marketCap: 20500000000, peRatio: 28.5, high52Week: 85.00, low52Week: 55.00, avgVolume: 4250000, assetType: 'stock' },

  // Financial Services
  'JPM': { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 198.50, change: 2.85, changePercent: 1.46, volume: 12456800, marketCap: 565000000000, peRatio: 12.5, high52Week: 205.00, low52Week: 145.00, avgVolume: 11500000, assetType: 'stock' },
  'BAC': { symbol: 'BAC', name: 'Bank of America', price: 37.85, change: 0.45, changePercent: 1.20, volume: 38564200, marketCap: 295000000000, peRatio: 13.2, high52Week: 40.50, low52Week: 28.00, avgVolume: 36500000, assetType: 'stock' },
  'WFC': { symbol: 'WFC', name: 'Wells Fargo & Co.', price: 52.40, change: 0.65, changePercent: 1.26, volume: 18564200, marketCap: 185000000000, peRatio: 12.8, high52Week: 56.00, low52Week: 38.00, avgVolume: 17200000, assetType: 'stock' },
  'GS': { symbol: 'GS', name: 'Goldman Sachs Group', price: 485.60, change: 6.80, changePercent: 1.42, volume: 2456800, marketCap: 155000000000, peRatio: 16.5, high52Week: 510.00, low52Week: 325.00, avgVolume: 2250000, assetType: 'stock' },
  'MS': { symbol: 'MS', name: 'Morgan Stanley', price: 98.50, change: 1.25, changePercent: 1.29, volume: 8564200, marketCap: 155000000000, peRatio: 15.8, high52Week: 105.00, low52Week: 72.00, avgVolume: 7950000, assetType: 'stock' },
  'C': { symbol: 'C', name: 'Citigroup Inc.', price: 62.85, change: 0.85, changePercent: 1.37, volume: 14568200, marketCap: 118000000000, peRatio: 9.5, high52Week: 68.00, low52Week: 42.00, avgVolume: 13500000, assetType: 'stock' },
  'BLK': { symbol: 'BLK', name: 'BlackRock Inc.', price: 825.40, change: 12.50, changePercent: 1.54, volume: 654320, marketCap: 122000000000, peRatio: 22.5, high52Week: 920.00, low52Week: 600.00, avgVolume: 585000, assetType: 'stock' },
  'AXP': { symbol: 'AXP', name: 'American Express', price: 225.60, change: 3.20, changePercent: 1.44, volume: 3245600, marketCap: 162000000000, peRatio: 18.5, high52Week: 245.00, low52Week: 152.00, avgVolume: 2950000, assetType: 'stock' },
  'V': { symbol: 'V', name: 'Visa Inc.', price: 285.40, change: 3.85, changePercent: 1.37, volume: 6543200, marketCap: 585000000000, peRatio: 32.5, high52Week: 310.00, low52Week: 235.00, avgVolume: 6100000, assetType: 'stock' },
  'MA': { symbol: 'MA', name: 'Mastercard Inc.', price: 485.80, change: 6.50, changePercent: 1.36, volume: 3245600, marketCap: 445000000000, peRatio: 35.2, high52Week: 530.00, low52Week: 385.00, avgVolume: 2950000, assetType: 'stock' },
  'SPGI': { symbol: 'SPGI', name: 'S&P Global Inc.', price: 425.60, change: 5.80, changePercent: 1.38, volume: 1456800, marketCap: 132000000000, peRatio: 28.5, high52Week: 465.00, low52Week: 340.00, avgVolume: 1320000, assetType: 'stock' },

  // Healthcare
  'JNJ': { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.40, change: 1.85, changePercent: 1.18, volume: 8564200, marketCap: 382000000000, peRatio: 15.2, high52Week: 175.00, low52Week: 145.00, avgVolume: 7950000, assetType: 'stock' },
  'UNH': { symbol: 'UNH', name: 'UnitedHealth Group', price: 525.80, change: 8.50, changePercent: 1.64, volume: 3245600, marketCap: 485000000000, peRatio: 22.5, high52Week: 595.00, low52Week: 435.00, avgVolume: 2950000, assetType: 'stock' },
  'LLY': { symbol: 'LLY', name: 'Eli Lilly & Co.', price: 725.40, change: 15.80, changePercent: 2.23, volume: 3245600, marketCap: 685000000000, peRatio: 125.5, high52Week: 820.00, low52Week: 420.00, avgVolume: 2850000, assetType: 'stock' },
  'PFE': { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.50, change: -0.35, changePercent: -1.21, volume: 42568200, marketCap: 162000000000, peRatio: 12.5, high52Week: 35.00, low52Week: 25.00, avgVolume: 39500000, assetType: 'stock' },
  'MRK': { symbol: 'MRK', name: 'Merck & Co.', price: 125.80, change: 1.65, changePercent: 1.33, volume: 8564200, marketCap: 318000000000, peRatio: 18.5, high52Week: 135.00, low52Week: 98.00, avgVolume: 7950000, assetType: 'stock' },
  'ABBV': { symbol: 'ABBV', name: 'AbbVie Inc.', price: 185.60, change: 2.40, changePercent: 1.31, volume: 6543200, marketCap: 328000000000, peRatio: 52.5, high52Week: 198.00, low52Week: 135.00, avgVolume: 6100000, assetType: 'stock' },
  'TMO': { symbol: 'TMO', name: 'Thermo Fisher Scientific', price: 585.40, change: 8.50, changePercent: 1.47, volume: 1456800, marketCap: 225000000000, peRatio: 32.5, high52Week: 635.00, low52Week: 415.00, avgVolume: 1320000, assetType: 'stock' },
  'ABT': { symbol: 'ABT', name: 'Abbott Laboratories', price: 115.80, change: 1.45, changePercent: 1.27, volume: 5245600, marketCap: 201000000000, peRatio: 32.5, high52Week: 128.00, low52Week: 95.00, avgVolume: 4850000, assetType: 'stock' },
  'DHR': { symbol: 'DHR', name: 'Danaher Corporation', price: 245.60, change: 3.80, changePercent: 1.57, volume: 2456800, marketCap: 182000000000, peRatio: 28.5, high52Week: 280.00, low52Week: 185.00, avgVolume: 2250000, assetType: 'stock' },
  'BMY': { symbol: 'BMY', name: 'Bristol Myers Squibb', price: 52.40, change: 0.65, changePercent: 1.26, volume: 14568200, marketCap: 105000000000, peRatio: 12.5, high52Week: 62.00, low52Week: 45.00, avgVolume: 13500000, assetType: 'stock' },
  'AMGN': { symbol: 'AMGN', name: 'Amgen Inc.', price: 285.40, change: 4.20, changePercent: 1.49, volume: 2456800, marketCap: 152000000000, peRatio: 22.5, high52Week: 325.00, low52Week: 215.00, avgVolume: 2250000, assetType: 'stock' },

  // Consumer & Retail
  'WMT': { symbol: 'WMT', name: 'Walmart Inc.', price: 68.50, change: 0.85, changePercent: 1.26, volume: 16584200, marketCap: 552000000000, peRatio: 25.5, high52Week: 75.00, low52Week: 52.00, avgVolume: 15200000, assetType: 'stock' },
  'COST': { symbol: 'COST', name: 'Costco Wholesale', price: 785.40, change: 12.50, changePercent: 1.62, volume: 1856400, marketCap: 348000000000, peRatio: 48.5, high52Week: 850.00, low52Week: 545.00, avgVolume: 1650000, assetType: 'stock' },
  'HD': { symbol: 'HD', name: 'Home Depot', price: 355.80, change: 5.20, changePercent: 1.48, volume: 4245600, marketCap: 355000000000, peRatio: 22.5, high52Week: 395.00, low52Week: 285.00, avgVolume: 3950000, assetType: 'stock' },
  'PG': { symbol: 'PG', name: 'Procter & Gamble', price: 168.50, change: 2.15, changePercent: 1.29, volume: 7543200, marketCap: 395000000000, peRatio: 26.5, high52Week: 178.00, low52Week: 142.00, avgVolume: 6950000, assetType: 'stock' },
  'KO': { symbol: 'KO', name: 'Coca-Cola Co.', price: 62.85, change: 0.75, changePercent: 1.21, volume: 14568200, marketCap: 272000000000, peRatio: 24.5, high52Week: 68.00, low52Week: 52.00, avgVolume: 13500000, assetType: 'stock' },
  'PEP': { symbol: 'PEP', name: 'PepsiCo Inc.', price: 175.40, change: 2.35, changePercent: 1.36, volume: 5245600, marketCap: 241000000000, peRatio: 25.5, high52Week: 192.00, low52Week: 155.00, avgVolume: 4850000, assetType: 'stock' },
  'MCD': { symbol: 'MCD', name: 'McDonald\'s Corp.', price: 285.60, change: 4.20, changePercent: 1.49, volume: 3245600, marketCap: 205000000000, peRatio: 25.5, high52Week: 310.00, low52Week: 245.00, avgVolume: 2950000, assetType: 'stock' },
  'NKE': { symbol: 'NKE', name: 'Nike Inc.', price: 95.40, change: 1.85, changePercent: 1.98, volume: 12568200, marketCap: 142000000000, peRatio: 28.5, high52Week: 125.00, low52Week: 78.00, avgVolume: 11500000, assetType: 'stock' },
  'SBUX': { symbol: 'SBUX', name: 'Starbucks Corp.', price: 95.80, change: 1.45, changePercent: 1.54, volume: 8543200, marketCap: 108000000000, peRatio: 25.5, high52Week: 115.00, low52Week: 82.00, avgVolume: 7950000, assetType: 'stock' },
  'TGT': { symbol: 'TGT', name: 'Target Corp.', price: 158.40, change: 2.85, changePercent: 1.83, volume: 5245600, marketCap: 73000000000, peRatio: 18.5, high52Week: 182.00, low52Week: 125.00, avgVolume: 4850000, assetType: 'stock' },
  'LOW': { symbol: 'LOW', name: 'Lowe\'s Companies', price: 245.80, change: 3.60, changePercent: 1.49, volume: 3245600, marketCap: 145000000000, peRatio: 22.5, high52Week: 275.00, low52Week: 185.00, avgVolume: 2950000, assetType: 'stock' },

  // Energy
  'XOM': { symbol: 'XOM', name: 'Exxon Mobil', price: 118.50, change: 1.85, changePercent: 1.59, volume: 18564200, marketCap: 468000000000, peRatio: 13.5, high52Week: 125.00, low52Week: 95.00, avgVolume: 17200000, assetType: 'stock' },
  'CVX': { symbol: 'CVX', name: 'Chevron Corp.', price: 158.40, change: 2.45, changePercent: 1.57, volume: 8564200, marketCap: 295000000000, peRatio: 13.8, high52Week: 168.00, low52Week: 135.00, avgVolume: 7950000, assetType: 'stock' },
  'COP': { symbol: 'COP', name: 'ConocoPhillips', price: 115.80, change: 1.85, changePercent: 1.62, volume: 6543200, marketCap: 132000000000, peRatio: 12.5, high52Week: 128.00, low52Week: 95.00, avgVolume: 6100000, assetType: 'stock' },
  'EOG': { symbol: 'EOG', name: 'EOG Resources', price: 135.60, change: 2.15, changePercent: 1.61, volume: 3245600, marketCap: 78000000000, peRatio: 11.5, high52Week: 148.00, low52Week: 108.00, avgVolume: 2950000, assetType: 'stock' },
  'SLB': { symbol: 'SLB', name: 'Schlumberger', price: 52.80, change: 0.85, changePercent: 1.64, volume: 10564200, marketCap: 75000000000, peRatio: 18.5, high52Week: 62.00, low52Week: 42.00, avgVolume: 9850000, assetType: 'stock' },

  // Industrial
  'GE': { symbol: 'GE', name: 'General Electric', price: 165.80, change: 3.20, changePercent: 1.97, volume: 6543200, marketCap: 182000000000, peRatio: 28.5, high52Week: 185.00, low52Week: 95.00, avgVolume: 6100000, assetType: 'stock' },
  'CAT': { symbol: 'CAT', name: 'Caterpillar Inc.', price: 358.40, change: 6.50, changePercent: 1.85, volume: 3245600, marketCap: 175000000000, peRatio: 18.5, high52Week: 395.00, low52Week: 235.00, avgVolume: 2950000, assetType: 'stock' },
  'BA': { symbol: 'BA', name: 'Boeing Co.', price: 185.60, change: 3.80, changePercent: 2.09, volume: 8564200, marketCap: 138000000000, peRatio: -45.2, high52Week: 258.00, low52Week: 152.00, avgVolume: 7950000, assetType: 'stock' },
  'HON': { symbol: 'HON', name: 'Honeywell International', price: 205.40, change: 2.85, changePercent: 1.41, volume: 3245600, marketCap: 135000000000, peRatio: 22.5, high52Week: 225.00, low52Week: 175.00, avgVolume: 2950000, assetType: 'stock' },
  'UPS': { symbol: 'UPS', name: 'United Parcel Service', price: 145.80, change: 2.15, changePercent: 1.50, volume: 4245600, marketCap: 125000000000, peRatio: 18.5, high52Week: 185.00, low52Week: 135.00, avgVolume: 3950000, assetType: 'stock' },
  'FDX': { symbol: 'FDX', name: 'FedEx Corp.', price: 285.60, change: 4.80, changePercent: 1.71, volume: 2456800, marketCap: 68000000000, peRatio: 16.5, high52Week: 325.00, low52Week: 215.00, avgVolume: 2250000, assetType: 'stock' },
  'RTX': { symbol: 'RTX', name: 'RTX Corporation', price: 95.80, change: 1.45, changePercent: 1.54, volume: 5245600, marketCap: 128000000000, peRatio: 38.5, high52Week: 105.00, low52Week: 78.00, avgVolume: 4850000, assetType: 'stock' },
  'LMT': { symbol: 'LMT', name: 'Lockheed Martin', price: 465.80, change: 6.50, changePercent: 1.42, volume: 1456800, marketCap: 112000000000, peRatio: 16.5, high52Week: 510.00, low52Week: 395.00, avgVolume: 1320000, assetType: 'stock' },
  'MMM': { symbol: 'MMM', name: '3M Company', price: 105.40, change: 1.65, changePercent: 1.59, volume: 4245600, marketCap: 58000000000, peRatio: 12.5, high52Week: 125.00, low52Week: 72.00, avgVolume: 3950000, assetType: 'stock' },

  // Telecommunications
  'VZ': { symbol: 'VZ', name: 'Verizon Communications', price: 42.80, change: 0.55, changePercent: 1.30, volume: 22568200, marketCap: 180000000000, peRatio: 15.2, high52Week: 48.00, low52Week: 35.00, avgVolume: 20500000, assetType: 'stock' },
  'T': { symbol: 'T', name: 'AT&T Inc.', price: 18.50, change: 0.25, changePercent: 1.37, volume: 38564200, marketCap: 132000000000, peRatio: 9.5, high52Week: 22.00, low52Week: 14.00, avgVolume: 35500000, assetType: 'stock' },
  'TMUS': { symbol: 'TMUS', name: 'T-Mobile US', price: 175.60, change: 2.85, changePercent: 1.65, volume: 5245600, marketCap: 202000000000, peRatio: 22.5, high52Week: 195.00, low52Week: 135.00, avgVolume: 4850000, assetType: 'stock' },
  'CMCSA': { symbol: 'CMCSA', name: 'Comcast Corp.', price: 42.50, change: 0.65, changePercent: 1.55, volume: 18564200, marketCap: 165000000000, peRatio: 12.5, high52Week: 52.00, low52Week: 38.00, avgVolume: 17200000, assetType: 'stock' },

  // Entertainment & Media
  'DIS': { symbol: 'DIS', name: 'Walt Disney Co.', price: 112.80, change: 2.45, changePercent: 2.22, volume: 14568200, marketCap: 205000000000, peRatio: 72.5, high52Week: 125.00, low52Week: 78.00, avgVolume: 13500000, assetType: 'stock' },
  'WBD': { symbol: 'WBD', name: 'Warner Bros Discovery', price: 9.85, change: 0.15, changePercent: 1.55, volume: 28564200, marketCap: 24000000000, peRatio: -5.2, high52Week: 16.00, low52Week: 7.00, avgVolume: 26500000, assetType: 'stock' },
  'PARA': { symbol: 'PARA', name: 'Paramount Global', price: 12.45, change: 0.25, changePercent: 2.05, volume: 12568200, marketCap: 8200000000, peRatio: -8.5, high52Week: 18.00, low52Week: 10.00, avgVolume: 11500000, assetType: 'stock' },
  'LYV': { symbol: 'LYV', name: 'Live Nation', price: 98.50, change: 1.85, changePercent: 1.91, volume: 2456800, marketCap: 22500000000, peRatio: 45.2, high52Week: 128.00, low52Week: 72.00, avgVolume: 2250000, assetType: 'stock' },

  // Automotive
  'F': { symbol: 'F', name: 'Ford Motor', price: 12.85, change: 0.25, changePercent: 1.98, volume: 52568200, marketCap: 51000000000, peRatio: 12.5, high52Week: 15.00, low52Week: 9.00, avgVolume: 48500000, assetType: 'stock' },
  'GM': { symbol: 'GM', name: 'General Motors', price: 45.80, change: 0.85, changePercent: 1.89, volume: 14568200, marketCap: 53000000000, peRatio: 5.2, high52Week: 52.00, low52Week: 32.00, avgVolume: 13500000, assetType: 'stock' },
  'RIVN': { symbol: 'RIVN', name: 'Rivian Automotive', price: 15.60, change: 0.85, changePercent: 5.76, volume: 48564200, marketCap: 16000000000, peRatio: -2.5, high52Week: 28.00, low52Week: 8.00, avgVolume: 42500000, assetType: 'stock' },
  'LCID': { symbol: 'LCID', name: 'Lucid Group', price: 3.25, change: 0.15, changePercent: 4.84, volume: 32568200, marketCap: 7500000000, peRatio: -3.2, high52Week: 8.00, low52Week: 2.50, avgVolume: 28500000, assetType: 'stock' },

  // Materials & Mining
  'LIN': { symbol: 'LIN', name: 'Linde plc', price: 425.80, change: 5.50, changePercent: 1.31, volume: 1856400, marketCap: 205000000000, peRatio: 28.5, high52Week: 465.00, low52Week: 350.00, avgVolume: 1650000, assetType: 'stock' },
  'FCX': { symbol: 'FCX', name: 'Freeport-McMoRan', price: 45.80, change: 1.25, changePercent: 2.80, volume: 18564200, marketCap: 65000000000, peRatio: 32.5, high52Week: 55.00, low52Week: 32.00, avgVolume: 17200000, assetType: 'stock' },
  'NEM': { symbol: 'NEM', name: 'Newmont Corp.', price: 42.50, change: 0.85, changePercent: 2.04, volume: 10564200, marketCap: 52000000000, peRatio: -15.2, high52Week: 58.00, low52Week: 32.00, avgVolume: 9850000, assetType: 'stock' },
  'DOW': { symbol: 'DOW', name: 'Dow Inc.', price: 55.80, change: 0.95, changePercent: 1.73, volume: 6543200, marketCap: 39000000000, peRatio: 22.5, high52Week: 62.00, low52Week: 45.00, avgVolume: 6100000, assetType: 'stock' },

  // Utilities
  'NEE': { symbol: 'NEE', name: 'NextEra Energy', price: 72.50, change: 0.95, changePercent: 1.33, volume: 10564200, marketCap: 148000000000, peRatio: 18.5, high52Week: 82.00, low52Week: 52.00, avgVolume: 9850000, assetType: 'stock' },
  'SO': { symbol: 'SO', name: 'Southern Company', price: 72.80, change: 0.85, changePercent: 1.18, volume: 5245600, marketCap: 79000000000, peRatio: 18.5, high52Week: 78.00, low52Week: 62.00, avgVolume: 4850000, assetType: 'stock' },
  'DUK': { symbol: 'DUK', name: 'Duke Energy', price: 105.40, change: 1.15, changePercent: 1.10, volume: 4245600, marketCap: 81000000000, peRatio: 18.5, high52Week: 115.00, low52Week: 85.00, avgVolume: 3950000, assetType: 'stock' },

  // Real Estate
  'AMT': { symbol: 'AMT', name: 'American Tower', price: 195.60, change: 2.85, changePercent: 1.48, volume: 2456800, marketCap: 91000000000, peRatio: 52.5, high52Week: 225.00, low52Week: 155.00, avgVolume: 2250000, assetType: 'stock' },
  'PLD': { symbol: 'PLD', name: 'Prologis Inc.', price: 125.80, change: 1.85, changePercent: 1.49, volume: 3245600, marketCap: 116000000000, peRatio: 32.5, high52Week: 145.00, low52Week: 98.00, avgVolume: 2950000, assetType: 'stock' },
  'CCI': { symbol: 'CCI', name: 'Crown Castle', price: 115.40, change: 1.65, changePercent: 1.45, volume: 2456800, marketCap: 50000000000, peRatio: 32.5, high52Week: 145.00, low52Week: 95.00, avgVolume: 2250000, assetType: 'stock' },

  // Airlines & Travel
  'AAL': { symbol: 'AAL', name: 'American Airlines', price: 15.85, change: 0.45, changePercent: 2.92, volume: 42568200, marketCap: 10400000000, peRatio: 8.5, high52Week: 19.00, low52Week: 10.00, avgVolume: 38500000, assetType: 'stock' },
  'DAL': { symbol: 'DAL', name: 'Delta Air Lines', price: 48.50, change: 1.25, changePercent: 2.64, volume: 14568200, marketCap: 31000000000, peRatio: 8.5, high52Week: 58.00, low52Week: 32.00, avgVolume: 13500000, assetType: 'stock' },
  'UAL': { symbol: 'UAL', name: 'United Airlines', price: 58.40, change: 1.85, changePercent: 3.27, volume: 8564200, marketCap: 19200000000, peRatio: 6.5, high52Week: 72.00, low52Week: 38.00, avgVolume: 7950000, assetType: 'stock' },
  'CCL': { symbol: 'CCL', name: 'Carnival Corp.', price: 25.80, change: 0.85, changePercent: 3.41, volume: 38564200, marketCap: 32000000000, peRatio: -8.5, high52Week: 32.00, low52Week: 14.00, avgVolume: 35500000, assetType: 'stock' },
  'RCL': { symbol: 'RCL', name: 'Royal Caribbean', price: 135.60, change: 3.50, changePercent: 2.65, volume: 3245600, marketCap: 35000000000, peRatio: 18.5, high52Week: 158.00, low52Week: 85.00, avgVolume: 2950000, assetType: 'stock' },

  // Gaming & Casinos
  'MGM': { symbol: 'MGM', name: 'MGM Resorts', price: 42.80, change: 1.25, changePercent: 3.01, volume: 6543200, marketCap: 13500000000, peRatio: 12.5, high52Week: 52.00, low52Week: 32.00, avgVolume: 6100000, assetType: 'stock' },
  'WYNN': { symbol: 'WYNN', name: 'Wynn Resorts', price: 98.50, change: 2.85, changePercent: 2.98, volume: 1856400, marketCap: 11000000000, peRatio: 22.5, high52Week: 125.00, low52Week: 72.00, avgVolume: 1650000, assetType: 'stock' },
  'LVS': { symbol: 'LVS', name: 'Las Vegas Sands', price: 52.40, change: 1.45, changePercent: 2.85, volume: 5245600, marketCap: 39500000000, peRatio: 32.5, high52Week: 65.00, low52Week: 38.00, avgVolume: 4850000, assetType: 'stock' },

  // Payment Processing
  'SQ': { symbol: 'SQ', name: 'Block Inc.', price: 82.50, change: 3.25, changePercent: 4.10, volume: 12568200, marketCap: 51000000000, peRatio: 85.2, high52Week: 95.00, low52Week: 52.00, avgVolume: 11500000, assetType: 'stock' },
  'SOFI': { symbol: 'SOFI', name: 'SoFi Technologies', price: 7.25, change: 0.35, changePercent: 5.07, volume: 52568200, marketCap: 7200000000, peRatio: -12.5, high52Week: 11.00, low52Week: 5.00, avgVolume: 48500000, assetType: 'stock' },
  'AFRM': { symbol: 'AFRM', name: 'Affirm Holdings', price: 38.50, change: 2.15, changePercent: 5.91, volume: 8564200, marketCap: 12000000000, peRatio: -15.2, high52Week: 52.00, low52Week: 22.00, avgVolume: 7950000, assetType: 'stock' },

  // E-commerce
  'SHOP': { symbol: 'SHOP', name: 'Shopify Inc.', price: 78.50, change: 2.85, changePercent: 3.77, volume: 14568200, marketCap: 101000000000, peRatio: -85.2, high52Week: 95.00, low52Week: 52.00, avgVolume: 13500000, assetType: 'stock' },
  'ETSY': { symbol: 'ETSY', name: 'Etsy Inc.', price: 72.50, change: 2.15, changePercent: 3.06, volume: 3245600, marketCap: 8500000000, peRatio: 28.5, high52Week: 125.00, low52Week: 58.00, avgVolume: 2950000, assetType: 'stock' },
  'EBAY': { symbol: 'EBAY', name: 'eBay Inc.', price: 62.80, change: 1.25, changePercent: 2.03, volume: 6543200, marketCap: 32000000000, peRatio: 12.5, high52Week: 52.00, low52Week: 38.00, avgVolume: 6100000, assetType: 'stock' },

  // Cybersecurity
  'CRWD': { symbol: 'CRWD', name: 'CrowdStrike', price: 325.80, change: 12.50, changePercent: 4.00, volume: 3245600, marketCap: 79000000000, peRatio: 385.2, high52Week: 385.00, low52Week: 165.00, avgVolume: 2950000, assetType: 'stock' },
  'PANW': { symbol: 'PANW', name: 'Palo Alto Networks', price: 185.60, change: 4.80, changePercent: 2.66, volume: 3245600, marketCap: 58000000000, peRatio: 45.2, high52Week: 225.00, low52Week: 135.00, avgVolume: 2950000, assetType: 'stock' },
  'FTNT': { symbol: 'FTNT', name: 'Fortinet Inc.', price: 72.50, change: 1.85, changePercent: 2.62, volume: 5245600, marketCap: 55000000000, peRatio: 42.5, high52Week: 82.00, low52Week: 48.00, avgVolume: 4850000, assetType: 'stock' },
  'ZS': { symbol: 'ZS', name: 'Zscaler Inc.', price: 185.80, change: 6.50, changePercent: 3.62, volume: 2456800, marketCap: 28000000000, peRatio: -125.2, high52Week: 258.00, low52Week: 125.00, avgVolume: 2250000, assetType: 'stock' },

  // Cloud Computing
  'NOW': { symbol: 'NOW', name: 'ServiceNow', price: 785.40, change: 18.50, changePercent: 2.41, volume: 1456800, marketCap: 162000000000, peRatio: 85.2, high52Week: 920.00, low52Week: 525.00, avgVolume: 1320000, assetType: 'stock' },
  'TEAM': { symbol: 'TEAM', name: 'Atlassian', price: 185.60, change: 5.80, changePercent: 3.23, volume: 1856400, marketCap: 48000000000, peRatio: -85.2, high52Week: 225.00, low52Week: 125.00, avgVolume: 1650000, assetType: 'stock' },
  'DDOG': { symbol: 'DDOG', name: 'Datadog Inc.', price: 125.80, change: 4.50, changePercent: 3.71, volume: 5245600, marketCap: 42000000000, peRatio: 285.2, high52Week: 158.00, low52Week: 82.00, avgVolume: 4850000, assetType: 'stock' },
  'MDB': { symbol: 'MDB', name: 'MongoDB', price: 285.40, change: 8.50, changePercent: 3.07, volume: 1856400, marketCap: 21000000000, peRatio: -125.2, high52Week: 425.00, low52Week: 225.00, avgVolume: 1650000, assetType: 'stock' },
  'NET': { symbol: 'NET', name: 'Cloudflare', price: 95.80, change: 3.25, changePercent: 3.51, volume: 6543200, marketCap: 32000000000, peRatio: -185.2, high52Week: 125.00, low52Week: 58.00, avgVolume: 6100000, assetType: 'stock' },

  // Semiconductors
  'TSM': { symbol: 'TSM', name: 'Taiwan Semiconductor', price: 145.80, change: 3.50, changePercent: 2.46, volume: 14568200, marketCap: 755000000000, peRatio: 25.5, high52Week: 175.00, low52Week: 95.00, avgVolume: 13500000, assetType: 'stock' },
  'ASML': { symbol: 'ASML', name: 'ASML Holding', price: 985.60, change: 18.50, changePercent: 1.91, volume: 856420, marketCap: 388000000000, peRatio: 42.5, high52Week: 1150.00, low52Week: 625.00, avgVolume: 785000, assetType: 'stock' },
  'QCOM': { symbol: 'QCOM', name: 'Qualcomm Inc.', price: 175.80, change: 3.25, changePercent: 1.88, volume: 6543200, marketCap: 195000000000, peRatio: 18.5, high52Week: 205.00, low52Week: 125.00, avgVolume: 6100000, assetType: 'stock' },
  'MU': { symbol: 'MU', name: 'Micron Technology', price: 125.60, change: 4.50, changePercent: 3.72, volume: 18564200, marketCap: 140000000000, peRatio: -25.2, high52Week: 158.00, low52Week: 72.00, avgVolume: 17200000, assetType: 'stock' },
  'LRCX': { symbol: 'LRCX', name: 'Lam Research', price: 925.80, change: 18.50, changePercent: 2.04, volume: 1456800, marketCap: 118000000000, peRatio: 32.5, high52Week: 1100.00, low52Week: 625.00, avgVolume: 1320000, assetType: 'stock' },
  'KLAC': { symbol: 'KLAC', name: 'KLA Corporation', price: 685.40, change: 12.50, changePercent: 1.86, volume: 1456800, marketCap: 88000000000, peRatio: 28.5, high52Week: 825.00, low52Week: 485.00, avgVolume: 1320000, assetType: 'stock' },
  'NXPI': { symbol: 'NXPI', name: 'NXP Semiconductors', price: 258.50, change: 5.80, changePercent: 2.29, volume: 2456800, marketCap: 65000000000, peRatio: 22.5, high52Week: 295.00, low52Week: 175.00, avgVolume: 2250000, assetType: 'stock' },

  // Biotech
  'VRTX': { symbol: 'VRTX', name: 'Vertex Pharmaceuticals', price: 485.60, change: 8.50, changePercent: 1.78, volume: 1456800, marketCap: 125000000000, peRatio: 28.5, high52Week: 525.00, low52Week: 325.00, avgVolume: 1320000, assetType: 'stock' },
  'REGN': { symbol: 'REGN', name: 'Regeneron Pharma', price: 985.40, change: 15.80, changePercent: 1.63, volume: 856420, marketCap: 108000000000, peRatio: 25.5, high52Week: 1125.00, low52Week: 725.00, avgVolume: 785000, assetType: 'stock' },
  'BIIB': { symbol: 'BIIB', name: 'Biogen Inc.', price: 225.80, change: 4.50, changePercent: 2.03, volume: 1856400, marketCap: 32500000000, peRatio: 25.5, high52Week: 295.00, low52Week: 185.00, avgVolume: 1650000, assetType: 'stock' },
  'GILD': { symbol: 'GILD', name: 'Gilead Sciences', price: 78.50, change: 1.25, changePercent: 1.62, volume: 6543200, marketCap: 98000000000, peRatio: 18.5, high52Week: 92.00, low52Week: 62.00, avgVolume: 6100000, assetType: 'stock' },
};

// Top 20 Cryptocurrencies on Binance (by market cap)
const mockCrypto: Record<string, StockData> = {
  'BTC': { symbol: 'BTC', name: 'Bitcoin', price: 67542.30, change: 1245.50, changePercent: 1.88, volume: 28500000000, marketCap: 1320000000000, high24h: 68900.00, low24h: 65800.00, circulatingSupply: 19650000, totalSupply: 21000000, assetType: 'crypto' },
  'ETH': { symbol: 'ETH', name: 'Ethereum', price: 3521.75, change: 89.20, changePercent: 2.60, volume: 15200000000, marketCap: 423000000000, high24h: 3580.00, low24h: 3410.00, circulatingSupply: 120100000, assetType: 'crypto' },
  'BNB': { symbol: 'BNB', name: 'BNB', price: 612.45, change: 8.30, changePercent: 1.37, volume: 1800000000, marketCap: 92000000000, high24h: 618.00, low24h: 601.00, circulatingSupply: 150000000, assetType: 'crypto' },
  'SOL': { symbol: 'SOL', name: 'Solana', price: 142.85, change: -3.45, changePercent: -2.36, volume: 3200000000, marketCap: 64200000000, high24h: 148.20, low24h: 140.50, circulatingSupply: 449000000, assetType: 'crypto' },
  'XRP': { symbol: 'XRP', name: 'XRP', price: 0.6234, change: 0.0234, changePercent: 3.90, volume: 2100000000, marketCap: 34000000000, high24h: 0.6350, low24h: 0.5980, circulatingSupply: 54500000000, assetType: 'crypto' },
  'DOGE': { symbol: 'DOGE', name: 'Dogecoin', price: 0.1585, change: 0.0085, changePercent: 5.66, volume: 1850000000, marketCap: 22800000000, high24h: 0.1620, low24h: 0.1480, circulatingSupply: 144000000000, assetType: 'crypto' },
  'TON': { symbol: 'TON', name: 'Toncoin', price: 5.85, change: 0.25, changePercent: 4.46, volume: 285000000, marketCap: 20200000000, high24h: 6.05, low24h: 5.55, circulatingSupply: 3450000000, assetType: 'crypto' },
  'ADA': { symbol: 'ADA', name: 'Cardano', price: 0.485, change: 0.0185, changePercent: 3.97, volume: 485000000, marketCap: 17200000000, high24h: 0.498, low24h: 0.462, circulatingSupply: 35500000000, assetType: 'crypto' },
  'SHIB': { symbol: 'SHIB', name: 'Shiba Inu', price: 0.0000285, change: 0.0000012, changePercent: 4.40, volume: 625000000, marketCap: 16800000000, high24h: 0.0000295, low24h: 0.0000268, circulatingSupply: 589000000000000, assetType: 'crypto' },
  'AVAX': { symbol: 'AVAX', name: 'Avalanche', price: 38.85, change: 1.85, changePercent: 5.00, volume: 485000000, marketCap: 15200000000, high24h: 40.25, low24h: 36.50, circulatingSupply: 391000000, assetType: 'crypto' },
  'DOT': { symbol: 'DOT', name: 'Polkadot', price: 7.85, change: 0.35, changePercent: 4.67, volume: 285000000, marketCap: 11800000000, high24h: 8.15, low24h: 7.45, circulatingSupply: 1500000000, assetType: 'crypto' },
  'LINK': { symbol: 'LINK', name: 'Chainlink', price: 18.95, change: 0.95, changePercent: 5.28, volume: 425000000, marketCap: 11100000000, high24h: 19.85, low24h: 17.85, circulatingSupply: 587000000, assetType: 'crypto' },
  'TRX': { symbol: 'TRX', name: 'TRON', price: 0.125, change: 0.005, changePercent: 4.17, volume: 385000000, marketCap: 10800000000, high24h: 0.128, low24h: 0.118, circulatingSupply: 86400000000, assetType: 'crypto' },
  'NEAR': { symbol: 'NEAR', name: 'NEAR Protocol', price: 6.85, change: 0.45, changePercent: 7.03, volume: 385000000, marketCap: 7200000000, high24h: 7.15, low24h: 6.35, circulatingSupply: 1050000000, assetType: 'crypto' },
  'MATIC': { symbol: 'MATIC', name: 'Polygon', price: 0.725, change: 0.035, changePercent: 5.07, volume: 325000000, marketCap: 6800000000, high24h: 0.758, low24h: 0.682, circulatingSupply: 9370000000, assetType: 'crypto' },
  'ICP': { symbol: 'ICP', name: 'Internet Computer', price: 12.85, change: 0.85, changePercent: 7.08, volume: 185000000, marketCap: 5950000000, high24h: 13.45, low24h: 11.85, circulatingSupply: 463000000, assetType: 'crypto' },
  'LTC': { symbol: 'LTC', name: 'Litecoin', price: 85.40, change: 3.20, changePercent: 3.89, volume: 385000000, marketCap: 6350000000, high24h: 88.50, low24h: 81.50, circulatingSupply: 74400000, assetType: 'crypto' },
  'UNI': { symbol: 'UNI', name: 'Uniswap', price: 9.85, change: 0.65, changePercent: 7.07, volume: 225000000, marketCap: 5900000000, high24h: 10.35, low24h: 9.15, circulatingSupply: 599000000, assetType: 'crypto' },
  'APT': { symbol: 'APT', name: 'Aptos', price: 9.25, change: 0.75, changePercent: 8.82, volume: 285000000, marketCap: 4250000000, high24h: 9.85, low24h: 8.45, circulatingSupply: 459000000, assetType: 'crypto' },
  'ETC': { symbol: 'ETC', name: 'Ethereum Classic', price: 28.50, change: 1.85, changePercent: 6.94, volume: 285000000, marketCap: 4200000000, high24h: 29.85, low24h: 26.45, circulatingSupply: 147000000, assetType: 'crypto' },
};

const allAssets = { ...mockStocks, ...mockCrypto };

// Generate mock historical data with technical indicators
const generateHistoricalData = (symbol: string, days: number = 180): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const basePrice = allAssets[symbol]?.price || 150;
  let currentPrice = basePrice * 0.85;
  const prices50: number[] = [];
  const prices200: number[] = [];
  
  const now = new Date();
  for (let i = days + 200; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const volatility = 0.025;
    const trend = 0.0008;
    const change = (Math.random() - 0.48) * volatility + trend;
    currentPrice = currentPrice * (1 + change);
    
    const dayRange = currentPrice * volatility * 0.5;
    const open = currentPrice + (Math.random() - 0.5) * dayRange;
    const high = Math.max(open, currentPrice) + Math.random() * dayRange * 0.5;
    const low = Math.min(open, currentPrice) - Math.random() * dayRange * 0.5;
    const close = currentPrice;
    const volume = Math.floor(20000000 + Math.random() * 40000000);
    
    prices50.push(close);
    prices200.push(close);
    if (prices50.length > 50) prices50.shift();
    if (prices200.length > 200) prices200.shift();
    
    const sma50 = prices50.length === 50 ? prices50.reduce((a, b) => a + b, 0) / 50 : undefined;
    const sma200 = prices200.length === 200 ? prices200.reduce((a, b) => a + b, 0) / 200 : undefined;
    
    const rsi = 30 + Math.random() * 40;
    const macd = (Math.random() - 0.5) * 5;
    const macdSignal = macd + (Math.random() - 0.5) * 2;
    const bbMiddle = sma50 || close;
    const bbStd = close * 0.02;
    const upperBand = bbMiddle + bbStd * 2;
    const lowerBand = bbMiddle - bbStd * 2;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
      sma50,
      sma200,
      rsi: Number(rsi.toFixed(2)),
      macd: Number(macd.toFixed(2)),
      macdSignal: Number(macdSignal.toFixed(2)),
      upperBand: Number(upperBand.toFixed(2)),
      lowerBand: Number(lowerBand.toFixed(2)),
    });
  }
  
  return data.slice(-days);
};

// Mock news data with AI analysis
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Apple Expands Manufacturing Operations in India',
    summary: 'Apple announces significant expansion of iPhone production facilities in India as part of supply chain diversification strategy.',
    source: 'Reuters',
    publishedAt: '2024-02-27T14:30:00Z',
    relatedStocks: ['AAPL'],
    geography: ['India', 'Asia-Pacific'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 78,
      reasoning: 'Supply chain diversification reduces geopolitical risk and lowers production costs, potentially improving margins by 2-3%.',
      keyFactors: ['Cost reduction', 'Risk mitigation', 'Market expansion'],
    },
  },
  {
    id: '2',
    title: 'EU Regulators Investigate Tech Giants for Antitrust Violations',
    summary: 'European Union launches comprehensive investigation into major technology companies regarding potential antitrust concerns.',
    source: 'Financial Times',
    publishedAt: '2024-02-27T10:15:00Z',
    relatedStocks: ['AAPL', 'GOOGL', 'AMZN', 'META', 'MSFT'],
    geography: ['Europe', 'EU'],
    sentiment: 'negative',
    aiAnalysis: {
      direction: 'downward',
      confidence: 65,
      reasoning: 'Regulatory scrutiny may lead to fines and operational restrictions, creating near-term headwinds for affected companies.',
      keyFactors: ['Regulatory risk', 'Potential fines', 'Operational constraints'],
    },
  },
  {
    id: '3',
    title: 'Bitcoin ETF Inflows Reach Record Highs',
    summary: 'Institutional investors continue to pour capital into Bitcoin ETFs, with daily inflows exceeding $500 million.',
    source: 'Bloomberg',
    publishedAt: '2024-02-27T16:00:00Z',
    relatedStocks: ['BTC'],
    geography: ['USA', 'Global'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 85,
      reasoning: 'Sustained institutional demand through ETFs creates strong buy pressure, likely to drive prices higher in the short term.',
      keyFactors: ['Institutional demand', 'Supply squeeze', 'Mainstream adoption'],
    },
  },
  {
    id: '4',
    title: 'NVIDIA AI Chips Face Export Restrictions to China',
    summary: 'New U.S. regulations impose additional restrictions on AI chip exports to China, impacting NVIDIA revenue forecasts.',
    source: 'Bloomberg',
    publishedAt: '2024-02-26T16:45:00Z',
    relatedStocks: ['NVDA'],
    geography: ['China', 'USA', 'Asia-Pacific'],
    sentiment: 'negative',
    aiAnalysis: {
      direction: 'downward',
      confidence: 72,
      reasoning: 'China represents ~20% of NVIDIA data center revenue. Export restrictions could impact Q2 earnings by 5-8%.',
      keyFactors: ['Revenue impact', 'Market access loss', 'Regulatory uncertainty'],
    },
  },
  {
    id: '5',
    title: 'Tesla Opens New Gigafactory in Mexico',
    summary: 'Tesla inaugurates new manufacturing facility in Mexico to serve North and South American markets.',
    source: 'Wall Street Journal',
    publishedAt: '2024-02-26T12:00:00Z',
    relatedStocks: ['TSLA'],
    geography: ['Mexico', 'North America', 'Latin America'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 70,
      reasoning: 'Expanded production capacity supports delivery growth targets and reduces logistics costs for key markets.',
      keyFactors: ['Capacity expansion', 'Cost optimization', 'Market access'],
    },
  },
  {
    id: '6',
    title: 'Ethereum Network Upgrade Successfully Deployed',
    summary: 'Major Ethereum upgrade improves transaction throughput and reduces gas fees by 40%.',
    source: 'CoinDesk',
    publishedAt: '2024-02-26T10:00:00Z',
    relatedStocks: ['ETH'],
    geography: ['Global'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 82,
      reasoning: 'Improved network efficiency enhances ETH utility and competitiveness against alternative L1s, supporting price appreciation.',
      keyFactors: ['Network efficiency', 'User experience', 'Competitive advantage'],
    },
  },
  {
    id: '7',
    title: 'Microsoft Cloud Revenue Surges in Q4',
    summary: 'Microsoft reports stronger than expected cloud computing revenue driven by Azure growth and AI services adoption.',
    source: 'CNBC',
    publishedAt: '2024-02-25T09:30:00Z',
    relatedStocks: ['MSFT'],
    geography: ['Global'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 88,
      reasoning: 'Cloud and AI momentum demonstrates sustainable competitive advantages with expanding margins and recurring revenue.',
      keyFactors: ['Revenue growth', 'Margin expansion', 'AI leadership'],
    },
  },
  {
    id: '8',
    title: 'Solana Network Experiences Brief Outage',
    summary: 'Solana blockchain halted for 45 minutes due to validator consensus issues, raising reliability concerns.',
    source: 'The Block',
    publishedAt: '2024-02-25T08:00:00Z',
    relatedStocks: ['SOL'],
    geography: ['Global'],
    sentiment: 'negative',
    aiAnalysis: {
      direction: 'downward',
      confidence: 60,
      reasoning: 'Network reliability issues may deter institutional adoption and drive capital toward more stable alternatives.',
      keyFactors: ['Reliability concerns', 'Adoption risk', 'Competitive pressure'],
    },
  },
  {
    id: '9',
    title: 'Bitcoin Halving Event Approaches',
    summary: 'Bitcoin\'s next halving event scheduled for April 2024, reducing block rewards from 6.25 to 3.125 BTC.',
    source: 'CryptoSlate',
    publishedAt: '2024-02-24T14:00:00Z',
    relatedStocks: ['BTC'],
    geography: ['Global'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 75,
      reasoning: 'Historical halving cycles show 12-18 month bull runs post-event. Supply reduction typically drives price appreciation.',
      keyFactors: ['Supply reduction', 'Historical precedent', 'Miner economics'],
    },
  },
  {
    id: '10',
    title: 'JPMorgan Beats Q4 Earnings Estimates',
    summary: 'JPMorgan Chase reports record quarterly profits driven by investment banking recovery and net interest income growth.',
    source: 'Reuters',
    publishedAt: '2024-02-24T11:30:00Z',
    relatedStocks: ['JPM'],
    geography: ['USA'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 80,
      reasoning: 'Strong earnings momentum with diversified revenue streams positions JPM for continued outperformance in rising rate environment.',
      keyFactors: ['Earnings beat', 'Revenue diversification', 'Rate environment'],
    },
  },
  {
    id: '11',
    title: 'Cardano Smart Contract Activity Hits All-Time High',
    summary: 'Cardano network sees record smart contract deployments as DeFi ecosystem expands rapidly.',
    source: 'CoinTelegraph',
    publishedAt: '2024-02-23T16:45:00Z',
    relatedStocks: ['ADA'],
    geography: ['Global'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 68,
      reasoning: 'Growing developer activity and TVL growth signal ecosystem maturation, supporting ADA price appreciation potential.',
      keyFactors: ['DeFi growth', 'Developer activity', 'TVL increase'],
    },
  },
  {
    id: '12',
    title: 'Fed Signals Potential Rate Cuts in 2024',
    summary: 'Federal Reserve hints at possible interest rate reductions later this year as inflation moderates.',
    source: 'Wall Street Journal',
    publishedAt: '2024-02-23T14:00:00Z',
    relatedStocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA'],
    geography: ['USA', 'Global'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 78,
      reasoning: 'Lower interest rates reduce discount rates for growth stocks and improve borrowing conditions, supporting equity valuations.',
      keyFactors: ['Rate cuts', 'Valuation support', 'Growth premium'],
    },
  },
  {
    id: '13',
    title: 'Chainlink CCIP Expands to New Blockchains',
    summary: 'Chainlink\'s Cross-Chain Interoperability Protocol adds support for 5 additional Layer 1 networks.',
    source: 'The Defiant',
    publishedAt: '2024-02-22T12:00:00Z',
    relatedStocks: ['LINK'],
    geography: ['Global'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 72,
      reasoning: 'Expanded interoperability strengthens Chainlink\'s position as leading oracle provider, driving token demand.',
      keyFactors: ['Network expansion', 'Oracle demand', 'Interoperability growth'],
    },
  },
  {
    id: '14',
    title: 'Oil Prices Surge on Middle East Tensions',
    summary: 'Crude oil prices jump 5% as geopolitical tensions escalate in key producing regions.',
    source: 'Bloomberg',
    publishedAt: '2024-02-22T10:30:00Z',
    relatedStocks: ['XOM', 'CVX', 'COP'],
    geography: ['Middle East', 'Global'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 70,
      reasoning: 'Higher oil prices directly improve margins for integrated oil majors, supporting earnings and dividend capacity.',
      keyFactors: ['Oil price increase', 'Margin expansion', 'Supply concerns'],
    },
  },
  {
    id: '15',
    title: 'Avalanche Subnet Adoption Accelerates',
    summary: 'Multiple enterprise projects launch on Avalanche subnets, demonstrating real-world blockchain adoption.',
    source: 'CoinDesk',
    publishedAt: '2024-02-21T15:00:00Z',
    relatedStocks: ['AVAX'],
    geography: ['Global'],
    sentiment: 'positive',
    aiAnalysis: {
      direction: 'upward',
      confidence: 65,
      reasoning: 'Enterprise adoption validates Avalanche\'s subnet architecture, potentially driving sustained token demand.',
      keyFactors: ['Enterprise adoption', 'Subnet growth', 'Real-world use cases'],
    },
  },
];

// Generate technical indicators with pattern detection
const generateTechnicalIndicators = (symbol: string, data: HistoricalData[]): TechnicalIndicator[] => {
  const basePrice = allAssets[symbol]?.price || 150;
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  
  const sma50 = latest?.sma50 || basePrice;
  const sma200 = latest?.sma200 || basePrice * 0.9;
  const prevSma50 = prev?.sma50 || sma50;
  const prevSma200 = prev?.sma200 || sma200;
  
  let crossSignal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let crossDescription = 'No significant crossover detected';
  
  if (prevSma50 <= prevSma200 && sma50 > sma200) {
    crossSignal = 'buy';
    crossDescription = 'Golden Cross: 50-day SMA crossed above 200-day SMA - Bullish signal';
  } else if (prevSma50 >= prevSma200 && sma50 < sma200) {
    crossSignal = 'sell';
    crossDescription = 'Death Cross: 50-day SMA crossed below 200-day SMA - Bearish signal';
  }
  
  return [
    {
      name: 'RSI (14)',
      value: latest?.rsi || 45 + Math.random() * 30,
      signal: (latest?.rsi || 50) > 70 ? 'sell' : (latest?.rsi || 50) < 30 ? 'buy' : 'neutral',
      description: 'Relative Strength Index - Momentum oscillator. Above 70 = overbought, below 30 = oversold.',
      category: 'momentum',
      chartable: true,
    },
    {
      name: 'MACD',
      value: latest?.macd || (Math.random() - 0.5) * 5,
      signal: (latest?.macd || 0) > (latest?.macdSignal || 0) ? 'buy' : 'sell',
      description: 'Moving Average Convergence Divergence - Trend following momentum indicator',
      category: 'trend',
      chartable: true,
    },
    {
      name: 'SMA (50)',
      value: sma50,
      signal: basePrice > sma50 ? 'buy' : 'sell',
      description: '50-Day Simple Moving Average - Short-term trend indicator',
      category: 'trend',
      chartable: true,
    },
    {
      name: 'SMA (200)',
      value: sma200,
      signal: basePrice > sma200 ? 'buy' : 'sell',
      description: '200-Day Simple Moving Average - Long-term trend indicator',
      category: 'trend',
      chartable: true,
    },
    {
      name: 'Golden/Death Cross',
      value: sma50 - sma200,
      signal: crossSignal,
      description: crossDescription,
      category: 'pattern',
      chartable: true,
    },
    {
      name: 'Bollinger Bands',
      value: latest?.upperBand || basePrice * 1.02,
      signal: basePrice > (latest?.upperBand || basePrice * 1.02) ? 'sell' : basePrice < (latest?.lowerBand || basePrice * 0.98) ? 'buy' : 'neutral',
      description: 'Volatility bands. Price above upper band = overbought, below lower band = oversold.',
      category: 'volatility',
      chartable: true,
    },
    {
      name: 'Stochastic',
      value: 30 + Math.random() * 40,
      signal: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'neutral' : 'sell',
      description: 'Stochastic Oscillator - Momentum indicator comparing closing price to price range',
      category: 'momentum',
      chartable: false,
    },
    {
      name: 'Support/Resistance',
      value: basePrice,
      signal: 'neutral',
      description: `Key support at $${(basePrice * 0.95).toFixed(2)}, resistance at $${(basePrice * 1.05).toFixed(2)}`,
      category: 'pattern',
      chartable: true,
    },
  ];
};

// Generate pattern signals
const generatePatternSignals = (data: HistoricalData[]): PatternSignal[] => {
  const patterns: PatternSignal[] = [];
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  
  if (latest?.sma50 && latest?.sma200 && prev?.sma50 && prev?.sma200) {
    if (prev.sma50 <= prev.sma200 && latest.sma50 > latest.sma200) {
      patterns.push({
        name: 'Golden Cross',
        type: 'golden_cross',
        signal: 'buy',
        description: '50-day SMA crossed above 200-day SMA - Strong bullish signal indicating long-term trend reversal',
        strength: 'strong',
      });
    } else if (prev.sma50 >= prev.sma200 && latest.sma50 < latest.sma200) {
      patterns.push({
        name: 'Death Cross',
        type: 'death_cross',
        signal: 'sell',
        description: '50-day SMA crossed below 200-day SMA - Strong bearish signal indicating long-term downtrend',
        strength: 'strong',
      });
    }
  }
  
  if (prev && latest) {
    const prevBody = Math.abs(prev.close - prev.open);
    const latestBody = Math.abs(latest.close - latest.open);
    const isPrevRed = prev.close < prev.open;
    const isLatestGreen = latest.close > latest.open;
    
    if (isPrevRed && isLatestGreen && latestBody > prevBody * 1.2) {
      patterns.push({
        name: 'Bullish Engulfing',
        type: 'bullish_engulfing',
        signal: 'buy',
        description: 'Bullish candle completely engulfs previous bearish candle - Potential trend reversal',
        strength: 'moderate',
      });
    }
    
    const isPrevGreen = prev.close > prev.open;
    const isLatestRed = latest.close < latest.open;
    
    if (isPrevGreen && isLatestRed && latestBody > prevBody * 1.2) {
      patterns.push({
        name: 'Bearish Engulfing',
        type: 'bearish_engulfing',
        signal: 'sell',
        description: 'Bearish candle completely engulfs previous bullish candle - Potential trend reversal',
        strength: 'moderate',
      });
    }
  }
  
  return patterns;
};

// Mock market report
const generateMarketReport = (symbol: string): MarketReport => {
  const stock = allAssets[symbol];
  const currentPrice = stock?.price || 150;
  const priceTarget = currentPrice * (0.85 + Math.random() * 0.3);
  const upside = ((priceTarget - currentPrice) / currentPrice) * 100;
  
  const ratings: ('Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell')[] = ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'];
  const overallRating = upside > 15 ? 'Strong Buy' : upside > 5 ? 'Buy' : upside > -5 ? 'Hold' : upside > -15 ? 'Sell' : 'Strong Sell';
  
  const firms = ['Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Bank of America', 'Citigroup', 'Wells Fargo', 'Barclays', 'UBS'];
  
  return {
    overallRating,
    consensusPriceTarget: Number(priceTarget.toFixed(2)),
    currentPrice,
    upsidePotential: Number(upside.toFixed(2)),
    analystCount: 25 + Math.floor(Math.random() * 15),
    recommendations: firms.slice(0, 5).map(firm => ({
      firm,
      rating: ratings[Math.floor(Math.random() * ratings.length)],
      priceTarget: Number((currentPrice * (0.8 + Math.random() * 0.4)).toFixed(2)),
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    })),
  };
};

export function useStockData() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [patternSignals, setPatternSignals] = useState<PatternSignal[]>([]);
  const [marketReport, setMarketReport] = useState<MarketReport | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);

  const fetchStockData = useCallback(async (symbol: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const stock = allAssets[symbol] || allAssets['AAPL'];
    const histData = generateHistoricalData(symbol);
    setStockData(stock);
    setHistoricalData(histData);
    setNews(mockNews.filter(n => !n.relatedStocks || n.relatedStocks.includes(symbol)));
    setTechnicalIndicators(generateTechnicalIndicators(symbol, histData));
    setPatternSignals(generatePatternSignals(histData));
    setMarketReport(generateMarketReport(symbol));
  }, []);

  const searchStocks = useCallback((query: string): StockData[] => {
    return Object.values(allAssets).filter(
      stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  const addToWatchlist = useCallback((symbol: string) => {
    const stock = allAssets[symbol];
    if (stock && !watchlist.find(w => w.symbol === symbol)) {
      setWatchlist(prev => [...prev, {
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        assetType: stock.assetType,
      }]);
    }
  }, [watchlist]);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => prev.filter(w => w.symbol !== symbol));
  }, []);

  const toggleIndicator = useCallback((indicatorName: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicatorName) 
        ? prev.filter(i => i !== indicatorName)
        : [...prev, indicatorName]
    );
  }, []);

  useEffect(() => {
    fetchStockData(selectedSymbol);
    setWatchlist([
      { symbol: 'AAPL', name: 'Apple Inc.', price: 178.35, change: 2.45, changePercent: 1.39, assetType: 'stock' },
      { symbol: 'BTC', name: 'Bitcoin', price: 67542.30, change: 1245.50, changePercent: 1.88, assetType: 'crypto' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44, assetType: 'stock' },
    ]);
  }, [fetchStockData, selectedSymbol]);

  // 24-hour live updates for crypto, 5-min for stocks
  useEffect(() => {
    const isCrypto = stockData?.assetType === 'crypto';
    const interval = setInterval(() => {
      if (stockData) {
        const volatility = isCrypto ? 0.005 : 0.001;
        const priceChange = (Math.random() - 0.5) * stockData.price * volatility;
        setStockData(prev => prev ? {
          ...prev,
          price: Number((prev.price + priceChange).toFixed(isCrypto ? 2 : 2)),
          change: Number((prev.change + priceChange).toFixed(2)),
        } : null);
      }
    }, isCrypto ? 2000 : 5000);
    
    return () => clearInterval(interval);
  }, [stockData]);

  return {
    selectedSymbol,
    setSelectedSymbol,
    stockData,
    historicalData,
    news,
    technicalIndicators,
    patternSignals,
    marketReport,
    watchlist,
    activeIndicators,
    fetchStockData,
    searchStocks,
    addToWatchlist,
    removeFromWatchlist,
    toggleIndicator,
  };
}
