/**
 * Authoring contract, see blocks/cta-button/_cta-button.json: a single cell
 * holding the anchor built from link, linkText and linkTitle. The Style field
 * lands on the block as a variant class, so the CSS handles primary and
 * secondary without any branching here.
 *
 * The anchor is not wrapped in a paragraph, so decorateButtons() never sees it
 * and the button class is applied here instead.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) {
    block.textContent = '';
    return;
  }
  link.classList.add('button');
}
