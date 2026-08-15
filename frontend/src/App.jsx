import { useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [realLoading, setRealLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  async function runBenchmark() {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`${API}/benchmark`);
      setData(await res.json());
    } catch (e) {
      setError("Could not reach the API. Is the server running on port 8000?");
    }
    setLoading(false);
  }

  async function runFreshQPU() {
    setRealLoading(true);
    setError(null);
    setNotice("Submitting a fresh job to IBM Quantum. This may queue for minutes...");
    try {
      const res = await fetch(`${API}/benchmark/real`, { method: "POST" });
      const real = await res.json();
      setNotice(
        `Fresh QPU run complete on ${real.backend} — fidelity ${(real.fidelity * 100).toFixed(1)}% (job ${real.job_id}). Click Run Benchmark to see it ranked.`
      );
    } catch (e) {
      setError("Fresh QPU run failed. Check the API server logs.");
      setNotice(null);
    }
    setRealLoading(false);
  }

  return (
    <div className="app">
      <header>
        <h1>Quantum Mission Control</h1>
        <p className="subtitle">
          Benchmarking quantum circuits across simulated and real hardware
        </p>
      </header>

      <div className="buttons">
        <button onClick={runBenchmark} disabled={loading || realLoading}>
          {loading ? "Running benchmark..." : "Run Benchmark"}
        </button>
        <button
          className="secondary"
          onClick={runFreshQPU}
          disabled={loading || realLoading}
          title="Submits a new job to IBM Quantum. Queue time and quantum runtime may apply."
        >
          {realLoading ? "Submitting to QPU..." : "Run Fresh QPU Test"}
        </button>
      </div>

      {notice && <p className="notice">{notice}</p>}
      {error && <p className="error">{error}</p>}

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
    </div>
  );
}

export default App;
