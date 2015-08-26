/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-gol
 */


(function() {

  /**
   * Create a new simulation.
   *
   * @param width
   * @param height
   *
   * @constructor
   */
  function World(width, height) {

    this._width = width;
    this._height = height;

    this._cells = {};
    this._neighbours = {};
    this._dirty = {};

    this._population = 0;

    this._spawned = [];
    this._died = [];
  }

  World.prototype = {

    constructor: World,

    _isOutside: function(x, y) {

      return x < 0 || x >= this._width ||
             y < 0 || y >= this._height;
    },

    /**
     * Mark a cell as 'dirty'. Only dirty cells are updated during a step().
     *
     * @param x
     * @param y
     *
     * @private
     */
    _setDirty: function(x, y) {

      if (!this._dirty.hasOwnProperty(x)) { this._dirty[x] = {}; }

      this._dirty[x][y] = true;
    },

    /**
     * Increment the neighbours-counter for a cell.
     *
     * @param x
     * @param y
     *
     * @private
     */
    _addNeighbour: function(x, y) {

      x = x === this._width ? 0 : x === -1 ? this._width - 1 : x;
      y = y === this._height ? 0 : y === -1 ? this._height - 1 : y;

      if (!this._neighbours.hasOwnProperty(x)) { this._neighbours[x] = {}; }
      if (!this._neighbours[x].hasOwnProperty(y)) { this._neighbours[x][y] = 0; }

      this._neighbours[x][y] += 1;

      this._setDirty(x, y);
    },

    /**
     * Decrement the neighbours-counter for a cell.
     *
     * @param x
     * @param y
     *
     * @private
     */
    _removeNeighbour: function(x, y) {

      x = x === this._width ? 0 : x === -1 ? this._width - 1 : x;
      y = y === this._height ? 0 : y === -1 ? this._height - 1 : y;

      this._neighbours[x][y] -= 1;

      if (this._neighbours[x][y] === 0) {

        delete this._neighbours[x][y];
      }

      this._setDirty(x, y);
    },

    /**
     * Get the state of a cell (alive or dead).
     *
     * @param x
     * @param y
     *
     * @returns {boolean} True if alive.
     */
    get: function(x, y) {

      if (this._cells.hasOwnProperty(x)) {

        var column = this._cells[x];
        if (column.hasOwnProperty(y)) { return true; }
      }

      return false;
    },

    /**
     * Spawn a new living cell at given position.
     *
     * @param x
     * @param y
     *
     * @returns {boolean}
     *    True if the cell was spawned successfully.
     *    An unsuccessful spawn happens when the given position is out of world bounds, or
     *    when it already contains a living cell.
     */
    spawn: function(x, y) {

      if (this._isOutside(x, y) || this.get(x, y)) { return false; }

      if (!this._cells.hasOwnProperty(x)) { this._cells[x] = {}; }
      this._cells[x][y] = true;

      ++ this._population;

      this._addNeighbour(x - 1, y - 1);
      this._addNeighbour(x - 1, y);
      this._addNeighbour(x - 1, y + 1);
      this._addNeighbour(x, y - 1);
      this._addNeighbour(x, y + 1);
      this._addNeighbour(x + 1, y - 1);
      this._addNeighbour(x + 1, y);
      this._addNeighbour(x + 1, y + 1);

      this._setDirty(x, y);

      return true;
    },

    /**
     * Kill a cell at given position.
     *
     * @param x
     * @param y
     *
     * @returns {boolean}
     *    True if the cell was killed successfully.
     *    An unsuccessful kill happens when the given position is out of world bounds, or
     *    when it already contains a dead cell.
     */
    kill: function(x, y) {

      if (this._isOutside(x, y) || !this.get(x, y)) { return false; }

      delete this._cells[x][y];

      -- this._population;

      this._removeNeighbour(x - 1, y - 1);
      this._removeNeighbour(x - 1, y);
      this._removeNeighbour(x - 1, y + 1);
      this._removeNeighbour(x, y - 1);
      this._removeNeighbour(x, y + 1);
      this._removeNeighbour(x + 1, y - 1);
      this._removeNeighbour(x + 1, y);
      this._removeNeighbour(x + 1, y + 1);

      this._setDirty(x, y);

      return true;
    },

    /**
     * Steps a single cell.
     *
     * @param x
     * @param y
     *
     * @returns {boolean} The new state of the cell.
     *
     * @private
     */
    _step_single: function(x, y) {

      var currentState = this.get(x, y);
      var nNeighbours = +currentState;

      if (this._neighbours.hasOwnProperty(x) &&
        this._neighbours[x].hasOwnProperty(y)) {

        nNeighbours += this._neighbours[x][y];
      }

      if (nNeighbours === 3) { return true; }
      if (nNeighbours === 4) { return currentState; }
      else { return false; }
    },

    /**
     * Advance the simulation one generation into the future.
     *
     * @details
     *    All cells marked as dirty are evolved individually. In the process,
     *    new cells will be marked as dirty for the benefit of the next time step()
     *    is called.
     */
    step: function() {

      this._spawned = [];
      this._died = [];

      for (var x in this._dirty) {

        if (!this._dirty.hasOwnProperty(x)) { continue; }

        var column = this._dirty[x];
        for (var y in column) {

          if (!column.hasOwnProperty(y)) { continue; }

          var result = this._step_single(x, y);

          if (result && !this.get(x, y)) { this._spawned.push({x: +x, y: +y}); }
          else if (!result && this.get(x, y)) { this._died.push({x: +x, y: +y}); }
        }
      }

      this._dirty = {};

      this._spawned.forEach(
        (function(p) {

          this.spawn(p.x, p.y);

        }).bind(this)
      );

      this._died.forEach(
        (function(p) {

          this.kill(p.x, p.y);

        }).bind(this)
      );
    },

    /**
     * Traverses all living cells.
     *
     * @param callback
     *    A method taking one parameter of type {x:, y:}.
     *
     * @details
     *    The given callback is called for each living cell in the simulation.
     *    The callback's return value should be a boolean indicating whether to abort iteration.
     *    So if the callback returns true, the traversal stops.
     */
    traverse: function(callback) {

      var abortRequested = false;

      for (var x in this._cells) {

        if (!this._cells.hasOwnProperty(x)) { continue; }

        for (var y in this._cells[x]) {

          if (this._cells[x].hasOwnProperty(y)) { abortRequested = callback(x, y); }

          if (abortRequested) { return; }
        }
      }
    },

    get width() { return this._width; },
    get height() { return this._height; },

    /**
     * Get the number of living cells.
     *
     * @returns {number}
     */
    get population() { return this._population; }
  };


  if (typeof exports !== 'undefined') {

    exports.World = World;
  }
  else if (typeof window !== 'undefined') {

    window.Gol = {
      World: World
    };
  }
})();