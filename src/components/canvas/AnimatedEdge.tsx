import { memo } from "react";
import { type EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { useExecutionStore } from "../../stores/executionStore";

export const AnimatedEdge = memo(function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  source,
  target,
}: EdgeProps) {
  const sourceStatus = useExecutionStore(
    (s) => s.nodeStatuses[source] ?? "idle"
  );
  const targetStatus = useExecutionStore(
    (s) => s.nodeStatuses[target] ?? "idle"
  );

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Determine edge color based on execution state
  const isActive =
    sourceStatus === "success" && targetStatus === "running";
  const isComplete =
    sourceStatus === "success" && targetStatus === "success";
  const isError =
    sourceStatus === "error" || targetStatus === "error";

  let strokeColor = "#2a2b35"; // default
  if (selected) strokeColor = "#6366f1";
  if (isActive) strokeColor = "#3b82f6";
  if (isComplete) strokeColor = "#22c55e";
  if (isError) strokeColor = "#ef4444";

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={2}
        stroke={strokeColor}
        fill="none"
      />
      {isActive && (
        <circle r={3} fill="#3b82f6">
          <animateMotion dur="1s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  );
});
