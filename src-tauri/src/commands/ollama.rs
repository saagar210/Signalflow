use crate::error::AppError;
use crate::ollama::{ModelInfo, OllamaClient, OllamaStatus};

#[tauri::command]
pub async fn check_ollama() -> Result<OllamaStatus, AppError> {
    let client = OllamaClient::try_default()?;
    Ok(client.check_health().await)
}

#[tauri::command]
pub async fn list_models() -> Result<Vec<ModelInfo>, AppError> {
    let client = OllamaClient::try_default()?;
    client.list_models().await
}
