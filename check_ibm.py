"""Verify IBM Quantum credentials work by listing available backends."""
from qiskit_ibm_runtime import QiskitRuntimeService

service = QiskitRuntimeService()
print("Connected. Available QPUs:")
for b in service.backends():
    print(" -", b.name)
