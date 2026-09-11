import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [backgroundRow, foregroundRow] = block.children;

  const background = document.createElement('div');
  background.className = 'hero-background';
  const backgroundCell = backgroundRow?.firstElementChild;
  if (backgroundCell) moveInstrumentation(backgroundCell, background);
  const picture = backgroundRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
    background.append(picture);
  }

  const content = document.createElement('div');
  content.className = 'hero-content';
  const foregroundCell = foregroundRow?.firstElementChild;
  if (foregroundCell) moveInstrumentation(foregroundCell, content);

  const parts = foregroundCell ? [...foregroundCell.children] : [];
  const actions = parts.filter((el) => el.classList.contains('button-wrapper'));
  const texts = parts.filter((el) => !el.classList.contains('button-wrapper'));
  const [eyebrow, heading, ...description] = texts;

  if (eyebrow && texts.length > 1) {
    eyebrow.className = 'hero-eyebrow';
    content.append(eyebrow);
  }

  const headingSource = texts.length > 1 ? heading : eyebrow;
  if (headingSource) {
    const h1 = document.createElement('h1');
    h1.className = 'hero-title';
    moveInstrumentation(headingSource, h1);
    h1.append(...headingSource.childNodes);
    content.append(h1);
  }

  description.forEach((p) => {
    p.classList.add('hero-description');
    content.append(p);
  });

  if (actions.length) {
    const group = document.createElement('div');
    group.className = 'hero-actions';
    group.append(...actions);
    content.append(group);
  }

  block.replaceChildren(background, content);
}
