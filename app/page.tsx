import { SidebarNav } from "@/components/sidebar-nav";
import { MetricsHeader } from "@/components/metrics-header";
import { DistributionMap } from "@/components/distribution-map";
import { TimeSeriesChart } from "@/components/time-series-chart";
import { NoaaDataTable } from "@/components/noaa-data-table";
import { AlertsPanel } from "@/components/alerts-panel";
import { CommuneStatus } from "@/components/commune-status";
import { ErrorBoundary } from "@/components/error-boundary";

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
          <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <ErrorBoundary fallbackLabel="Impossible de charger la carte de distribution.">
                <DistributionMap />
              </ErrorBoundary>
            </div>
            <div className="xl:col-span-2">
              <ErrorBoundary fallbackLabel="Impossible de charger les données temporelles.">
                <TimeSeriesChart />
              </ErrorBoundary>
            </div>
          </section>

          {/* Commune status */}
          <section className="mb-8">
            <ErrorBoundary fallbackLabel="Impossible de charger le statut des communes.">
              <CommuneStatus />
            </ErrorBoundary>
          </section>

          {/* NOAA data table */}
          <section className="mb-8">
            <ErrorBoundary fallbackLabel="Impossible de charger les données NOAA.">
              <NoaaDataTable />
            </ErrorBoundary>
          </section>

          {/* Footer note */}
          <footer className="border-t border-border pt-4">
            <p className="font-mono text-[10px] text-zinc-600">
              Données affichées: mock (simulation) · Sources réelles: NOAA USF
              Optical Marine Imagery, Open-Meteo Marine API, CMEMS HYCOM
            </p>
          </footer>
        </div>
      </main>

      {/* Alerts panel — col-span-3 */}
      <aside className="col-span-12 hidden xl:col-span-3 xl:block">
        <AlertsPanel />
      </aside>
    </div>
  );
}
