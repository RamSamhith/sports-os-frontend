import subprocess
import time

p = subprocess.Popen(["flutter.bat", "run", "-d", "chrome", "--web-port", "8089"], 
                        cwd=r'C:\Users\kmabd\myapp', stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

time.sleep(30)
p.terminate()
stdout, stderr = p.communicate()

with open('flutter_test.log', 'w', encoding='utf-8') as f:
    f.write(stdout)
    f.write("\n\nERRORS:\n")
    f.write(stderr)
