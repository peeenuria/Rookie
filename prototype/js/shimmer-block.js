/**
 * ShimmerBlock — placeholder con animación skeleton-shimmer (Figma 12641:2443)
 */
(function () {
  /**
   * @param {object} [options]
   * @param {string|number} [options.width]
   * @param {string|number} [options.height]
   * @param {string|number} [options.radius]
   * @param {string} [options.className]
   */
  function render(options) {
    const { width, height, radius, className = '' } = options ?? {};
    const styles = [];

    if (width != null) {
      styles.push(`width:${typeof width === 'number' ? `${width}px` : width}`);
    }
    if (height != null) {
      styles.push(`height:${typeof height === 'number' ? `${height}px` : height}`);
    }
    if (radius != null) {
      styles.push(`border-radius:${typeof radius === 'number' ? `${radius}px` : radius}`);
    }

    const styleAttr = styles.length ? ` style="${styles.join(';')}"` : '';

    return `<div class="ShimmerBlock skeleton-bar${className ? ` ${className}` : ''}" aria-hidden="true"${styleAttr}></div>`;
  }

  window.ShimmerBlock = { render };
})();
