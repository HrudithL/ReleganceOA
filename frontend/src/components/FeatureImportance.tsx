import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ModelResult } from "../types";
import { MODEL_COLOR } from "../utils";

interface Props {
  models: ModelResult[];
}

const CustomTooltip = ({
  active,
  payload,
  color,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  color: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-box">
      <p style={{ color }} className="mono">
        {(payload[0].value * 100).toFixed(2)}%
      </p>
    </div>
  );
};

function SingleImportance({ model }: { model: ModelResult }) {
  const color = MODEL_COLOR(model.id);
  const data = model.feature_importance.features
    .map((f, i) => ({ feature: f, importance: model.feature_importance.importance[i] }))
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="fi-panel">
      <h3 className="fi-model-title" style={{ color }}>
        {model.name}
      </h3>
      <p className="fi-method">
        {model.id === "random_forest" ? "Mean impurity decrease (Gini)" : "Total gain across splits"}
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" barSize={18}>
          <XAxis
            type="number"
            tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
            tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="feature"
            width={130}
            tick={{ fill: "var(--text-secondary)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip color={color} />}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="importance" radius={[0, 3, 3, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={color}
                fillOpacity={1 - i * 0.12}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FeatureImportance({ models }: Props) {
  return (
    <div className="card">
      <h2 className="card-title">Feature Importance</h2>
      <p className="card-sub">Relative contribution of each Iris feature to model decisions</p>
      <div className="fi-container">
        {models.map((m) => (
          <SingleImportance key={m.id} model={m} />
        ))}
      </div>
    </div>
  );
}
