use crate::error::AppError;
use crate::types::NodeDefinition;

#[tauri::command]
pub async fn get_node_definitions() -> Result<Vec<NodeDefinition>, AppError> {
    Ok(vec![
        NodeDefinition { node_type: "textInput".into(), label: "Text Input".into(), category: "input".into(), description: "Output a static text value".into() },
        NodeDefinition { node_type: "numberInput".into(), label: "Number Input".into(), category: "input".into(), description: "Output a static number value".into() },
        NodeDefinition { node_type: "fileRead".into(), label: "File Read".into(), category: "input".into(), description: "Read contents from a file".into() },
        NodeDefinition { node_type: "httpRequest".into(), label: "HTTP Request".into(), category: "input".into(), description: "Make an HTTP request".into() },
        NodeDefinition { node_type: "textTemplate".into(), label: "Text Template".into(), category: "transform".into(), description: "Interpolate variables into a template string".into() },
        NodeDefinition { node_type: "jsonParse".into(), label: "JSON Parse".into(), category: "transform".into(), description: "Parse a JSON string into an object".into() },
        NodeDefinition { node_type: "regex".into(), label: "Regex".into(), category: "transform".into(), description: "Match or replace using regular expressions".into() },
        NodeDefinition { node_type: "filter".into(), label: "Filter".into(), category: "transform".into(), description: "Filter array elements by condition".into() },
        NodeDefinition { node_type: "map".into(), label: "Map".into(), category: "transform".into(), description: "Transform each element in an array".into() },
        NodeDefinition { node_type: "merge".into(), label: "Merge".into(), category: "transform".into(), description: "Merge multiple inputs into one output".into() },
        NodeDefinition { node_type: "split".into(), label: "Split".into(), category: "transform".into(), description: "Split a string or array into parts".into() },
        NodeDefinition { node_type: "debug".into(), label: "Debug".into(), category: "output".into(), description: "Display incoming data for inspection".into() },
        NodeDefinition { node_type: "fileWrite".into(), label: "File Write".into(), category: "output".into(), description: "Write content to a file".into() },
        NodeDefinition { node_type: "conditional".into(), label: "Conditional".into(), category: "control".into(), description: "Route data based on a condition".into() },
    ])
}
