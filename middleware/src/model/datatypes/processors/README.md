# Processors

This directory contains classes that implement `ExecutableProcess`.
When the backend receives a request to execute a `RiesgosProcess`, it finds a matching class among these `ExecutableProcess`es,
instantiates it, executes it, and returns the results.

This way, ...
 - ... the frontend cannot execute a `RiesgosProcess`
 - ... 