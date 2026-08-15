"""List recent IBM Quantum jobs run on your account."""
from qiskit_ibm_runtime import QiskitRuntimeService

service = QiskitRuntimeService()
print("Recent jobs:")
for job in service.jobs(limit=5):
    print(f"  {job.job_id()}  |  {job.backend().name}  |  status: {job.status()}")
