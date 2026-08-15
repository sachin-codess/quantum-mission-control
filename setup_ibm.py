"""Save IBM Quantum credentials, reading key + CRN from files in the home folder."""
import os
from qiskit_ibm_runtime import QiskitRuntimeService

home = os.path.expanduser("~")
with open(os.path.join(home, "ibm_key.txt")) as f:
    token = f.read().strip()
with open(os.path.join(home, "ibm_crn.txt")) as f:
    crn = f.read().strip()

QiskitRuntimeService.save_account(
    token=token,
    instance=crn,
    set_as_default=True,
    overwrite=True,
)
print("Saved. Token length:", len(token))
print("Testing connection...")
service = QiskitRuntimeService()
print("Connected! Available QPUs:")
for b in service.backends():
    print("  -", b.name)
