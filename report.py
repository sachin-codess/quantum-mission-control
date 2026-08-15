"""Format benchmark results into a readable comparison report."""


def print_report(circuit_name, results):
    """Print a ranked comparison of backends for one circuit."""
    ranked = sorted(results, key=lambda r: r["fidelity"], reverse=True)
    winner = ranked[0]

    print("=" * 44)
    print(f" QUANTUM BENCHMARK REPORT — {circuit_name}")
    print("=" * 44)
    for rank, r in enumerate(ranked, start=1):
        print(f" {rank}. {r['backend']:<12} fidelity {r['fidelity']:.3f}  ({r['shots']} shots)")
    print("-" * 44)
    print(f" Best backend: {winner['backend']} ({winner['fidelity']:.3f})")
    print("=" * 44)
