use async_trait::async_trait;
use std::collections::HashMap;

use crate::engine::context::ExecutionContext;
use crate::error::AppError;
use crate::nodes::NodeExecutor;
use crate::types::NodeValue;

pub struct MapExecutor;

#[async_trait]
impl NodeExecutor for MapExecutor {
    fn node_type(&self) -> &'static str {
        "map"
    }

    async fn execute(
        &self,
        inputs: HashMap<String, NodeValue>,
        config: serde_json::Value,
        _ctx: &ExecutionContext,
    ) -> Result<HashMap<String, NodeValue>, AppError> {
        let input = match inputs.get("input") {
            Some(NodeValue::Array(arr)) => arr.clone(),
            _ => {
                return Err(AppError::NodeExecution {
                    node_id: String::new(),
                    message: "Map expects an array input".to_string(),
                });
            }
        };

        let expression = config
            .get("expression")
            .and_then(|v| v.as_str())
            .unwrap_or("item");

        // Simple map: if expression is "item", pass through. Otherwise, stringify.
        let mapped: Vec<NodeValue> = if expression == "item" {
            input
        } else {
            input
                .into_iter()
                .map(|v| NodeValue::String(v.coerce_to_string()))
                .collect()
        };

        let mut outputs = HashMap::new();
        outputs.insert("output".to_string(), NodeValue::Array(mapped));
        Ok(outputs)
    }
}
