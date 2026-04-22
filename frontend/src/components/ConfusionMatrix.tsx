import type { ModelResult } from "../types";
import { MODEL_COLOR } from "../utils";

interface Props {
  models: ModelResult[];
}

function SingleMatrix({ model }: { model: ModelResult }) {
  const { matrix, labels_order } = model.confusion_matrix;
  const maxVal = Math.max(...matrix.flat());
  const total = matrix.flat().reduce((a, b) => a + b, 0);
  const color = MODEL_COLOR(model.id);

  return (
    <div className="cm-panel">
      <h3 className="cm-model-title" style={{ color }}>
        {model.name}
      </h3>
      <p className="cm-accuracy">
        Accuracy{" "}
        <span className="mono" style={{ color }}>
          {model.metrics.accuracy.toFixed(4)}
        </span>
      </p>

      <div className="cm-grid-wrapper">
        {/* Column headers */}
        <div className="cm-col-labels">
          <span className="cm-axis-label cm-axis-label--pred">Predicted →</span>
          {labels_order.map((cn) => (
            <span key={cn} className="cm-header-cell mono">
              {cn}
            </span>
          ))}
        </div>

        {/* Rows */}
        {matrix.map((row, ri) => (
          <div key={ri} className="cm-row">
            <span className="cm-row-label mono">{labels_order[ri]}</span>
            {row.map((val, ci) => {
              const isDiag = ri === ci;
              const intensity = maxVal > 0 ? val / maxVal : 0;
              const bg = isDiag
                ? `rgba(${hexToRgb(color)}, ${0.15 + intensity * 0.65})`
                : `rgba(255,255,255, ${intensity * 0.12})`;
              return (
                <div
                  key={ci}
                  className="cm-cell"
                  style={{ background: bg }}
                  title={`True: ${labels_order[ri]} → Pred: ${labels_order[ci]}\nCount: ${val} (${((val / total) * 100).toFixed(1)}%)`}
                >
                  <span className="cm-count mono">{val}</span>
                  <span className="cm-pct">{((val / total) * 100).toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        ))}

        <div className="cm-true-label">
          <span className="cm-axis-label cm-axis-label--true">↑ True</span>
        </div>
      </div>

      <div className="cm-stats">
        <span>
          Misclassified:{" "}
          <span className="mono">
            {model.predictions.filter((p) => !p.correct).length}/
            {model.predictions.length}
          </span>
        </span>
        <span>
          Log Loss: <span className="mono">{model.metrics.log_loss.toFixed(4)}</span>
        </span>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

export function ConfusionMatrix({ models }: Props) {
  return (
    <div className="card">
      <h2 className="card-title">Confusion Matrices</h2>
      <p className="card-sub">Rows = true class · Columns = predicted class · Diagonal = correct predictions</p>
      <div className="cm-container">
        {models.map((m) => (
          <SingleMatrix key={m.id} model={m} />
        ))}
      </div>
    </div>
  );
}
