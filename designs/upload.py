#!/usr/bin/env python3
"""Upload all designs to Printify and print the resulting image URLs."""
import os
import base64
import json
import urllib.request
import urllib.error

TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6ImIxZWY3OGMyM2QzNTU4MWMxNTk3YzI0OGNmZTUwMTk1YTlhYTU1MTIzODc2MGZiZWY5YjFiM2FiZjg1NDUxMTQyYTg4NWQ4ODk0MmZjMDgzIiwiaWF0IjoxNzc4MTEwMzc5LjE1MzYxMywibmJmIjoxNzc4MTEwMzc5LjE1MzYxOSwiZXhwIjoxODA5NjQ2Mzc5LjE0NzE1Niwic3ViIjoiMjcyMDQ1OTIiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.MnziulNWyP2nWIrTBPCPVs5IvRdJQqo-IyVdQ_zRlFCxCc15Z9e6YOaljTZExPbAfrUhV6upW1_io_Qb3i6vn6ITxO5NtM5as4fns2pWmx-lLLzPR32rxrZujyWx3gI5L6dZ3pv5i5CDgCBGzvX-gp--s1AS6lo-uJkD3O9ZVc-BVKiTS6P5ZiGJcpAMvFwMvb0YqepK_yftbOQ6tvKTgKk9F8vtDicitlHcj32oCALcoZMSFPZpN5kLWOv-I4i4JjVUkjI15YdCUXgzy4lEpwcooyEoPcRtPPnz1UtOgIbBrXiBumLz8iuxBdZC2nYBWuujkXoyKocRhl_pUEz_d7-JV7cX0G9Xb_93xH68OhUqCdFFA-3IKFCTfx0u1KwKtiabXc3PGuBioe4dVSfcm0yrpCHn91s8EAV85dLmwYFgUOeJgkyVFoFooQ2sif_xZveRhdMaq0rwa5aK053JMQxKuXmBf79qdUd6Uag_BAK_fZ54uiRAbFw5Q4qVD1k8XCVgyXn-EqIYLCaVoQTF2MmpPFf79Xaw1q9WZE5fvxe1CuPoyItZctCfNAYHxlgcitvwbBU-IWMEeQgh48YAsCRHdiiXSjvhCoGNRaOqVPdRAU0QJi3YnikgtMF9NGw1oX2fG0VoVa1MNr9m55mPtzt7sxTYaL52U1R7C9Nq34g"

DESIGNS = [
    "marble-white", "marble-black", "sage-green", "dusty-rose",
    "midnight-navy", "champagne-gold", "cloud-grey", "terracotta",
    "lavender-mist", "obsidian"
]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
results = {}

def upload(design_id):
    path = os.path.join(SCRIPT_DIR, f"{design_id}.png")
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode()

    payload = json.dumps({
        "file_name": f"caselle-{design_id}.png",
        "contents": data
    }).encode()

    req = urllib.request.Request(
        "https://api.printify.com/v1/uploads/images.json",
        data=payload,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST"
    )

    with urllib.request.urlopen(req) as res:
        body = json.loads(res.read())
        return body.get("preview_url") or body.get("id")

print("Uploading designs to Printify...\n")
for design_id in DESIGNS:
    try:
        url = upload(design_id)
        results[design_id] = url
        print(f"  ✓ {design_id}: {url}")
    except Exception as e:
        print(f"  ✗ {design_id}: {e}")

print("\n--- DESIGN URL MAP ---")
print(json.dumps(results, indent=2))

# Save to file for reference
out = os.path.join(SCRIPT_DIR, "design-urls.json")
with open(out, "w") as f:
    json.dump(results, f, indent=2)
print(f"\nSaved to {out}")
