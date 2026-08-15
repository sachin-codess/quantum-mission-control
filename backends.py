"""Backends we run circuits on. Each returns a name + a runnable simulator."""
from qiskit_aer import AerSimulator
from qiskit_aer.noise import NoiseModel, depolarizing_error


def clean_backend():
    """A perfect, noise-free simulator."""
    return "clean_sim", AerSimulator()


def noisy_backend():
    """A simulator with fake realistic noise on 1- and 2-qubit gates."""
    noise = NoiseModel()
    # 1% error on single-qubit gates, 2% on two-qubit gates
    noise.add_all_qubit_quantum_error(depolarizing_error(0.01, 1), ["h", "x"])
    noise.add_all_qubit_quantum_error(depolarizing_error(0.02, 2), ["cx"])
    return "noisy_sim", AerSimulator(noise_model=noise)


def all_backends():
    """Return every backend we want to test against."""
    return [clean_backend(), noisy_backend()]
