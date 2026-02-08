use async_trait::async_trait;
use std::collections::HashMap;

use crate::engine::context::ExecutionContext;
use crate::error::AppError;
use crate::nodes::NodeExecutor;
use crate::types::NodeValue;

pub struct DebugExecutor;

#[async_trait]
impl NodeExecutor for DebugExecutor {
    fn node_type(&self) -> &'static str {
        "debug"
    }

    async fn execute(
        &self,
        inputs: HashMap<String, NodeValue>,
        _config: serde_json::Value,
        _ctx: &ExecutionContext,
    ) -> Result<HashMap<String, NodeValue>, AppError> {
        // Debug node just passes through its input for display
        let input = inputs.get("input").cloned().unwrap_or(NodeValue::Null);
        let mut outputs = HashMap::new();
        outputs.insert("_debug_value".to_string(), input);
        Ok(outputs)
    }
}
