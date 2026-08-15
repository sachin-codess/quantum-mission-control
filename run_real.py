"""Run the Bell state on a real IBM QPU, print the job ID, and save the result."""
import json
from qiskit import transpile
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2
from circuits import bell_state

service = QiskitRuntimeService()

backend = service.least_busy(operational=True, simulator=False)
print("Selected backend:", backend.name)

qc = bell_state()
qc_t = transpile(qc, backend=backend, optimization_level=1)
print("Transpiled. Circuit depth:", qc_t.depth())

sampler = SamplerV2(mode=backend)
job = sampler.run([qc_t], shots=1000)
print("Job submitted! Job ID:", job.job_id())
print("Waiting for result (this may queue for minutes)...")

result = job.result()
counts = result[0].data.c.get_counts()
print("Results from real quantum hardware:", counts)

# Save the result so the report can use it without re-running the QPU
saved = {
    "backend": backend.name,
    "job_id": job.job_id(),
    "counts": counts,
    "shots": 1000,
}
with open("real_result.json", "w") as f:
    json.dump(saved, f, indent=2)
print("Saved to real_result.json")
