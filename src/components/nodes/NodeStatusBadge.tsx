import { Loader2, CheckCircle2, XCircle, Circle } from "lucide-react";

export type NodeStatus = "idle" | "running" | "success" | "error";

interface NodeStatusBadgeProps {
  status: NodeStatus;
}

const STATUS_CONFIG: Record<
  NodeStatus,
  { icon: typeof Circle; color: string; animate?: boolean }
> = {
  idle: { icon: Circle, color: "text-text-secondary" },
  running: { icon: Loader2, color: "text-blue-400", animate: true },
  success: { icon: CheckCircle2, color: "text-green-400" },
  error: { icon: XCircle, color: "text-red-400" },
};

export function NodeStatusBadge({ status }: NodeStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Icon
      size={12}
      className={`${config.color} ${config.animate ? "animate-spin" : ""}`}
    />
  );
}
