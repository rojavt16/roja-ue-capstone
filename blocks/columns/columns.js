import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Authoring contract, see blocks/columns/_columns.json:
 *
 *   row 1  media group    picture built from image + imageAlt
 *   row 2  content group  heading, body copy, CTA
 *
 * Image position comes from the model's classes field, so the block
 * already carries image-left or image-right and needs no work here.
 *
 * The CTA has already been turned into a .button-wrapper paragraph by
 * decorateButtons(), so the remaining paragraphs are the text ones:
 * first is the heading, the rest are body copy.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const [mediaRow, contentRow] = block.children;

  const media = document.createElement('div');
  media.className = 'columns-media';
  const mediaCell = mediaRow?.firstElementChild;
  if (mediaCell) moveInstrumentation(mediaCell, media);
  const picture = mediaRow?.querySelector('picture');
  if (picture) media.append(picture);

  const content = document.createElement('div');
  content.className = 'columns-content';
  const contentCell = contentRow?.firstElementChild;
  if (contentCell) moveInstrumentation(contentCell, content);

  const parts = contentCell ? [...contentCell.children] : [];
  const actions = parts.filter((el) => el.classList.contains('button-wrapper'));
  const texts = parts.filter((el) => !el.classList.contains('button-wrapper'));
  const [heading, ...body] = texts;

  if (heading) {
    const h2 = document.createElement('h2');
    h2.className = 'columns-title';
    moveInstrumentation(heading, h2);
    h2.append(...heading.childNodes);
    content.append(h2);
  }

  body.forEach((p) => {
    p.classList.add('columns-description');
    content.append(p);
  });

  if (actions.length) {
    const group = document.createElement('div');
    group.className = 'columns-actions';
    group.append(...actions);
    content.append(group);
  }

  block.replaceChildren(media, content);
}
