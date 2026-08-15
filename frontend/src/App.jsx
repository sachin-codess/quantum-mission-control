import { useState } from "react";
import "./App.css";
import realResult from "./real_result.json";

// Correct outcomes for a Bell state
const CORRECT = ["00", "11"];
const SHOTS = 1000;

// Simulate a Bell state: ideal is 50/50 on 00 and 11.
// Each backend applies a per-shot error rate that leaks to wrong outcomes.
function simulate(errorRate) {
  const counts = { "00": 0, "01": 0, "10": 0, "11": 0 };
  for (let i = 0; i < SHOTS; i++) {
    // ideal outcome: 00 or 11, 50/50
    let outcome = Math.random() < 0.5 ? "00" : "11";
    // with prob errorRate, flip to a neighboring (wrong) state
    if (Math.random() < errorRate) {
      const wrong = ["01", "10"];
      outcome = wrong[Math.floor(Math.random() * wrong.length)];
    }
    counts[outcome]++;
  }
  return counts;
}

function fidelity(counts) {
  const good = CORRECT.reduce((s, o) => s + (counts[o] || 0), 0);
  return good / SHOTS;
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  function runBenchmark() {
    setLoading(true);
    // small delay so the button state reads as "running"
    setTimeout(() => {
      const cleanCounts = simulate(0.0);
      const noisyCounts = simulate(0.015);

      const results = [
        {
          backend: "clean_sim",
          fidelity: fidelity(cleanCounts),
          counts: cleanCounts,
          shots: SHOTS,
          type: "simulator",
        },
        {
          backend: "noisy_sim",
          fidelity: fidelity(noisyCounts),
          counts: noisyCounts,
          shots: SHOTS,
          type: "simulator",
        },
        {
          backend: realResult.backend,
          fidelity: fidelity(realResult.counts),
          counts: realResult.counts,
          shots: realResult.shots,
          type: "real_qpu",
          job_id: realResult.job_id,
        },
      ];

      results.sort((a, b) => b.fidelity - a.fidelity);
      setData({ circuit: "Bell State", results });
      setLoading(false);
    }, 400);
  }

  return (
    <div className="app">
      <header>
        <h1>Quantum Mission Control</h1>
        <p className="subtitle">
          Benchmarking quantum circuits across simulated and real hardware
        </p>
      </header>

      <button onClick={runBenchmark} disabled={loading}>
        {loading ? "Running benchmark..." : "Run Benchmark"}
      </button>

      {data && (
        <div className="results">
          <h2>{data.circuit}</h2>
          {data.results.map((r, i) => (
            <div className="card" key={i}>
              <div className="card-head">
                <span className="rank">#{i + 1}</span>
                <span className="name">{r.backend}</span>
                <span className={`tag ${r.type}`}>
                  {r.type === "real_qpu" ? "REAL QPU" : "SIMULATOR"}
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${r.fidelity * 100}%` }}
                />
              </div>
              <div className="card-foot">
                <span>Fidelity: {(r.fidelity * 100).toFixed(1)}%</span>
                <span>{r.shots} shots</span>
                {r.job_id && <span className="job">Job: {r.job_id}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="footer">
        Simulators run in-browser. Real QPU result captured from IBM hardware —
        see the repo for the full Qiskit engine and live-hardware code.
      </footer>
    </div>
  );
}

export default App;
