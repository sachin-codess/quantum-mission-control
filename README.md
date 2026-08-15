# Quantum Mission Control

A hardware-agnostic benchmarking engine for quantum circuits. It runs a circuit
across multiple backends — an ideal simulator, a noisy simulator, and real IBM
quantum hardware — scores each by fidelity, and produces a ranked comparison report.

## Why

Real quantum computers are noisy, and that noise varies by machine. This tool
measures and compares backend quality so a developer can see how a circuit
actually behaves on real hardware versus theory — without becoming a physicist.

## What it does

- Defines quantum circuits (currently a 2-qubit Bell state)
- Runs them across multiple backends via a clean, modular engine
- Transpiles circuits for real hardware and submits jobs to IBM Quantum
- Scores each backend by fidelity (fraction of shots on correct outcomes)
- Ranks backends and declares the best one

## Example result

A benchmark of a Bell state across three backends produced:
clean_sim 1.000, noisy_sim 0.992, and ibm_kingston (REAL QPU) 0.955.

The real-hardware run executed on IBM's 156-qubit ibm_kingston processor
(job ID da01if50vrcc73bptqi0). Real hardware scored below the simulated noise
model — real qubit noise exceeded the optimistic 1-2% model, which is exactly
the kind of gap this tool is built to surface.

## Architecture

- circuits.py — circuit definitions
- backends.py — backend definitions (clean sim, noisy sim)
- engine.py — core run and fidelity scoring
- report.py — ranked comparison report
- run.py — entry point (simulated plus saved real results)
- run_real.py — submits a job to real IBM hardware
- list_jobs.py — retrieves past IBM job IDs

## Stack

Python, Qiskit, Qiskit Aer, Qiskit IBM Runtime.

## Roadmap

- Benchmark engine (simulators) — done
- Real IBM hardware integration — done
- Web dashboard — planned
- Multi-vendor backends (IonQ, Rigetti) — planned
- Predictive backend selection — planned
