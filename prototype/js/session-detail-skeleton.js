/**
 * SessionDetailSkeleton — shimmer Detalle de sesión (Figma 12641:2443)
 */
(function () {
  function renderIntroSkeleton() {
    const layout = window.FIGMA_SESSION_DETAIL?.layout ?? {};
    const height = layout.introHeightExpanded ?? layout.heroHeight ?? 500;

    return `
      <div class="IntroDetalleSesion__anchor session-detail-skeleton__intro" aria-hidden="true">
        <div class="session-detail-skeleton__hero" style="height:${height}px">
          ${window.ShimmerBlock.render({ height: '100%', radius: 0, className: 'session-detail-skeleton__hero-fill' })}
          <div class="session-detail-skeleton__hero-content">
            ${window.ShimmerBlock.render({ width: '55%', height: 20, radius: 4 })}
            ${window.ShimmerBlock.render({ width: '72%', height: 34, radius: 4 })}
            ${window.ShimmerBlock.render({ width: '100%', height: 1, radius: 0, className: 'session-detail-skeleton__hero-divider' })}
            <div class="session-detail-skeleton__hero-meta">
              ${window.ShimmerBlock.render({ width: 80, height: 47, radius: 4 })}
              ${window.ShimmerBlock.render({ width: 80, height: 47, radius: 4 })}
              ${window.ShimmerBlock.render({ width: 56, height: 47, radius: 4 })}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAccordionSkeleton(count) {
    const total = count ?? window.FIGMA_SESSION_DETAIL?.loading?.accordionCount ?? 3;

    return Array.from({ length: total }, () => `
      <article class="SessionAccordionCard session-detail-skeleton__accordion" aria-hidden="true">
        <div class="session-detail-skeleton__accordion-header">
          <div class="session-detail-skeleton__accordion-text">
            ${window.ShimmerBlock.render({ width: '100%', height: 34, radius: 4 })}
            ${window.ShimmerBlock.render({ width: '68%', height: 18, radius: 4 })}
          </div>
          ${window.ShimmerBlock.render({ width: 54, height: 34, radius: 4 })}
        </div>
      </article>
    `).join('');
  }

  function renderMentorSkeleton() {
    return `
      <article class="ConsejoMentor session-detail-skeleton__mentor" aria-hidden="true">
        <div class="session-detail-skeleton__mentor-header">
          <div class="session-detail-skeleton__mentor-info">
            ${window.ShimmerBlock.render({ width: 140, height: 14, radius: 4 })}
            ${window.ShimmerBlock.render({ width: 100, height: 12, radius: 4 })}
          </div>
          ${window.ShimmerBlock.render({ width: 76, height: 100, radius: 0, className: 'session-detail-skeleton__mentor-photo' })}
        </div>
        <div class="session-detail-skeleton__mentor-body">
          ${window.ShimmerBlock.render({ width: '100%', height: 10, radius: 4 })}
          ${window.ShimmerBlock.render({ width: '88%', height: 10, radius: 4 })}
          ${window.ShimmerBlock.render({ width: '72%', height: 10, radius: 4 })}
        </div>
      </article>
    `;
  }

  function renderActionsSkeleton() {
    return `
      <div class="session-detail__actions session-detail-skeleton__actions" aria-hidden="true">
        ${window.ShimmerBlock.render({ height: 48, radius: 6 })}
        ${window.ShimmerBlock.render({ height: 48, radius: 6 })}
      </div>
    `;
  }

  function render() {
    const spec = window.FIGMA_SESSION_DETAIL;
    const descriptionTitle = spec?.sections?.description ?? 'Descripción de la sesión';
    const mentorTitle = spec?.sections?.mentorAdvice ?? 'Consejo de tu mentor';

    return `
      <section
        class="screen screen--session-detail is-active session-detail--loading"
        aria-busy="true"
        aria-label="Cargando detalle de sesión"
      >
        <div class="session-detail">
          <div class="session-detail__scroll" id="session-detail-scroll">
            ${renderIntroSkeleton()}
            <div class="session-detail__scroll-inner">
              <section class="session-detail__section" aria-hidden="true">
                ${window.ShimmerBlock.render({
                  width: 220,
                  height: 22,
                  radius: 4,
                  className: 'session-detail-skeleton__section-title',
                })}
                <div class="SessionAccordion">${renderAccordionSkeleton()}</div>
              </section>

              <section class="session-detail__section" aria-hidden="true">
                ${window.ShimmerBlock.render({
                  width: 190,
                  height: 22,
                  radius: 4,
                  className: 'session-detail-skeleton__section-title',
                })}
                ${renderMentorSkeleton()}
              </section>

              ${renderActionsSkeleton()}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  window.SessionDetailSkeleton = { render };
})();
