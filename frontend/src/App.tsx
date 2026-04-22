import { useReport } from "./hooks/useReport";
import { MetricComparison } from "./components/MetricComparison";
import { ConfusionMatrix } from "./components/ConfusionMatrix";
import { FeatureImportance } from "./components/FeatureImportance";
import { PerClassMetrics } from "./components/PerClassMetrics";
import { PredictionsTable } from "./components/PredictionsTable";
import { RF_COLOR, XGB_COLOR } from "./utils";

function LoadingScreen() {
  return (
    <div className="state-screen">
      <div className="loader" />
      <p className="state-text">Loading model report…</p>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="state-screen">
      <p className="state-error">⚠ {message}</p>
      <p className="state-hint">Make sure the FastAPI server is running and the notebook has been executed.</p>
    </div>
  );
}

export default function App() {
  const state = useReport();

  if (state.status === "loading") return <LoadingScreen />;
  if (state.status === "error") return <ErrorScreen message={state.message} />;

  const { meta, models, comparison } = state.data;

  return (
    <div className="app">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-eyebrow">Machine Learning Pipeline</span>
            <h1 className="header-title">Iris Classification Observatory</h1>
            <p className="header-subtitle">
              Comparing <span style={{ color: RF_COLOR }}>Random Forest</span> vs{" "}
              <span style={{ color: XGB_COLOR }}>XGBoost</span> on the Iris dataset
            </p>
          </div>
          <div className="header-meta">
            <MetaPill label="Dataset" value={meta.dataset} />
            <MetaPill label="Samples" value={`${meta.n_samples_total} total · ${meta.n_samples_test} test`} />
            <MetaPill label="Split" value={`${(meta.test_size * 100).toFixed(0)}% test`} />
            <MetaPill label="Seed" value={String(meta.random_state)} />
            <MetaPill label="sklearn" value={meta.sklearn_version} />
            <MetaPill label="xgboost" value={meta.xgboost_version} />
          </div>
        </div>
      </header>

      {/* ── Model score cards ──────────────────────────────── */}
      <section className="score-strip">
        {models.map((m) => (
          <div key={m.id} className="score-card" style={{ "--model-color": m.id === "random_forest" ? RF_COLOR : XGB_COLOR } as React.CSSProperties}>
            <span className="score-model-name">{m.name}</span>
            <span className="score-accuracy">{(m.metrics.accuracy * 100).toFixed(2)}%</span>
            <span className="score-accuracy-label">Accuracy</span>
            <div className="score-pills">
              <span className="score-pill">F1 {m.metrics.f1_macro.toFixed(3)}</span>
              <span className="score-pill">LL {m.metrics.log_loss.toFixed(3)}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── Main sections ──────────────────────────────────── */}
      <main className="main">
        <MetricComparison comparison={comparison} />
        <ConfusionMatrix models={models} />
        <FeatureImportance models={models} />
        <PerClassMetrics models={models} />
        <PredictionsTable models={models} />
      </main>

      <footer className="footer">
        Generated{" "}
        <span className="mono">
          {new Date(meta.generated_at).toLocaleString()}
        </span>{" "}
        · Iris dataset via scikit-learn
      </footer>
    </div>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-pill">
      <span className="meta-pill-label">{label}</span>
      <span className="meta-pill-value mono">{value}</span>
    </div>
  );
}
