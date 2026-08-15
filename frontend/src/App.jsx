import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/benchmark";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function runBenchmark() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError("Could not reach the API. Is the server running on port 8000?");
    }
    setLoading(false);
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
