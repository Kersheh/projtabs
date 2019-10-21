[![license](https://img.shields.io/npm/l/ttab.svg)](https://github.com/Kersheh/projtabs/blob/master/LICENSE)


# projtabs &mdash; Automated project terminal tab/window opener

A macOS CLI for programmatically opening new terminal tabs/windows for a given project.

Open terminal tab/window functionality built off [ttab](https://github.com/mklement0/ttab).

# Installation

    npm install projtabs -g

# Usage

Place `.projrc` file at the root of your project and execute `projtabs`.

    $ projtabs

# .projrc Example

```json
{
  "dirs": [
    {
      "path": "~",
      "name": "Home directory in new tab",
      "cmd": "echo 'Hello new terminal tab'",
      "window": false
    },
    {
      "path": "lib",
      "name": "Folder in a new window",
      "cmd": "echo 'Hello new terminal window'",
      "window": true
    },
    "someOtherDir"
  ],
  "options": {
    "exit": false
  }
}
```

# Config

`"dirs"` takes either an array of strings representing the new terminal's path or objects containing a set of new terminal options listed below.

- `"path"` String: Path to start new terminal.

- `"name"` String: Name of new terminal.

- `"cmd"` String: Command to execute when new terminal opens.

- `"window"` Boolean: Open new terminal in window (defaults to false).

`"options"` additional optional configuration options.

- `"exit"` Boolean: Sends a signal to the active terminal to close after execution (defaults to false).
