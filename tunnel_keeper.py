import subprocess
import time
import re
import os

TUNNEL_INFO_FILE = "/Users/avishjain/Downloads/orignal-saathi-main/tunnel_url.txt"

def run_tunnel():
    cmd = [
        "ssh",
        "-o", "StrictHostKeyChecking=no",
        "-o", "ServerAliveInterval=30",
        "-o", "ServerAliveCountMax=3",
        "-R", "80:localhost:3005",
        "nokey@localhost.run"
    ]
    print("Starting SSH tunnel...")
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
    
    url_found = False
    for line in iter(process.stdout.readline, ''):
        print(line, end='', flush=True)
        match = re.search(r'(https://[a-zA-Z0-9-]+\.lhr\.life)', line)
        if match and not url_found:
            url = match.group(1)
            url_found = True
            with open(TUNNEL_INFO_FILE, "w") as f:
                f.write(url)
            print(f"\n>>> ACTIVE_TUNNEL_URL: {url} <<<\n", flush=True)
            
    process.wait()

def main():
    while True:
        try:
            run_tunnel()
        except Exception as e:
            print(f"Tunnel error: {e}")
        time.sleep(3)

if __name__ == "__main__":
    main()
