/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-gol
 */


function Renderer(canvas, world) {

  this._canvas = canvas;
  this._2d = canvas.getContext('2d');

  this._world = world;

  this._cellStyle = {
    color: 'black'
  };

  this._gridStyle = {
    color: 'lightgray',
    thickness: 1,
    visible: true
  };

  this._borderStyle = {
    color: 'black',
    thickness: 2,
    visible: true
  };

  this._scale = null;
  this._viewport = {
    x: 0, y: 0,
    width: 0, height: 0
  };
}

Renderer.prototype = {

  constructor: Renderer,

  _compute_scale: function() {

    var wScale = this._canvas.width / this._world.width;
    var hScale = this._canvas.height / this._world.height;

    this._scale = Math.min(wScale, hScale);
  },

  _compute_viewport: function() {

    this._viewport.width = this._world.width * this._scale;
    this._viewport.height = this._world.height * this._scale;

    this._viewport.x = 0.5 * this._canvas.width - 0.5 * this._viewport.width;
    this._viewport.y = 0.5 * this._canvas.height - 0.5 * this._viewport.height;
  },

  _clear: function() {

    this._2d.fillStyle = 'white';
    this._2d.fillRect(0, 0, this._canvas.width, this._canvas.height);
  },

  _draw_border: function() {

    this._2d.save();

    this._2d.strokeStyle = this._borderStyle.color;
    this._2d.lineWidth = this._borderStyle.thickness;

    this._2d.beginPath();
    this._2d.translate(0.5, 0.5);

    this._2d.rect(
      this._viewport.x, this._viewport.y,
      this._viewport.width, this._viewport.height
    );

    this._2d.stroke();
    this._2d.restore();
  },

  _draw_grid: function() {

    this._2d.save();

    this._2d.strokeStyle = this._gridStyle.color;
    this._2d.lineWidth = this._gridStyle.thickness;

    this._2d.beginPath();
    this._2d.translate(0.5, 0.5);

    var yStart = this._viewport.y;
    var yEnd = yStart + this._viewport.height;

    var i, x;

    for (i = 0; i < this._world.width; ++i) {

      x = this._viewport.x + i * this._scale;

      this._2d.moveTo(x, yStart);
      this._2d.lineTo(x, yEnd);
    }

    var xStart = this._viewport.x;
    var xEnd = xStart + this._viewport.width;

    var y;

    for (i = 0; i < this._world.height; ++i) {

      y = this._viewport.y + i * this._scale;

      this._2d.moveTo(xStart, y);
      this._2d.lineTo(xEnd, y);
    }

    this._2d.stroke();
    this._2d.restore();
  },

  _draw_cells: function() {

    this._2d.save();

    this._2d.fillStyle = this._cellStyle.color;

    this._2d.translate(0.5, 0.5);

    this._world.traverse((function(cell_x, cell_y) {

      this._2d.beginPath();

      var x = this._viewport.x + cell_x * this._scale;
      var y = this._viewport.y + cell_y * this._scale;

      this._2d.rect(x, y, this._scale, this._scale);

      this._2d.fill();

    }).bind(this));

    this._2d.restore();
  },

  render: function() {

    this._compute_scale();
    this._compute_viewport();

    this._clear();

    if (this._borderStyle.visible) { this._draw_border(); }

    this._draw_cells();

    if (this._gridStyle.visible) { this._draw_grid(); }
  },

  get cells() { return this._cellStyle; },
  get grid() { return this._gridStyle; },
  get border() { return this._borderStyle; },

  get world() { return this._world; },
  set world(value) { this._world = value; }
};
