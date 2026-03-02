(function () {
  const sliders = Array.from(document.querySelectorAll('.slider_body'));
  const arrowNext = document.querySelector('#next');
  const arrowBefore = document.querySelector('#before');

  if (!arrowNext || !arrowBefore || sliders.length === 0) return;

  arrowNext.addEventListener('click', () => changePosition(1));
  arrowBefore.addEventListener('click', () => changePosition(-1));

  function changePosition(change) {
    const current = document.querySelector('.slider_body-show');
    if (!current || !current.dataset) return;

    const currentElement = Number(current.dataset.id);
    if (!Number.isFinite(currentElement) || currentElement <= 0) return;

    let value = currentElement + change;
    if (value <= 0) value = sliders.length;
    if (value > sliders.length) value = 1;

    const prev = sliders[currentElement - 1];
    const next = sliders[value - 1];
    if (!prev || !next) return;

    prev.classList.toggle('slider_body-show');
    next.classList.toggle('slider_body-show');
  }
})();
