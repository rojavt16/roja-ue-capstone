import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((cell) => {
      const hasPicture = cell.querySelector('picture');
      if (!hasPicture && !cell.textContent.trim()) {
        cell.remove();
      } else if (hasPicture) {
        cell.className = 'cards-card-image';
      } else if (cell.querySelector('h1, h2, h3, h4, h5, h6')) {
        cell.className = 'cards-card-body';
      } else if (cell.querySelector('a')) {
        cell.className = 'cards-card-link';
        const anchor = cell.querySelector('a');
        const emphasis = anchor.closest('strong, em');
        if (emphasis) {
          anchor.classList.add('button', emphasis.tagName === 'STRONG' ? 'primary' : 'secondary');
          emphasis.replaceWith(anchor);
        }
      } else {
        cell.className = 'cards-card-eyebrow';
        if (!cell.firstElementChild) {
          const label = document.createElement('span');
          label.append(...cell.childNodes);
          cell.append(label);
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.replaceChildren(ul);
}
