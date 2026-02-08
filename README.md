# SignalFlow

**Wire nodes. Build pipelines. Run locally.**

SignalFlow is a visual dataflow programming app for your desktop. Think Unreal Blueprints meets ComfyUI — drag nodes onto a canvas, connect them with wires, hit Run, and watch your data flow through the pipeline in real time.

Built with Tauri 2, React 19, and Rust. Everything runs on your machine. No cloud. No accounts. No telemetry.

---

## What Can You Do With It?

- Read files, parse JSON, filter arrays, merge data, write results
- Make HTTP requests and chain API calls together
- Run regex transforms, text templates, conditional routing
- Talk to local LLMs via Ollama — prompt nodes, chat nodes, the works
- Watch execution animate through your graph in real time
- Undo/redo everything, auto-save to SQLite, dark/light themes

## The Stack

| Layer | Tech |
|-------|------|
| Desktop Shell | **Tauri 2** |
| Frontend | **React 19** + TypeScript strict + Vite |
| Node Graph | **@xyflow/react** (ReactFlow 12) |
| Styling | **Tailwind CSS 4** |
| State | **Zustand 5** + zundo (undo/redo) |
| Backend | **Rust** + tokio async runtime |
| Graph Engine | **petgraph** (toposort, cycle detection) |
| Database | **rusqlite** (WAL mode, bundled SQLite) |
| LLM | **Ollama** (local models, streaming) |
| Command Palette | **cmdk** |

## Node Library

**16 node types** across 6 categories:

| Category | Nodes |
|----------|-------|
| Input | Text Input, Number Input, File Read, HTTP Request |
| Transform | JSON Parse, Text Template, Regex, Filter, Map, Merge, Split |
| Output | File Write, Debug |
| Control | Conditional (if/else branching) |
| AI | LLM Prompt, LLM Chat |

Every node has typed ports (String, Number, Boolean, Array, Object, File, Any) with color-coded handles and connection validation.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 9+
- [Rust](https://www.rust-lang.org/tools/install) stable
- [Tauri 2 prerequisites](https://v2.tauri.app/start/prerequisites/) for your OS

### Run in Dev Mode

```bash
pnpm install
cargo tauri dev
```

### Build for Production

```bash
cargo tauri build
```

The `.dmg` (macOS) or installer lands in `src-tauri/target/release/bundle/`.

### Run Tests

```bash
pnpm test          # Frontend (Vitest, 16 tests)
cd src-tauri && cargo test  # Backend (12 tests)
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Command palette |
| `Cmd+Enter` | Run flow |
| `Cmd+S` | Save |
| `Cmd+Z` / `Cmd+Shift+Z` | Undo / Redo |
| `Cmd+C` / `Cmd+V` | Copy / Paste nodes |
| `Cmd+D` | Duplicate selected |
| `Cmd+A` | Select all |
| `Backspace` | Delete selected |

## Project Structure

```
src/                    # React frontend
  components/           # Canvas, nodes, palette, panels, toolbar
  stores/               # Zustand stores (flow, execution, UI, project)
  hooks/                # useExecution, useSaveFlow, useDragAndDrop
  lib/                  # Node registry, port types, connection validation

src-tauri/src/          # Rust backend
  engine/               # Graph builder, layer executor, execution context
  nodes/                # 16 node executors (input, transform, output, control, AI)
  db/                   # SQLite persistence (flows, executions, settings)
  ollama/               # Ollama HTTP client
  commands/             # Tauri IPC command handlers
```

## How Execution Works

1. Frontend serializes the graph into a `FlowDocument`
2. Rust builds a `petgraph::DiGraph`, runs toposort, detects cycles
3. Nodes are grouped into layers by dependency depth
4. Each layer executes sequentially; independent nodes within a layer could run in parallel
5. Progress events stream back to the frontend via Tauri Channels
6. Nodes light up (blue = running, green = done, red = error) and edges animate

Cancellation is instant — an `AtomicBool` flag is checked between each layer.

## License

MIT
