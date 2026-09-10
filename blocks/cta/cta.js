/**
 * Authoring contract, see blocks/cta/_cta.json: a single cell holding the
 * anchor built from link, linkText and linkTitle.
 *
 * The anchor is not wrapped in a paragraph, so decorateButtons() never sees
 * it and the button classes are applied here instead.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) {
    block.textContent = '';
    return;
  }
  link.classList.add('button', 'cta-button');
  block.replaceChildren(link);
}
