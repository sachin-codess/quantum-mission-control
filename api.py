"""Web API exposing the quantum benchmark engine over HTTP."""
import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from circuits import bell_state
from backends import all_backends
from engine import run_on_backend, fidelity

app = FastAPI(title="Quantum Mission Control API")

# Allow the React frontend (running on a different port) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/benchmark")
def benchmark():
    """Run the Bell state across all backends and return ranked results."""
    qc = bell_state()
    correct = ["00", "11"]
    results = []

    # Simulated backends (run live)
    for name, backend in all_backends():
        r = run_on_backend(qc, name, backend, correct)
        results.append({
            "backend": r["backend"],
            "fidelity": round(r["fidelity"], 4),
            "counts": r["counts"],
            "shots": r["shots"],
            "type": "simulator",
        })

    # Real hardware result (from saved file)
    if os.path.exists("real_result.json"):
        with open("real_result.json") as f:
            real = json.load(f)
        results.append({
            "backend": real["backend"],
            "fidelity": round(fidelity(real["counts"], correct, real["shots"]), 4),
            "counts": real["counts"],
            "shots": real["shots"],
            "type": "real_qpu",
            "job_id": real["job_id"],
        })

    # Rank best-first
    results.sort(key=lambda x: x["fidelity"], reverse=True)
    return {"circuit": "Bell State", "results": results}
