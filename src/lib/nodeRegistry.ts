import type { PortDefinition } from "./portTypes";

export interface NodeCategory {
  id: string;
  label: string;
}

export interface NodeDefinitionMeta {
  type: string;
  label: string;
  category: string;
  description: string;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  defaultConfig: Record<string, unknown>;
}

export const NODE_CATEGORIES: NodeCategory[] = [
  { id: "input", label: "Input" },
  { id: "transform", label: "Transform" },
  { id: "output", label: "Output" },
  { id: "control", label: "Control" },
  { id: "ai", label: "AI" },
  { id: "code", label: "Code" },
];

export const NODE_DEFINITIONS: NodeDefinitionMeta[] = [
  {
    type: "textInput",
    label: "Text Input",
    category: "input",
    description: "Output a static text value",
    inputs: [],
    outputs: [{ id: "value", label: "Value", type: "string", required: false }],
    defaultConfig: { value: "" },
  },
  {
    type: "numberInput",
    label: "Number Input",
    category: "input",
    description: "Output a static number value",
    inputs: [],
    outputs: [{ id: "value", label: "Value", type: "number", required: false }],
    defaultConfig: { value: 0 },
  },
  {
    type: "debug",
    label: "Debug",
    category: "output",
    description: "Display incoming data for inspection",
    inputs: [{ id: "input", label: "Input", type: "any", required: true }],
    outputs: [],
    defaultConfig: {},
  },
  {
    type: "textTemplate",
    label: "Text Template",
    category: "transform",
    description: "Interpolate variables into a template string",
    inputs: [
      { id: "template", label: "Template", type: "string", required: true },
      { id: "variables", label: "Variables", type: "object", required: false },
    ],
    outputs: [{ id: "result", label: "Result", type: "string", required: false }],
    defaultConfig: { template: "Hello, {{name}}!" },
  },
  {
    type: "fileRead",
    label: "File Read",
    category: "input",
    description: "Read contents from a file",
    inputs: [{ id: "path", label: "Path", type: "string", required: false }],
    outputs: [
      { id: "content", label: "Content", type: "string", required: false },
      { id: "file", label: "File", type: "file", required: false },
    ],
    defaultConfig: { path: "" },
  },
  {
    type: "fileWrite",
    label: "File Write",
    category: "output",
    description: "Write content to a file",
    inputs: [
      { id: "path", label: "Path", type: "string", required: true },
      { id: "content", label: "Content", type: "string", required: true },
    ],
    outputs: [{ id: "file", label: "File", type: "file", required: false }],
    defaultConfig: { path: "", append: false },
  },
  {
    type: "httpRequest",
    label: "HTTP Request",
    category: "input",
    description: "Make an HTTP request",
    inputs: [
      { id: "url", label: "URL", type: "string", required: false },
      { id: "body", label: "Body", type: "string", required: false },
    ],
    outputs: [
      { id: "response", label: "Response", type: "string", required: false },
      { id: "status", label: "Status", type: "number", required: false },
    ],
    defaultConfig: { url: "", method: "GET", headers: "{}" },
  },
  {
    type: "jsonParse",
    label: "JSON Parse",
    category: "transform",
    description: "Parse a JSON string into an object",
    inputs: [{ id: "input", label: "Input", type: "string", required: true }],
    outputs: [{ id: "output", label: "Output", type: "object", required: false }],
    defaultConfig: {},
  },
  {
    type: "regex",
    label: "Regex",
    category: "transform",
    description: "Match or replace using regular expressions",
    inputs: [{ id: "input", label: "Input", type: "string", required: true }],
    outputs: [
      { id: "matches", label: "Matches", type: "array", required: false },
      { id: "result", label: "Result", type: "string", required: false },
    ],
    defaultConfig: { pattern: "", flags: "g", mode: "match" },
  },
  {
    type: "filter",
    label: "Filter",
    category: "transform",
    description: "Filter array elements by condition",
    inputs: [{ id: "input", label: "Input", type: "array", required: true }],
    outputs: [{ id: "output", label: "Output", type: "array", required: false }],
    defaultConfig: { condition: "item !== null", field: "" },
  },
  {
    type: "map",
    label: "Map",
    category: "transform",
    description: "Transform each element in an array",
    inputs: [{ id: "input", label: "Input", type: "array", required: true }],
    outputs: [{ id: "output", label: "Output", type: "array", required: false }],
    defaultConfig: { expression: "item" },
  },
  {
    type: "merge",
    label: "Merge",
    category: "transform",
    description: "Merge multiple inputs into one output",
    inputs: [
      { id: "a", label: "A", type: "any", required: true },
      { id: "b", label: "B", type: "any", required: true },
    ],
    outputs: [{ id: "output", label: "Output", type: "array", required: false }],
    defaultConfig: {},
  },
  {
    type: "split",
    label: "Split",
    category: "transform",
    description: "Split a string or array into parts",
    inputs: [{ id: "input", label: "Input", type: "string", required: true }],
    outputs: [{ id: "output", label: "Output", type: "array", required: false }],
    defaultConfig: { delimiter: "," },
  },
  {
    type: "conditional",
    label: "Conditional",
    category: "control",
    description: "Route data based on a condition",
    inputs: [
      { id: "input", label: "Input", type: "any", required: true },
      { id: "condition", label: "Condition", type: "boolean", required: false },
    ],
    outputs: [
      { id: "true", label: "True", type: "any", required: false },
      { id: "false", label: "False", type: "any", required: false },
    ],
    defaultConfig: { expression: "input !== null" },
  },
  {
    type: "llmPrompt",
    label: "LLM Prompt",
    category: "ai",
    description: "Generate text using a local LLM via Ollama",
    inputs: [{ id: "prompt", label: "Prompt", type: "string", required: true }],
    outputs: [{ id: "response", label: "Response", type: "string", required: false }],
    defaultConfig: { model: "llama3.2", temperature: 0.7, systemPrompt: "" },
  },
  {
    type: "llmChat",
    label: "LLM Chat",
    category: "ai",
    description: "Multi-turn chat with a local LLM",
    inputs: [
      { id: "message", label: "Message", type: "string", required: true },
      { id: "history", label: "History", type: "array", required: false },
    ],
    outputs: [
      { id: "response", label: "Response", type: "string", required: false },
      { id: "history", label: "History", type: "array", required: false },
    ],
    defaultConfig: { model: "llama3.2", temperature: 0.7, systemPrompt: "" },
  },
  {
    type: "code",
    label: "Code",
    category: "code",
    description: "Run custom JavaScript code",
    inputs: [{ id: "input", label: "Input", type: "any", required: false }],
    outputs: [{ id: "output", label: "Output", type: "any", required: false }],
    defaultConfig: { code: "return input;" },
  },
];

export function getNodeDefinition(type: string): NodeDefinitionMeta | undefined {
  return NODE_DEFINITIONS.find((d) => d.type === type);
}

export function getNodesByCategory(category: string): NodeDefinitionMeta[] {
  return NODE_DEFINITIONS.filter((d) => d.category === category);
}
