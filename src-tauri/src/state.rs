use std::sync::Arc;
use tokio::sync::Mutex;

use crate::db::Database;
use crate::engine::Engine;
use crate::error::AppError;

pub struct AppState {
    pub engine: Arc<Mutex<Engine>>,
    pub db: Arc<Database>,
}

impl AppState {
    pub fn new(db_path: std::path::PathBuf) -> Result<Self, AppError> {
        let db = Database::open(&db_path)?;
        Ok(Self {
            engine: Arc::new(Mutex::new(Engine::new())),
            db: Arc::new(db),
        })
    }
}
