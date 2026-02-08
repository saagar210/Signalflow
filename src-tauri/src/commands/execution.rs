use tauri::ipc::Channel;
use tauri::State;

use crate::error::AppError;
use crate::state::AppState;
use crate::types::*;

#[tauri::command]
pub async fn execute_flow(
    state: State<'_, AppState>,
    flow: FlowDocument,
    on_progress: Channel<ExecutionEvent>,
) -> Result<ExecutionResult, AppError> {
    let engine = state.engine.lock().await;
    let result = engine.execute(&flow, &on_progress).await?;

    // Save execution history — log failures but don't block the response
    if let Some(ref flow_id) = flow.id {
        if let Err(e) = state.db.save_execution(flow_id, &result) {
            eprintln!("Failed to save execution history: {}", e);
        }
    }

    Ok(result)
}

#[tauri::command]
pub async fn stop_execution(state: State<'_, AppState>) -> Result<(), AppError> {
    let engine = state.engine.lock().await;
    engine.cancel();
    Ok(())
}
