use async_trait::async_trait;
use std::collections::HashMap;

use crate::engine::context::ExecutionContext;
use crate::error::AppError;
use crate::nodes::NodeExecutor;
use crate::types::NodeValue;

pub struct MergeExecutor;

#[async_trait]
impl NodeExecutor for MergeExecutor {
    fn node_type(&self) -> &'static str {
        "merge"
    }

    async fn execute(
        &self,
        inputs: HashMap<String, NodeValue>,
        _config: serde_json::Value,
        _ctx: &ExecutionContext,
    ) -> Result<HashMap<String, NodeValue>, AppError> {
        let a = inputs.get("a").cloned().unwrap_or(NodeValue::Null);
        let b = inputs.get("b").cloned().unwrap_or(NodeValue::Null);

        let merged = match (a, b) {
            (NodeValue::Array(mut a_arr), NodeValue::Array(b_arr)) => {
                a_arr.extend(b_arr);
                NodeValue::Array(a_arr)
            }
            (a_val, b_val) => NodeValue::Array(vec![a_val, b_val]),
        };

        let mut outputs = HashMap::new();
        outputs.insert("output".to_string(), merged);
        Ok(outputs)
    }
}
