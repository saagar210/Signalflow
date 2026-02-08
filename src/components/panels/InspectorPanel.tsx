import { useUiStore } from "../../stores/uiStore";
import { useFlowStore } from "../../stores/flowStore";
import { useExecutionStore } from "../../stores/executionStore";
import { getNodeDefinition, type ConfigFieldSchema } from "../../lib/nodeRegistry";
import { DataInspector } from "./DataInspector";
import { TextField } from "./config-fields/TextField";
import { TextareaField } from "./config-fields/TextareaField";
import { NumberField } from "./config-fields/NumberField";
import { CheckboxField } from "./config-fields/CheckboxField";
import { SelectField } from "./config-fields/SelectField";
import { SliderField } from "./config-fields/SliderField";
import { FilePathField } from "./config-fields/FilePathField";
import { ModelSelectField } from "./config-fields/ModelSelectField";
import { KeyValueField } from "./config-fields/KeyValueField";

function ConfigFieldRenderer({
  field,
  value,
  onChange,
}: {
  field: ConfigFieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (field.widget) {
    case "text":
      return (
        <TextField
          label={field.label}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={onChange}
        />
      );
    case "textarea":
      return (
        <TextareaField
          label={field.label}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          rows={field.rows}
          monospace={field.monospace}
          onChange={onChange}
        />
      );
    case "number":
      return (
        <NumberField
          label={field.label}
          value={Number(value) || 0}
          onChange={onChange}
        />
      );
    case "checkbox":
      return (
        <CheckboxField
          label={field.label}
          checked={Boolean(value)}
          onChange={onChange}
        />
      );
    case "select":
      return (
        <SelectField
          label={field.label}
          value={String(value ?? "")}
          options={field.options ?? []}
          onChange={onChange}
        />
      );
    case "slider":
      return (
        <SliderField
          label={field.label}
          value={Number(value) || 0}
          min={field.min ?? 0}
          max={field.max ?? 1}
          step={field.step ?? 0.1}
          onChange={onChange}
        />
      );
    case "file-path-open":
      return (
        <FilePathField
          label={field.label}
          value={String(value ?? "")}
          mode="open"
          onChange={onChange}
        />
      );
    case "file-path-save":
      return (
        <FilePathField
          label={field.label}
          value={String(value ?? "")}
          mode="save"
          onChange={onChange}
        />
      );
    case "model-select":
      return (
        <ModelSelectField
          label={field.label}
          value={String(value ?? "")}
          onChange={onChange}
        />
      );
    case "key-value":
      return (
        <KeyValueField
          label={field.label}
          value={String(value ?? "{}")}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

function ConfigFields({
  nodeId,
  nodeType,
  data,
}: {
  nodeId: string;
  nodeType: string;
  data: Record<string, unknown>;
}) {
  const updateNodeConfig = useFlowStore((s) => s.updateNodeConfig);
  const definition = getNodeDefinition(nodeType);
  if (!definition) return null;

  const schema = definition.configSchema;

  // If no configSchema, fall back to nothing (no generic fallback)
  if (!schema || schema.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
        Configuration
      </p>
      {schema.map((field) => (
        <ConfigFieldRenderer
          key={field.key}
          field={field}
          value={data[field.key] ?? definition.defaultConfig[field.key]}
          onChange={(val) => updateNodeConfig(nodeId, { [field.key]: val })}
        />
      ))}
    </div>
  );
}

export function InspectorPanel() {
  const selectedNodeId = useUiStore((s) => s.selectedNodeId);
  const nodes = useFlowStore((s) => s.nodes);
  const nodeOutputs = useExecutionStore((s) => s.nodeOutputs);
  const nodeErrors = useExecutionStore((s) => s.nodeErrors);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId)
    : null;

  if (!selectedNode) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-panel-border px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Inspector
          </span>
        </div>
        <div className="flex-1 p-3">
          <p className="text-xs text-text-secondary">
            Select a node to inspect
          </p>
        </div>
      </div>
    );
  }

  const definition = getNodeDefinition(selectedNode.type ?? "");
  const output = selectedNodeId ? nodeOutputs[selectedNodeId] : undefined;
  const error = selectedNodeId ? nodeErrors[selectedNodeId] : undefined;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-panel-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Inspector
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-3">
          <p className="text-xs font-medium text-text-primary">
            {definition?.label ?? selectedNode.type}
          </p>
          <p className="mt-0.5 text-[10px] text-text-secondary">
            {definition?.description}
          </p>
          <p className="mt-1 text-[10px] text-text-secondary">
            ID: {selectedNode.id}
          </p>
        </div>

        <ConfigFields
          nodeId={selectedNode.id}
          nodeType={selectedNode.type ?? ""}
          data={selectedNode.data as Record<string, unknown>}
        />

        {output != null ? <DataInspector data={output} /> : null}

        {error != null ? (
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
              Error
            </p>
            <pre className="mt-1 rounded border border-red-400/30 bg-red-400/10 p-2 text-[10px] text-red-400">
              {error}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
