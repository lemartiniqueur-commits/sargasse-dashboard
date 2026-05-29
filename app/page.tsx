import { SidebarNav } from "@/components/sidebar-nav";
import { MetricsHeader } from "@/components/metrics-header";
import { DistributionMap } from "@/components/distribution-map";
import { NoaaDataTable } from "@/components/noaa-data-table";
import { AlertsPanel } from "@/components/alerts-panel";
import { CommuneStatus } from "@/components/commune-status";
import { ErrorBoundary } from "@/components/error-boundary";
import { TimeSeriesChart } from "@/components/time-series-chart-client";
import { RealtimeIndicator } from "@/components/realtime-indicator";

export default function DashboardPage() {
  return (
    <div className="grid min-h-screen grid-cols-12 bg-background font-mono">
      {/* Sidebar — col-span-2 */}
      <aside className="col-span-2 border-r border-border">
        <SidebarNav />
      </aside>

      {/* Main content — col-span-7 */}
      <main className="col-span-7 overflow-y-auto p-6 space-y-6">
        {/* Realtime Indicator - En haut du dashboard */}
        <section>
          <RealtimeIndicator />
        </section>

        {/* Metrics header */}
        <section>
          <ErrorBoundary fallbackLabel="Metriques indisponibles.">
            <MetricsHeader />
          </ErrorBoundary>
        </section>

        {/* Time series chart */}
        <section>
          <ErrorBoundary fallbackLabel="Graphique indisponible.">
            <TimeSeriesChart />
          </ErrorBoundary>
        </section>

        {/* Distribution map */}
        <section>
          <ErrorBoundary fallbackLabel="Carte indisponible.">
            <DistributionMap />
          </ErrorBoundary>
        </section>

        {/* Commune status */}
        <section>
          <ErrorBoundary fallbackLabel="Statut communes indisponible.">
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
          Données affichées: mock (simulation) · Sources réelles: NOAA USF Optical Marine Imagery, OpenMeteo, DEAL Martinique
        </p>
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
