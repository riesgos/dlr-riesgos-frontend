start powershell {node ./dist/index.js; Read-Host}
cd frontend
start powershell {http-server .\dist\frontend\ --port=8080 --cors -g; Read-Host}
[system.Diagnostics.Process]::Start("chrome","http://192.168.178.112:8080")


