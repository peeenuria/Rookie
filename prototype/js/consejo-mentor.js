/**
 * ConsejoMentor — Figma 13278:4201
 * Tarjeta reutilizable con cabecera de mentor y texto de consejo.
 */
(function () {
  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (base.includes('/session-detail/')) return `../${path}`;
    if (base.includes('/home/')) return `../${path}`;
    return path;
  }

  /**
   * @param {object} mentor
   * @param {string} mentor.name
   * @param {string} mentor.role
   * @param {string} mentor.advice
   * @param {string} mentor.photo
   * @param {string} [mentor.recordatorioPhoto] — asset ya recortado/compuesto
   *   (mismo tipo que photo-block-cardespecialidad-[nombre].png); se usa tal
   *   cual en vez de componer el recorte con máscara CSS en runtime.
   */
  function render(mentor) {
    if (!mentor) return '';

    const photoSrc = mentor.recordatorioPhoto || mentor.photo;

    return `
      <article class="ConsejoMentor" aria-label="Consejo de mentor">
        <div class="ConsejoMentor__header">
          <div class="ConsejoMentor__info">
            <p class="ConsejoMentor__name" title="${mentor.name}">${mentor.name}</p>
            <p class="ConsejoMentor__role">${mentor.role}</p>
          </div>
          <div class="ConsejoMentor__photo-wrap" aria-hidden="true">
            <img
              class="ConsejoMentor__photo"
              src="${resolveAsset(photoSrc)}"
              alt=""
              width="76"
              height="100"
            />
          </div>
        </div>
        <div class="ConsejoMentor__body">
          <p class="ConsejoMentor__advice">${mentor.advice}</p>
        </div>
      </article>
    `;
  }

  window.ConsejoMentor = { render, resolveAsset };
})();
