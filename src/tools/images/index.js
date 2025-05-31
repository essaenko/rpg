document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#app');
  const imageSelector = container.querySelector('input');
  const tileWidth = container.querySelector('#width');
  const tileHeight = container.querySelector('#height');
  const button = container.querySelector('#render');
  const canvas = container.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  let image = null;

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const width = +tileWidth.value;
    const height = +tileHeight.value;
    const file = imageSelector.files[0];

    if (width && height && file && file.type === 'image/png') {

      const reader = new FileReader();
      reader.addEventListener('loadend', () => {
        image = new Image();
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);

          initCanvasInput(canvas, width, height);
        }

        image.src = reader.result;
        document.body.appendChild(image);
      });
      reader.readAsDataURL(file);
    }
  })

  function initCanvasInput(canvas, tWidth, tHeight) {
    let selectedSquares = [];
    canvas.onclick = (event) => {
      const cpos = canvas.getBoundingClientRect();
      const pointer = {
        x: event.clientX - cpos.x,
        y: event.clientY - cpos.y,
      };

      const square = {
        x: Math.floor(pointer.x / tWidth),
        y: Math.floor(pointer.y / tHeight),
      }
      const existedSquare = selectedSquares.find((sq) => sq.x === square.x && sq.y === square.y);

      if (existedSquare) {
        selectedSquares = selectedSquares.filter((sq) => sq !== existedSquare);
      } else {
        selectedSquares.push(square);
      }

      renderSquares(selectedSquares, tWidth, tHeight);
    }

    const saveBtn = container.querySelector('#save');
    saveBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (selectedSquares.length === 0) {
        throw new Error('Нет выбранных тайлов');
      }

      // Находим минимальные координаты, чтобы нормализовать относительно (0, 0)
      const minX = Math.min(...selectedSquares.map(t => t.x));
      const minY = Math.min(...selectedSquares.map(t => t.y));
      const maxX = Math.max(...selectedSquares.map(t => t.x));
      const maxY = Math.max(...selectedSquares.map(t => t.y));

      const widthInTiles = maxX - minX + 1;
      const heightInTiles = maxY - minY + 1;

      // Создаем канвас нужного размера
      const canvas = document.createElement('canvas');
      canvas.width = widthInTiles * tWidth;
      canvas.height = heightInTiles * tHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Не удалось получить контекст');

      for (const tile of selectedSquares) {
        const sourceX = tile.x * tWidth;
        const sourceY = tile.y * tHeight;
        const destX = (tile.x - minX) * tWidth;
        const destY = (tile.y - minY) * tHeight;

        ctx.drawImage(
          image,
          sourceX, sourceY, tWidth, tHeight,
          destX, destY, tWidth, tHeight
        );
      }

      const copy = trimCanvas(canvas);
      document.body.appendChild(copy);

      copy.onclick = (event) => {
        const link = document.createElement('a');
        link.download = 'object.png';
        link.href = copy.toDataURL('image/png');
        link.click();

        document.body.removeChild(copy);
        selectedSquares = [];
        renderSquares(selectedSquares, tWidth, tHeight);
      }
    })
  }

  function renderSquares(squares, tWidth, tHeight) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    squares.forEach((square) => {
      ctx.fillStyle = "rgba(237, 92, 182, 0.3)"
      ctx.fillRect(square.x * tWidth, square.y * tHeight, tWidth, tHeight);
    })
  }
})


var trimCanvas = (function() {
  function rowBlank(imageData, width, y) {
    for (var x = 0; x < width; ++x) {
      if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false;
    }
    return true;
  }

  function columnBlank(imageData, width, x, top, bottom) {
    for (var y = top; y < bottom; ++y) {
      if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false;
    }
    return true;
  }

  return function(canvas) {
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var top = 0, bottom = imageData.height, left = 0, right = imageData.width;

    while (top < bottom && rowBlank(imageData, width, top)) ++top;
    while (bottom - 1 > top && rowBlank(imageData, width, bottom - 1)) --bottom;
    while (left < right && columnBlank(imageData, width, left, top, bottom)) ++left;
    while (right - 1 > left && columnBlank(imageData, width, right - 1, top, bottom)) --right;

    var trimmed = ctx.getImageData(left, top, right - left, bottom - top);
    var copy = canvas.ownerDocument.createElement("canvas");
    var copyCtx = copy.getContext("2d");
    copy.width = trimmed.width;
    copy.height = trimmed.height;
    copyCtx.putImageData(trimmed, 0, 0);

    return copy;
  };
})();