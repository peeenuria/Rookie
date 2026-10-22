/**
 * SecciónMentor — "Mi Mentor" (Figma 13707:13164)
 * Perfil del mentor asignado: foto hero, datos, atributos y CardSalidaGrupal.
 */
(function () {
  const spec = window.FIGMA_MI_MENTOR;

  function resolveAsset(path) {
    const base = window.location.pathname.replace(/\\/g, '/');
    if (base.includes('/mi-mentor/')) return `../${path}`;
    return path;
  }

  function renderPills(tags) {
    return (tags || []).map((tag) => `<span class="pill">${tag}</span>`).join('');
  }

  function renderGroupOutingCard(mentor, details) {
    const outing = details?.groupOuting;
    if (!outing) return '';
    const assets = spec.assets;
    const scheduleHtml = (outing.scheduleLines || []).join('<br />');

    return `
      <article class="CardSalidaGrupal" aria-label="${spec.copy.groupOutingPrefix} ${mentor.firstName}">
        <div class="CardSalidaGrupal__content">
          <div class="CardSalidaGrupal__heading">
            <p class="CardSalidaGrupal__title">${spec.copy.groupOutingPrefix}</p>
            <p class="CardSalidaGrupal__name">${(mentor.firstName || mentor.name || '').toUpperCase()}</p>
          </div>
          <div class="CardSalidaGrupal__details">
            <div class="CardSalidaGrupal__detail-row">
              <img class="CardSalidaGrupal__detail-icon" src="${resolveAsset(assets.iconCalendarDays)}" alt="" width="16" height="16" />
              <p class="CardSalidaGrupal__detail-text">${scheduleHtml}</p>
            </div>
            <div class="CardSalidaGrupal__detail-row">
              <img class="CardSalidaGrupal__detail-icon" src="${resolveAsset(assets.iconMapPinned)}" alt="" width="16" height="16" />
              <p class="CardSalidaGrupal__detail-text">${outing.location}</p>
            </div>
          </div>
        </div>
        <div class="CardSalidaGrupal__photo-wrap" aria-hidden="true">
          <img class="CardSalidaGrupal__photo" src="${resolveAsset(assets.groupOutingPhoto)}" alt="" width="160" height="221" />
        </div>
      </article>
    `;
  }

  /**
   * @param {object} mentor — entrada de window.FIGMA_4_1.mentors
   */
  function render(mentor) {
    if (!spec || !mentor) return '';

    const details = spec.mentorDetails?.[mentor.id];
    const fullName = details?.fullName || mentor.name;
    const bio = details?.bio || '';
    const heroSrc = resolveAsset(mentor.heroPhoto || mentor.photo);
    const heroObjectPosition = mentor.heroObjectPosition || 'center top';

    return `
      <section
        class="screen screen--mi-mentor is-active SeccionMentor"
        id="seccion-mentor"
        data-node-id="${spec.screenNodeId}"
        aria-label="Mi mentor"
      >
        <div class="SeccionMentor__scroll">
          <div class="SeccionMentor__hero" aria-hidden="true">
            <img class="SeccionMentor__hero-photo" src="${heroSrc}" alt="" style="object-position: ${heroObjectPosition}" />
          </div>
          <div class="SeccionMentor__text-block">
            <p class="SeccionMentor__assigned-label">${spec.copy.assignedLabel}</p>
            <h1 class="SeccionMentor__name">${fullName}</h1>
            <p class="SeccionMentor__specialty">${mentor.specialty}</p>
            ${bio ? `<p class="SeccionMentor__bio">${bio}</p>` : ''}
            <div class="SeccionMentor__pills pill-list">${renderPills(mentor.tags)}</div>
            <p class="SeccionMentor__outing-days">${spec.copy.outingDaysPrefix} ${mentor.outingDays || ''}</p>
            ${renderGroupOutingCard(mentor, details)}
          </div>
        </div>
      </section>
    `;
  }

  function mount(target, mentor) {
    const root = target || document.querySelector('.phone-shell__body');
    if (!root) return;
    root.innerHTML = render(mentor);
  }

  window.SeccionMentor = { render, mount };
})();
