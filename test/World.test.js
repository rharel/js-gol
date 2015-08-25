/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-gol
 */

var World = require('../src/World').World;

var expect = require('chai').expect;


describe ('World', function() {

  describe ('fresh instance', function() {

    var w = 1, h = 2;
    var world = new World(w, h);

    it ('should have given width and height', function() {

      expect(world.width).to.be.equal(w);
      expect(world.height).to.be.equal(h);
    });

    it ('should have zero population', function() {

      expect(world.population).to.be.equal(0);
    });
  });

  describe ('spawning cells', function() {

    var w = 2; h = 2;
    var world;

    beforeEach(function() {
      world = new World(w, h);
    });

    it ('should be dead before spawn', function() {

      expect(world.get(0, 0)).to.be.equal(false);
    });

    it ('should not spawn out of bounds', function() {

      expect(world.spawn(w, h)).to.be.equal(false);
    });

    it ('should spawn on an empty cell', function() {

      expect(world.spawn(0, 0)).to.be.equal(true);
      expect(world.get(0, 0)).to.be.equal(true);
      expect(world.population).to.be.equal(1);
    });

    it ('should not spawn on an occupied cell', function() {

      expect(world.spawn(0, 0)).to.be.equal(true);
      expect(world.spawn(0, 0)).to.be.equal(false);
    });
  });

  describe ('killing cells', function() {

    var w = 2, h = 2;
    var world;

    beforeEach(function() {
      world = new World(w, h);
    });

    it ('should not kill a dead cell', function() {

      expect(world.kill(0, 0)).to.be.equal(false);
    });

    it ('should not kill out of bounds', function() {

      expect(world.kill(w, h)).to.be.equal(false);
    });

    it ('should kill a living cell', function() {

      world.spawn(0, 0);

      expect(world.kill(0, 0)).to.be.equal(true);
      expect(world.get(0, 0)).to.be.equal(false);
      expect(world.population).to.be.equal(0);
    });
  });

  describe('stepping', function() {

    var w = 5, h = 5;
    var c = 2;

    function populate(world, nNeighbours) {

      if (nNeighbours >= 8) { world.spawn(c - 1, c - 1); }
      if (nNeighbours >= 7) { world.spawn(c - 1, c); }
      if (nNeighbours >= 6) { world.spawn(c - 1, c + 1); }
      if (nNeighbours >= 5) { world.spawn(c, c - 1); }
      if (nNeighbours >= 4) { world.spawn(c, c + 1); }
      if (nNeighbours >= 3) { world.spawn(c + 1, c - 1); }
      if (nNeighbours >= 2) { world.spawn(c + 1, c); }
      if (nNeighbours >= 1) { world.spawn(c + 1, c + 1); }
    }

    function testCase(world, nNeighbours, expectedResult) {

      populate(world, nNeighbours);
      world.step();

      expect(world.get(c, c)).to.be.equal(expectedResult);
    }

    describe ('stepping a live cell', function() {

      var world;

      function reset() {
        world = new World(w, h);
        world.spawn(c, c);
      }

      beforeEach(reset);

      it ('should die if it has fewer than two neighbours', function() {

        testCase(world, 0, false); reset();
        testCase(world, 1, false); reset();
      });

      it ('should live on if it has two or three neighbours', function() {

        testCase(world, 2, true); reset();
        testCase(world, 3, true); reset();
      });

      it ('should die if it has four or more neighbours', function() {

        testCase(world, 4, false); reset();
        testCase(world, 5, false); reset();
        testCase(world, 6, false); reset();
        testCase(world, 7, false); reset();
        testCase(world, 8, false); reset();
      });
    });

    describe ('stepping a dead cell', function() {

      var world;

      function reset() {
        world = new World(w, h);
      }

      beforeEach(reset);

      it ('should spawn if it has three neighbours', function() {

        testCase(world, 3, true); reset();
      });

      it ('should remain dead if it has < 3 or > 3', function() {

        testCase(world, 0, false); reset();
        testCase(world, 1, false); reset();
        testCase(world, 2, false); reset();

        testCase(world, 4, false); reset();
        testCase(world, 5, false); reset();
        testCase(world, 6, false); reset();
        testCase(world, 7, false); reset();
        testCase(world, 8, false); reset();
      });
    });
  });
});
