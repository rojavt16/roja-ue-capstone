import { decorateBlock, loadBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // decorateBlocks() only looks at "div.section > div > div", so a block
  // nested in a column is never marked or loaded. Do it here instead.
  const nested = [...block.querySelectorAll(':scope > div > div > div[class]')]
    .filter((el) => !el.classList.contains('block'));
  await Promise.all(nested.map((el) => {
    decorateBlock(el);
    return loadBlock(el);
  }));
}
