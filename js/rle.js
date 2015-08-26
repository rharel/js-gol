/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-gol
 */


function parseRLE(data) {

  var result = {
    cells: [],
    width: 0,
    height: 1
  };

  var x = 0;
  var y = 0;
  var n = '';

  for (var i = 0; i < data.length; ++i) {

    var char = data[i];

    if (char === '$') {

      x = 0;
      n = n === '' ? 1 : parseInt(n);
      y += n;
      n = '';
    }

    else if (char === 'b') {

      n = n === '' ? 1 : parseInt(n);
      x += n;
      n = '';
    }

    else if (char === 'o') {

      n = n === '' ? 1 : parseInt(n);

      if (x + n > result.width) { result.width = x + n; }

      for (var j = 0; j < n; ++j) { result.cells.push({x: x++, y: y}); }
      n = '';
    }

    else if (!isNaN(parseInt(char))) {
      n += char;
    }
  }

  result.height = y + 1;
  return result;
}
