"""Core loop: run a circuit on a backend and score the result."""


def fidelity(counts, correct_outcomes, shots):
    """Fraction of shots that landed on a correct outcome (0.0 to 1.0)."""
    good = sum(counts.get(outcome, 0) for outcome in correct_outcomes)
    return good / shots


def run_on_backend(qc, name, backend, correct_outcomes, shots=1000):
    """Run one circuit on one backend, return a result dict."""
    counts = backend.run(qc, shots=shots).result().get_counts()
    score = fidelity(counts, correct_outcomes, shots)
    return {
        "backend": name,
        "counts": counts,
        "fidelity": score,
        "shots": shots,
    }
