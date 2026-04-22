export const RF_COLOR = "#22d3ee";   // cyan
export const XGB_COLOR = "#fb923c";  // orange

export function MODEL_COLOR(id: string): string {
  return id === "random_forest" ? RF_COLOR : XGB_COLOR;
}

export function formatMetricName(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace("F1", "F1")
    .replace("Macro", "(Macro)")
    .replace("Weighted", "(Wtd)")
    .replace("Balanced Accuracy", "Bal. Acc");
}
