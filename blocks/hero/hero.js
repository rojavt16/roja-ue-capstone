import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Authoring contract, see blocks/hero/_hero.json:
 *
 *   row 1  background group  picture built from image + imageAlt
 *   row 2  foreground group  eyebrow, heading, description, CTAs
 *
 * Within the foreground cell the CTAs have already been turned into
 * .button-wrapper paragraphs by decorateButtons(), so the remaining
 * paragraphs are the text ones and are read in authored order:
 * first is the eyebrow, second is the heading, the rest are description
 * (a richtext description may render as several paragraphs).
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const [backgroundRow, foregroundRow] = block.children;

  // background: the image is the LCP candidate, so load it eagerly
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

  // foreground
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

  // the heading carries the page H1, promote it from the authored paragraph
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
