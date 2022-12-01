# Parser

Allows to dynamically import js files from a directory.
Scenario-meta-data is inferred from the directory-structure.
Since this code is compiled to js, all the dynamically imported scripts must be js, *not* typescript.
Scripts are allowed to use `require` statements, though.
All scripts need to have a `module.exports.step` line that exports an object implementing the `Step` interface.

