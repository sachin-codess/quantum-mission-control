"""Benchmark one circuit across simulated + real backends and report."""
import json
import os
from circuits import bell_state
from backends import all_backends
from engine import run_on_backend, fidelity
from report import print_report

qc = bell_state()
correct = ["00", "11"]  # valid Bell-state outcomes

results = []

# Simulated backends (clean + noisy)
for name, backend in all_backends():
    results.append(run_on_backend(qc, name, backend, correct))

# Real hardware result, if we have a saved one
if os.path.exists("real_result.json"):
    with open("real_result.json") as f:
        real = json.load(f)
    results.append({
        "backend": real["backend"] + " (REAL QPU)",
        "counts": real["counts"],
        "fidelity": fidelity(real["counts"], correct, real["shots"]),
        "shots": real["shots"],
        "job_id": real["job_id"],
    })

print_report("Bell State", results)
