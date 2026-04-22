import { useEffect, useState } from "react";
import type { Report } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; data: Report };

export function useReport(): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/report`)
      .then((r) => {
        if (!r.ok) throw new Error(`API returned ${r.status}: ${r.statusText}`);
        return r.json() as Promise<unknown>;
      })
      .then((data) => {
        const report = data as Report;
        if (!Array.isArray(report?.models) || !Array.isArray(report?.comparison)) {
          throw new Error("Unexpected report shape — re-run the notebook to regenerate model_report.json");
        }
        return report;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ok", data });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            status: "error",
            message: err instanceof Error ? err.message : String(err),
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
