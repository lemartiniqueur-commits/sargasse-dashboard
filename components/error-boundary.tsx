"use client";

import { Component, type ReactNode } from "react";
import { WarningCircle } from "@phosphor-icons/react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-start gap-3 rounded-[6px] border border-critical/30 bg-critical-muted/30 p-4">
          <WarningCircle
            size={20}
Add components/error-boundary.tsx            className="mt-0.5 shrink-0 text-critical"
          />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-critical">
              Erreur de chargement
            </div>
            <p className="mt-1 text-[13px] text-zinc-300">
              {this.props.fallbackLabel || "Une erreur est survenue lors du chargement des données."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 font-mono text-xs text-accent hover:text-accent/80"
            >
              Réessayer →
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
