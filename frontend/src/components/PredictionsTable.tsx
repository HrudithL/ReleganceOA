import { useState, useMemo } from "react";
import type { ModelResult } from "../types";
import { MODEL_COLOR } from "../utils";

interface Props {
  models: ModelResult[];
}

type Filter = "all" | "correct" | "incorrect";

export function PredictionsTable({ models }: Props) {
  const [activeModel, setActiveModel] = useState<string>(models[0]?.id ?? "");
  const [filter, setFilter] = useState<Filter>("all");

  if (!models.length) return null;
  const model = models.find((m) => m.id === activeModel) ?? models[0];
  const color = MODEL_COLOR(model.id);

  const rows = useMemo(() => {
    let preds = model.predictions;
    if (filter === "correct") preds = preds.filter((p) => p.correct);
    if (filter === "incorrect") preds = preds.filter((p) => !p.correct);
    return preds;
  }, [model, filter]);

  const classNames = model.confusion_matrix.labels_order;

  const incorrectCount = model.predictions.filter((p) => !p.correct).length;

  return (
    <div className="card">
      <h2 className="card-title">Predictions Explorer</h2>
      <p className="card-sub">Per-sample results on the test split — inspect misclassifications and class probabilities</p>

      <div className="pt-controls">
        <div className="pt-model-tabs">
          {models.map((m) => (
            <button
              key={m.id}
              className={`pt-tab ${m.id === activeModel ? "pt-tab--active" : ""}`}
              style={m.id === activeModel ? { borderColor: MODEL_COLOR(m.id), color: MODEL_COLOR(m.id) } : {}}
              onClick={() => setActiveModel(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div className="pt-filter-tabs">
          {(["all", "correct", "incorrect"] as Filter[]).map((f) => (
            <button
              key={f}
              className={`pt-filter ${filter === f ? "pt-filter--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? `All (${model.predictions.length})` : f === "correct" ? `Correct (${model.predictions.length - incorrectCount})` : `Wrong (${incorrectCount})`}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-scroll">
        <table className="pt-table">
          <thead>
            <tr>
              <th>Idx</th>
              <th>True</th>
              <th>Predicted</th>
              <th>Confidence</th>
              {classNames.map((cn) => (
                <th key={cn}>{cn}</th>
              ))}
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.index} className={p.correct ? "" : "pt-row--wrong"}>
                <td className="mono pt-idx">{p.index}</td>
                <td>
                  <span className="pt-class-badge">{p.y_true_name}</span>
                </td>
                <td>
                  <span
                    className="pt-class-badge"
                    style={p.correct ? { color } : { color: "#ef4444", borderColor: "#ef444440" }}
                  >
                    {p.y_pred_name}
                  </span>
                </td>
                <td>
                  <div className="pt-conf-cell">
                    <div className="pt-conf-bar-track">
                      <div
                        className="pt-conf-bar"
                        style={{ width: `${p.confidence * 100}%`, background: p.correct ? color : "#ef4444" }}
                      />
                    </div>
                    <span className="mono">{(p.confidence * 100).toFixed(1)}%</span>
                  </div>
                </td>
                {classNames.map((cn) => (
                  <td key={cn} className="mono pt-prob">
                    {((p.probabilities[cn] ?? 0) * 100).toFixed(1)}%
                  </td>
                ))}
                <td>
                  {p.correct ? (
                    <span className="pt-badge pt-badge--ok">✓</span>
                  ) : (
                    <span className="pt-badge pt-badge--err">✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
