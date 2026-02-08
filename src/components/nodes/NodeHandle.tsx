import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { PORT_COLORS, type PortDefinition } from "../../lib/portTypes";

interface NodeHandleProps {
  port: PortDefinition;
  type: "source" | "target";
  position: Position;
}

export const NodeHandle = memo(function NodeHandle({ port, type, position }: NodeHandleProps) {
  const color = PORT_COLORS[port.type];
  const isLeft = position === Position.Left;

  return (
    <div
      className="relative flex items-center gap-1.5 py-0.5"
      style={{ flexDirection: isLeft ? "row" : "row-reverse" }}
    >
      <Handle
        type={type}
        position={position}
        id={port.id}
        className="!relative !top-0 !transform-none"
        style={{
          width: 10,
          height: 10,
          background: port.required ? color : "transparent",
          border: `2px solid ${color}`,
          borderRadius: "50%",
        }}
      />
      <span className="text-[10px] text-text-secondary">{port.label}</span>
    </div>
  );
});
