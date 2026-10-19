/* Layout only: scoring, API calls and game state are intentionally independent. */
export function installResponsiveLayout() {
  const body = document.body, app = document.getElementById('app');
  let pending = false;
  function set(name, value) {
    if (app.style.getPropertyValue(name) !== value) app.style.setProperty(name, value);
  }
  function update() {
    pending = false;
    const css = getComputedStyle(body);
    const width = Math.max(1, body.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight));
    const height = Math.max(1, body.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom));
    // Preserve each artwork's original ratio, keeping all controls in view.
    const ratio = body.classList.contains('result-view') ? 1846 / 852
      : body.classList.contains('end-view') ? 1823 / 863 : 1743 / 902;
    const essentialBottom = body.classList.contains('result-view') ? .82
      : body.classList.contains('end-view') ? .76 : .80;
    const artWidth = Math.min(width, 520, height / (ratio * essentialBottom));
    const artValue = `${artWidth.toFixed(2)}px`;
    if (body.style.getPropertyValue('--art-width') !== artValue) {
      body.style.setProperty('--art-width', artValue);
      body.style.setProperty('--home-art-height', `${(artWidth * 1743 / 902).toFixed(2)}px`);
    }
    const stack = app.querySelector('.stack');
    if (!stack) return;
    // Five cards clear immediately. Reserve space for four visible cards.
    const box = stack.getBoundingClientRect();
    const cardWidth = Math.max(1, Math.min(box.width, (box.height - 36) * 135 / 190));
    const cardHeight = cardWidth * 190 / 135;
    const step = Math.max(0, Math.min(24, (box.height - cardHeight) / 3));
    set('--lane-card-width', `${cardWidth.toFixed(2)}px`);
    set('--stack-step', `${step.toFixed(2)}px`);
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  const resize = new ResizeObserver(schedule);
  resize.observe(body);
  resize.observe(app);
  const changes = new MutationObserver(schedule);
  changes.observe(body, { attributes: true, attributeFilter: ['class'] });
  changes.observe(app, { childList: true });
  window.addEventListener('resize', schedule);
  window.visualViewport?.addEventListener('resize', schedule);
  update();
}
