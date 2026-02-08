use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tokio::sync::RwLock;

use crate::types::NodeValue;

pub struct ExecutionContext {
    pub node_outputs: Arc<RwLock<HashMap<String, HashMap<String, NodeValue>>>>,
    pub cancelled: Arc<AtomicBool>,
}

impl ExecutionContext {
    pub fn new() -> Self {
        Self {
            node_outputs: Arc::new(RwLock::new(HashMap::new())),
            cancelled: Arc::new(AtomicBool::new(false)),
        }
    }

    pub fn is_cancelled(&self) -> bool {
        self.cancelled.load(Ordering::Relaxed)
    }

    pub fn cancel(&self) {
        self.cancelled.store(true, Ordering::Relaxed);
    }

    pub async fn store_output(&self, node_id: &str, outputs: HashMap<String, NodeValue>) {
        let mut lock = self.node_outputs.write().await;
        lock.insert(node_id.to_string(), outputs);
    }

    pub async fn get_input(
        &self,
        source_node_id: &str,
        source_handle: &str,
    ) -> NodeValue {
        let lock = self.node_outputs.read().await;
        lock.get(source_node_id)
            .and_then(|outputs| outputs.get(source_handle))
            .cloned()
            .unwrap_or(NodeValue::Null)
    }
}
