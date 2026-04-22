import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ComparisonRow } from "../types";
import { RF_COLOR, XGB_COLOR, formatMetricName } from "../utils";

interface Props {
  comparison: ComparisonRow[];
}

const DISPLAY_METRICS = [
  "accuracy",
  "balanced_accuracy",
  "f1_macro",
  "precision_macro",
  "recall_macro",
  "f1_weighted",
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-box">
      <p className="tooltip-label">{formatMetricName(label ?? "")}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="mono">{p.value.toFixed(4)}</span>
        </p>
      ))}
    </div>
  );
};

export function MetricComparison({ comparison }: Props) {
  const data = comparison
    .filter((r) => DISPLAY_METRICS.includes(r.metric))
    .map((r) => ({
      metric: r.metric,
      "Random Forest": r.random_forest,
      XGBoost: r.xgboost,
    }));

  return (
    <div className="card">
      <h2 className="card-title">Model Comparison</h2>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} barCategoryGap="28%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="metric"
            tickFormatter={formatMetricName}
            tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 1]}
            tickFormatter={(v: number) => v.toFixed(1)}
            tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Legend
            wrapperStyle={{ paddingTop: 16, fontSize: 12, color: "var(--text-muted)" }}
            iconType="circle"
          />
          <Bar dataKey="Random Forest" fill={RF_COLOR} radius={[3, 3, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={RF_COLOR} fillOpacity={0.85} />
            ))}
          </Bar>
          <Bar dataKey="XGBoost" fill={XGB_COLOR} radius={[3, 3, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={XGB_COLOR} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
