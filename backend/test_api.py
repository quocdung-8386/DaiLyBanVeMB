import http.client
import json

conn = http.client.HTTPConnection("localhost", 8000)
conn.request("GET", "/api/v1/flights/")
response = conn.getresponse()
data = response.read()

if response.status == 200:
    flights = json.loads(data)
    print(f"Success! Found {len(flights)} flights.")
    for f in flights[:3]:
        print(f"- {f['flight']}: {f['from']} -> {f['to']} ({f['name']})")
else:
    print(f"Error: {response.status}")
    print(data.decode())

conn.close()
