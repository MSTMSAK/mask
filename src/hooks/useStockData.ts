import { trpc } from '@/providers/trpc';

export function useMarketOverview() {
  return trpc.market.overview.useQuery();
}

export function useTopStocks(limit = 10) {
  return trpc.screener.topPicks.useQuery({ limit });
}

export function useStockDetail(code: string) {
  return trpc.report.fullAnalysis.useQuery({ code });
}

export function useScreenedStocks(filters: {
  minPe?: number;
  maxPe?: number;
  minChange?: number;
  grade?: string;
  limit?: number;
}) {
  return trpc.screener.filter.useQuery(filters);
}

export function useSearchedStocks(query: string) {
  return trpc.screener.search.useQuery(
    { query },
    { enabled: query.length > 0 }
  );
}

export function useSyncTrigger() {
  return trpc.sync.trigger.useQuery();
}

export function usePdfReport(code: string) {
  return trpc.pdf.generateReport.useQuery(
    { code },
    { enabled: code.length > 0 }
  );
}