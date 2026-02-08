pub mod registry;
pub mod input;
pub mod transform;
pub mod output;
pub mod control;
pub mod ai;

use async_trait::async_trait;
use std::collections::HashMap;

use crate::engine::context::ExecutionContext;
use crate::error::AppError;
use crate::types::NodeValue;

#[async_trait]
pub trait NodeExecutor: Send + Sync {
    fn node_type(&self) -> &'static str;

    async fn execute(
        &self,
        inputs: HashMap<String, NodeValue>,
        config: serde_json::Value,
        ctx: &ExecutionContext,
    ) -> Result<HashMap<String, NodeValue>, AppError>;
}
