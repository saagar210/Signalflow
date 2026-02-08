use tauri::State;

use crate::error::AppError;
use crate::state::AppState;

#[tauri::command]
pub async fn get_preference(
    state: State<'_, AppState>,
    key: String,
) -> Result<Option<String>, AppError> {
    state.db.get_setting(&key)
}

#[tauri::command]
pub async fn set_preference(
    state: State<'_, AppState>,
    key: String,
    value: String,
) -> Result<(), AppError> {
    state.db.set_setting(&key, &value)
}
