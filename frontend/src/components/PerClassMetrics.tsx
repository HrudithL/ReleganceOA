import type { ModelResult } from "../types";
import { MODEL_COLOR } from "../utils";

interface Props {
  models: ModelResult[];
}

const METRICS: Array<{ key: "precision" | "recall" | "f1_score"; label: string }> = [
  { key: "precision", label: "Precision" },
  { key: "recall",    label: "Recall"    },
  { key: "f1_score",  label: "F1 Score"  },
];

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="pcm-bar-track">
      <div
        className="pcm-bar-fill"
        style={{ width: `${value * 100}%`, background: color }}
      />
    </div>
  );
}

export function PerClassMetrics({ models }: Props) {
  const classNames = models[0]?.confusion_matrix.labels_order ?? [];

  return (
    <div className="card">
      <h2 className="card-title">Per-Class Metrics</h2>
      <p className="card-sub">Precision · Recall · F1 on the test split by Iris species</p>

      <div className="pcm-table">
        <div className="pcm-header">
          <span>Class</span>
          <span>Metric</span>
          {models.map((m) => (
            <span key={m.id} style={{ color: MODEL_COLOR(m.id) }}>
              {m.name}
            </span>
          ))}
        </div>

        {classNames.map((cn) =>
          METRICS.map((met, mi) => (
            <div key={`${cn}-${met.key}`} className={`pcm-row ${mi === 0 ? "pcm-row--first" : ""}`}>
              <span className="pcm-class-cell mono">{mi === 0 ? cn : ""}</span>
              <span className="pcm-metric-label">{met.label}</span>
              {models.map((m) => {
                const val = m.classification_report[cn]?.[met.key] ?? 0;
                const color = MODEL_COLOR(m.id);
                return (
                  <div key={m.id} className="pcm-value-cell">
                    <span className="mono" style={{ color }}>
                      {val.toFixed(3)}
                    </span>
                    <Bar value={val} color={color} />
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
