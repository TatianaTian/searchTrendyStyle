check what process is running on a portal (e.g. 5000):
lsof -i :5000

kill the process:
kill -9 <PID>

unsettle the HEAD:
unset HEAD