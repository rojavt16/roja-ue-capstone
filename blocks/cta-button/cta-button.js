export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) {
    block.textContent = '';
    return;
  }
  link.classList.add('button');
}
