export interface Meta {
  dataset: string;
  sklearn_version: string;
  xgboost_version: string;
  random_state: number;
  test_size: number;
  n_samples_total: number;
  n_samples_train: number;
  n_samples_test: number;
  feature_names: string[];
  class_names: string[];
  generated_at: string;
}

export interface ClassStat {
  mean: number;
  std: number;
  min: number;
  max: number;
}

export interface PerClassReport {
  precision: number;
  recall: number;
  f1_score: number;
  support: number;
}

export interface Prediction {
  index: number;
  y_true: number;
  y_true_name: string;
  y_pred: number;
  y_pred_name: string;
  correct: boolean;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface ModelResult {
  id: "random_forest" | "xgboost";
  name: string;
  hyperparameters: Record<string, unknown>;
  metrics: {
    accuracy: number;
    balanced_accuracy: number;
    log_loss: number;
    precision_macro: number;
    recall_macro: number;
    f1_macro: number;
    precision_weighted: number;
    recall_weighted: number;
    f1_weighted: number;
  };
  confusion_matrix: {
    matrix: number[][];
    labels_order: string[];
  };
  classification_report: Record<string, PerClassReport>;
  feature_importance: {
    features: string[];
    importance: number[];
  };
  predictions: Prediction[];
}

export interface ComparisonRow {
  metric: string;
  random_forest: number;
  xgboost: number;
}

export interface Report {
  schema_version: number;
  meta: Meta;
  data: {
    class_summary: Record<string, Record<string, ClassStat>>;
    sample: Array<Record<string, number | string>>;
  };
  models: ModelResult[];
  comparison: ComparisonRow[];
}
