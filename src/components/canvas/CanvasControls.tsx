import { Controls, MiniMap } from "@xyflow/react";

export function CanvasControls() {
  return (
    <>
      <Controls
        showInteractive={false}
        position="bottom-right"
      />
      <MiniMap
        position="bottom-left"
        pannable
        zoomable
        nodeColor="#6366f1"
        maskColor="rgba(15, 17, 23, 0.7)"
      />
    </>
  );
}
