"""Circuits we test. Each function returns a Qiskit QuantumCircuit."""
from qiskit import QuantumCircuit


def bell_state():
    """A 2-qubit entangled Bell state — our first test circuit."""
    qc = QuantumCircuit(2, 2)
    qc.h(0)
    qc.cx(0, 1)
    qc.measure([0, 1], [0, 1])
    return qc
