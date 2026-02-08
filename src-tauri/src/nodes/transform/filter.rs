use async_trait::async_trait;
use std::collections::HashMap;

use crate::engine::context::ExecutionContext;
use crate::error::AppError;
use crate::nodes::NodeExecutor;
use crate::types::NodeValue;

pub struct FilterExecutor;

#[async_trait]
impl NodeExecutor for FilterExecutor {
    fn node_type(&self) -> &'static str {
        "filter"
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
                    message: "Filter expects an array input".to_string(),
                });
            }
        };

        let field = config
            .get("field")
            .and_then(|v| v.as_str())
            .unwrap_or("");

        // Simple filtering: remove nulls, or filter by field existence
        let filtered: Vec<NodeValue> = if field.is_empty() {
            input
                .into_iter()
                .filter(|v| !matches!(v, NodeValue::Null))
                .collect()
        } else {
            input
                .into_iter()
                .filter(|v| {
                    if let NodeValue::Object(obj) = v {
                        obj.contains_key(field)
                    } else {
                        false
                    }
                })
                .collect()
        };

        let mut outputs = HashMap::new();
        outputs.insert("output".to_string(), NodeValue::Array(filtered));
        Ok(outputs)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_filter_removes_nulls() {
        let executor = FilterExecutor;
        let mut inputs = HashMap::new();
        inputs.insert(
            "input".to_string(),
            NodeValue::Array(vec![
                NodeValue::String("a".into()),
                NodeValue::Null,
                NodeValue::String("b".into()),
            ]),
        );
        let ctx = ExecutionContext::new();
        let result = executor
            .execute(inputs, serde_json::json!({}), &ctx)
            .await
            .unwrap();
        if let NodeValue::Array(arr) = result.get("output").unwrap() {
            assert_eq!(arr.len(), 2);
        } else {
            panic!("Expected array output");
        }
    }
}
