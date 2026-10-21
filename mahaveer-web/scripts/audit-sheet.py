#!/usr/bin/env python3
"""Compares the master product sheet with data/products.ts and flags disagreements before they reach customers.

  python3 scripts/audit-sheet.py            (run from mahaveer-web/)

Checks, per paper family:
  1. Sheet contradicts itself: "Coated/Uncoated" column vs the Paper Type / description wording (e.g. Influence).
  2. Website coated/uncoated value differs from the sheet's "Coated/Uncoated" column.
  3. Weights per colour (Products sheet, one row per SKU) differ from `colorGsm` / `gsm` in data/products.ts.
Exit code 1 when anything is flagged.
"""
import json, re, subprocess, sys
import openpyxl

SHEET = "../Mahaveer_Papers_AI_Master_Product_Sheet_Completed_R018.xlsx"
dump = subprocess.run(
    ["node", "--experimental-strip-types", "-e",
     "import('./data/products.ts').then(m=>console.log(JSON.stringify(m.catalogProducts.map(p=>({name:p.name,gsm:p.gsm,colorNames:p.colorNames||[],colorGsm:p.colorGsm||null,coated:p.coatedUncoated||null,paperTypes:p.paperTypes||[],description:p.description||''})))))"],
    capture_output=True, text=True, check=True).stdout
site = {p["name"]: p for p in json.loads(dump.strip().splitlines()[-1])}

wb = openpyxl.load_workbook(SHEET, data_only=True)
def table(name):
    ws = wb[name]; rows = list(ws.iter_rows(values_only=True)); h = list(rows[0])
    return h, [(i + 2, dict(zip(h, r))) for i, r in enumerate(rows[1:]) if r and any(r)]

problems = []
_, fam = table("Paper Families")
for row, f in fam:
    name = f["Paper Family"]; cu = str(f.get("Coated/Uncoated") or ""); ptype = str(f.get("Paper Type") or ""); desc = str(f.get("Family Description") or "")
    says_un = bool(re.search(r"\buncoated\b", ptype + " " + desc, re.I)); says_co = bool(re.search(r"\bcoated\b", ptype + " " + desc, re.I)) and not says_un
    if cu.strip().lower() == "coated" and says_un:
        problems.append(f"[sheet contradicts itself] '{name}' Paper Families row {row}: Coated/Uncoated = '{cu}' but Paper Type = '{ptype}'")
    if cu.strip().lower().startswith("uncoated") and says_co:
        problems.append(f"[sheet contradicts itself] '{name}' Paper Families row {row}: Coated/Uncoated = '{cu}' but Paper Type = '{ptype}'")
    s = site.get(name)
    if s and s["coated"] and cu and (("uncoated" in s["coated"].lower()) != ("uncoated" in cu.lower())):
        problems.append(f"[site vs sheet] '{name}': site coatedUncoated = '{s['coated']}', sheet = '{cu}'")

_, prods = table("Products")
by = {}
for row, r in prods:
    if r.get("Paper Family") and r.get("GSM") is not None:
        try:
            g = int(float(r["GSM"]))
        except (TypeError, ValueError):
            continue  # labels such as "120/90" are not plain weights
        by.setdefault(r["Paper Family"], {}).setdefault(str(r["Colour Name"]), set()).add(g)
for name, colours in by.items():
    s = site.get(name)
    if not s or not s["colorGsm"]: continue
    for colour, gsms in colours.items():
        key = next((k for k in s["colorGsm"] if k.lower().endswith(colour.lower()) or colour.lower().endswith(k.lower()) or k.lower() == colour.lower()), None)
        if not key: continue
        site_g = {int(x) for x in re.findall(r"\d{2,4}", s["colorGsm"][key])} if "MM" not in s["colorGsm"][key].upper() else None
        if site_g is not None and site_g != gsms:
            problems.append(f"[colour weights] '{name}' / '{colour}': sheet {sorted(gsms)} vs site {sorted(site_g)}")

print("\n".join(problems) if problems else "No disagreements found.")
sys.exit(1 if problems else 0)
