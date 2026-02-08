import { Background, BackgroundVariant } from "@xyflow/react";

export function FlowBackground() {
  return (
    <Background
      variant={BackgroundVariant.Dots}
      gap={20}
      size={1}
      color="#2a2b35"
    />
  );
}
