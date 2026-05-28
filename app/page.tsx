import dynamic from "next/dynamic";
import { SidebarNav } from "@/components/sidebar-nav";
import { MetricsHeader } from "@/components/metrics-header";
import { DistributionMap } from "@/components/distribution-map";
import { NoaaDataTable } from "@/components/noaa-data-table";
import { AlertsPanel } from "@/components/alerts-panel";
import { CommuneStatus } from "@/components/commune-status";
import { ErrorBoundary } from "@/components/error-boundary";

// recharts uses React.createContext — must be loaded client-side only
const TimeSeriesChart = dynamic(
  () => import("@/components/time-series-chart").then((m) => m.TimeSeriesChart),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-[6px] border border-border bg-surface p-5 h-[340px] animate-pulse" />
    ),
  }
);

export default function DashboardPage() {
  return (
    <div className="grid min-h-screen grid-cols-12 bg-bg">
      {/* Sidebar navigation — col-span-2 */}
      <aside className="col-span-2 hidden lg:block">
        <SidebarNav />
      </aside>

      {/* Main content — col-span-7 */}
      <main className="col-span-12 overflow-y-auto lg:col-span-7">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
          {/* Header bar */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-medium text-zinc-50">
                  Monitoring sargasses
                </h1>
                <span className="rounded-[4px] bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                  Martinique
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-zinc-500">
                14.64°N 61.02°W · Côte atlantique · Saison 2026
              </p>
            </div>
          </div>

          {/* Metrics section */}
          <section className="mb-8">
            <ErrorBoundary fallbackLabel="Impossible de charger les métriques en temps réel.">
              <MetricsHeader />
            </ErrorBoundary>
          </section>

          {/* Map + Time series */}
          <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ErrorBoundary fallbackLabel="Carte indisponible.">
              <DistributionMap />
            </ErrorBoundary>
            <ErrorBoundary fallbackLabel="Graphique indisponible.">
              <TimeSeriesChart />
            </ErrorBoundary>
          </section>

          {/* Commune status */}
          <section className="mb-8">
            <ErrorBoundary fallbackLabel="Données communes indisponibles.">
              <CommuneStatus />
            </ErrorBoundary>
          </section>

          {/* NOAA data table */}
          <section className="mb-8">
            <ErrorBoundary fallbackLabel="Table NOAA indisponible.">
              <NoaaDataTable />
            </ErrorBoundary>
          </section>

          {/* Footer note */}
          <p className="font-mono text-[10px] text-zinc-600 pb-8">
            Données affichées: mock (simulation) · Sources réelles: NOAA USF Optical Marine Imagery, Open-Meteo Marine API, CMEMS HYCOM
          </p>
        </div>
      </main>

      {/* Alerts panel — col-span-3 */}
      <aside className="col-span-3 hidden lg:block border-l border-border">
        <div className="p-4 h-full">
          <ErrorBoundary fallbackLabel="Alertes indisponibles.">
            <AlertsPanel />
          </ErrorBoundary>
        </div>
      </aside>
    </div>
  );
}
