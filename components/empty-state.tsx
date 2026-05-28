import { Globe } from "@phosphor-icons/react";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[6px] border border-dashed border-border bg-surface p-12 text-center">
      <Globe size={32} className="text-zinc-600" weight="regular" />
      <h4 className="mt-3 text-sm font-medium text-zinc-300">{title}</h4>
      <p className="mt-1 text-xs text-zinc-500">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-[6px] border border-border bg-bg px-4 py-2 text-xs text-zinc-400 transition-colors hover:border-border-strong hover:text-zinc-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
