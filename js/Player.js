/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-gol
 */


function Player(renderer, fps) {

  this._renderer = renderer;
  this._interval = Math.round(1000 / fps);
  this._running = false;
}

Player.prototype = {

  constructor: Player,

  _step: function() {

    if (!this._running) { return; }

    this._renderer.world.step();
    this._renderer.render();

    if (this._running) {

      setTimeout(this._step.bind(this), this._interval);
    }
  },

  play: function() {

    if (this._running) { return; }

    this._running = true;
    this._step();
  },

  stop: function() {
    this._running = false;
  },

  get running() { return this._running; },

  get fps() { return 1000 / this._interval; },
  set fps(value) { this._interval = 1000 / value; }
};
