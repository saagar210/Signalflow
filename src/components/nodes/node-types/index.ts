import type { NodeTypes } from "@xyflow/react";
import { TextInputNode } from "./TextInputNode";
import { NumberInputNode } from "./NumberInputNode";
import { DebugNode } from "./DebugNode";
import { TextTemplateNode } from "./TextTemplateNode";
import { GenericNode } from "./GenericNode";

export const nodeTypes: NodeTypes = {
  textInput: TextInputNode,
  numberInput: NumberInputNode,
  debug: DebugNode,
  textTemplate: TextTemplateNode,
  // All other types use GenericNode until Phase 5+ adds custom UIs
  fileRead: GenericNode,
  fileWrite: GenericNode,
  httpRequest: GenericNode,
  jsonParse: GenericNode,
  regex: GenericNode,
  filter: GenericNode,
  map: GenericNode,
  merge: GenericNode,
  split: GenericNode,
  conditional: GenericNode,
  llmPrompt: GenericNode,
  llmChat: GenericNode,
  code: GenericNode,
};
