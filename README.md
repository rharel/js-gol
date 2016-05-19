[![Build Status](https://travis-ci.org/rharel/js-gol.svg)](https://travis-ci.org/rharel/js-gol)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com)

## What is this?

A simple [Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) implementation. View the demo [here](https://rharel.github.io/js-gol).


## Installation

Install via bower: `bower install rharel/js-gol`

The `dist/` directory contains both a normal (`gol.js`) as well as a minified version of the library (`gol.min.js`).
Include in the browser using `<script src="path/to/gol.min.js"></script>`


## Usage


### Create
```javascript
var world = new Gol.World(width, height, is_wrapped);
```

This creates a new Game of Life universe, with the specified width and height, and optional wrap parameter.


### Populate
```javascript
world.spawn(x, y);
```

Use `spawn` to spawn living cells at given positions. Positions outside of the world boundaries are ignored.

```javascript
world.kill(x, y);
```

If at any point you wish to remove a living cell, use `kill` with that cell's position.


### Step

```javascript
world.step();
```

Advance the simulation one generation into the future.


### Inspect

```javascript
world.inspect(x, y)
```

Gets the state of a cell (false -> dead, true -> alive)

```javascript
world.inspect_all(callback)
```

Iterate over all living cells with `inspect_all`. This invokes a given `callback` for each living cell in the simulation. `callback` should accept one argument of type `{x:, y:}`. The return value of `callback` should be a boolean which signals whether to abort iteration. Therefore, if you wish to stop the iteration, simply return `true`.


## License

This software is licensed under the **MIT License**. See the [LICENSE](LICENSE.txt) file for more information.
