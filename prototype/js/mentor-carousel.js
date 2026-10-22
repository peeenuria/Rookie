/**
 * Carrusel vertical de mentor cards — escala/opacidad por proximidad al centro
 * + snap con micro-bounce (spring suave).
 */
(function () {
  const SIDE_SCALE = 0.92;
  const SIDE_OPACITY = 0.7;
  const ACTIVE_SCALE = 1;
  const ACTIVE_OPACITY = 1;
  const DRAG_CLICK_THRESHOLD = 10;
  /** Spring: ligero overshoot, asentamiento rápido (sin presión). */
  const SPRING_STIFFNESS = 0.14;
  const SPRING_DAMPING = 0.72;
  const SPRING_REST_PX = 0.35;
  const SPRING_REST_V = 0.08;

  let scroller = null;
  let track = null;
  let rafFocus = 0;
  let rafSpring = 0;
  let springActive = false;
  let pointerDragging = false;
  let pointerId = null;
  let dragStartY = 0;
  let dragStartScroll = 0;
  let dragMoved = false;
  let suppressClick = false;
  let reducedMotion = false;
  let downTarget = null;
  let redispatching = false;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getItems() {
    if (!track) return [];
    return Array.from(track.querySelectorAll(':scope > .mentor-item'));
  }

  function cardStep() {
    const items = getItems();
    if (items.length < 2) {
      const only = items[0];
      return only ? only.getBoundingClientRect().height : 0;
    }
    const a = items[0].getBoundingClientRect();
    const b = items[1].getBoundingClientRect();
    return Math.abs(b.top - a.top) || a.height;
  }

  /**
   * Centro óptico para escala/opacidad/nearest.
   * Con pad superior reducido (gap Figma), la 1ª card reposa por encima del
   * centro geométrico; mezclamos el centro hacia ella al inicio del scroll
   * para que siga viéndose activa sin cambiar el snap de las demás.
   */
  function getFocusCenterY(scrollerRect, items) {
    const geoFromTop = scrollerRect.height / 2;
    let centerFromTop = geoFromTop;
    if (track && items.length) {
      const trackStyle = getComputedStyle(track);
      const padTop = Number.parseFloat(trackStyle.paddingTop) || 0;
      const padBottom = Number.parseFloat(trackStyle.paddingBottom) || 0;
      const itemH = items[0].getBoundingClientRect().height;
      const step = cardStep() || scrollerRect.height;

      const firstRestCenter = padTop + itemH / 2;
      const topOffset = geoFromTop - firstRestCenter;
      if (topOffset > 0.5) {
        const topMix = 1 - Math.min(1, Math.max(0, scroller.scrollTop / step));
        centerFromTop = geoFromTop - topOffset * topMix;
      }

      /* Padding inferior reducido (mismo gap que entre tarjetas) — la última
         tarjeta ya no puede alcanzar el centro geométrico al hacer scroll.
         Reflejo simétrico del ajuste anterior para que siga contando como
         "activa" en vez de quedarse en el estado lateral (atenuada). */
      const lastRestCenter = scrollerRect.height - padBottom - itemH / 2;
      const bottomOffset = lastRestCenter - geoFromTop;
      if (bottomOffset > 0.5) {
        const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
        const distFromEnd = Math.max(0, maxScroll - scroller.scrollTop);
        const bottomMix = 1 - Math.min(1, distFromEnd / step);
        centerFromTop = centerFromTop + bottomOffset * bottomMix;
      }
    }
    return scrollerRect.top + centerFromTop;
  }

  function updateFocusFromScroll() {
    if (!scroller || !track) return;
    const items = getItems();
    if (!items.length) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const centerY = getFocusCenterY(scrollerRect, items);
    const step = cardStep() || scrollerRect.height;
    const halfStep = step / 2;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const dist = Math.abs(itemCenter - centerY);
      const t = Math.max(0, Math.min(1, 1 - dist / halfStep));
      const scale = SIDE_SCALE + (ACTIVE_SCALE - SIDE_SCALE) * t;
      const opacity = SIDE_OPACITY + (ACTIVE_OPACITY - SIDE_OPACITY) * t;
      item.style.setProperty('--mentor-card-scale', scale.toFixed(4));
      item.style.setProperty('--mentor-card-opacity', opacity.toFixed(4));
      item.classList.toggle('is-active', t > 0.85);
    });
  }

  function scheduleFocusUpdate() {
    if (rafFocus) return;
    rafFocus = requestAnimationFrame(() => {
      rafFocus = 0;
      updateFocusFromScroll();
    });
  }

  function nearestIndex() {
    const items = getItems();
    if (!items.length || !scroller) return 0;
    const scrollerRect = scroller.getBoundingClientRect();
    const centerY = getFocusCenterY(scrollerRect, items);
    let best = 0;
    let bestDist = Infinity;
    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height / 2 - centerY);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }

  function scrollTopForIndex(index) {
    const items = getItems();
    const item = items[index];
    if (!item || !scroller) return 0;
    const scrollerRect = scroller.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const itemCenter = itemRect.top + itemRect.height / 2;
    /* Snap sigue el centro geométrico: 1ª card queda arriba (pad top corto);
       el resto se centra; la última usa el pad bottom completo. */
    const scrollerCenter = scrollerRect.top + scrollerRect.height / 2;
    return scroller.scrollTop + (itemCenter - scrollerCenter);
  }

  function stopSpring() {
    if (rafSpring) {
      cancelAnimationFrame(rafSpring);
      rafSpring = 0;
    }
    springActive = false;
    if (scroller) scroller.classList.remove('is-snapping');
  }

  function springToIndex(index) {
    if (!scroller) return;
    const items = getItems();
    if (!items.length) return;
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    const target = scrollTopForIndex(clamped);

    if (reducedMotion) {
      scroller.scrollTop = target;
      updateFocusFromScroll();
      return;
    }

    stopSpring();
    springActive = true;
    scroller.classList.add('is-snapping');

    let y = scroller.scrollTop;
    let v = 0;

    const tick = () => {
      if (!scroller || !springActive) return;
      const force = (target - y) * SPRING_STIFFNESS;
      v = (v + force) * SPRING_DAMPING;
      y += v;
      scroller.scrollTop = y;
      updateFocusFromScroll();

      if (Math.abs(target - y) < SPRING_REST_PX && Math.abs(v) < SPRING_REST_V) {
        scroller.scrollTop = target;
        updateFocusFromScroll();
        stopSpring();
        return;
      }
      rafSpring = requestAnimationFrame(tick);
    };

    rafSpring = requestAnimationFrame(tick);
  }

  function snapNearest() {
    springToIndex(nearestIndex());
  }

  function onScroll() {
    if (springActive) return;
    scheduleFocusUpdate();
  }

  function onPointerDown(event) {
    if (!scroller || event.button != null && event.button !== 0) return;

    stopSpring();
    pointerDragging = true;
    pointerId = event.pointerId;
    dragStartY = event.clientY;
    dragStartScroll = scroller.scrollTop;
    dragMoved = false;
    suppressClick = false;
    downTarget = event.target;
    scroller.classList.add('is-dragging');
    scroller.classList.remove('is-moved');

    try {
      scroller.setPointerCapture(event.pointerId);
    } catch (_) {
      /* ignore */
    }
  }

  function onPointerMove(event) {
    if (!pointerDragging || !scroller || event.pointerId !== pointerId) return;
    const dy = event.clientY - dragStartY;
    if (Math.abs(dy) > DRAG_CLICK_THRESHOLD) {
      dragMoved = true;
      suppressClick = true;
      scroller.classList.add('is-moved');
    }
    scroller.scrollTop = dragStartScroll - dy;
    scheduleFocusUpdate();
    event.preventDefault();
  }

  function onPointerUp(event) {
    if (!pointerDragging || event.pointerId !== pointerId) return;
    pointerDragging = false;
    pointerId = null;
    if (scroller) {
      scroller.classList.remove('is-dragging');
      scroller.classList.remove('is-moved');
      try {
        scroller.releasePointerCapture(event.pointerId);
      } catch (_) {
        /* ignore */
      }
    }
    snapNearest();
  }

  function onClickCapture(event) {
    if (redispatching) return;

    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
      downTarget = null;
      return;
    }

    /* setPointerCapture retargets the resulting click to `scroller` even on a
       plain tap (no drag) — redispatch it on the element that was actually
       pressed so delegated listeners (e.g. mentor-card clicks) still fire. */
    if (downTarget && downTarget !== event.target) {
      event.preventDefault();
      event.stopPropagation();
      const target = downTarget;
      downTarget = null;
      redispatching = true;
      target.click();
      redispatching = false;
      return;
    }

    downTarget = null;
  }

  function onKeyDown(event) {
    if (!scroller || !track) return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const dir = event.key === 'ArrowDown' ? 1 : -1;
    springToIndex(nearestIndex() + dir);
  }

  function bind() {
    if (!scroller) return;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('pointerdown', onPointerDown, { passive: true });
    scroller.addEventListener('pointermove', onPointerMove, { passive: false });
    scroller.addEventListener('pointerup', onPointerUp, { passive: true });
    scroller.addEventListener('pointercancel', onPointerUp, { passive: true });
    scroller.addEventListener('click', onClickCapture, true);
    scroller.addEventListener('keydown', onKeyDown);
  }

  function unbind() {
    if (!scroller) return;
    scroller.removeEventListener('scroll', onScroll);
    scroller.removeEventListener('pointerdown', onPointerDown);
    scroller.removeEventListener('pointermove', onPointerMove);
    scroller.removeEventListener('pointerup', onPointerUp);
    scroller.removeEventListener('pointercancel', onPointerUp);
    scroller.removeEventListener('click', onClickCapture, true);
    scroller.removeEventListener('keydown', onKeyDown);
  }

  function destroy() {
    stopSpring();
    if (rafFocus) {
      cancelAnimationFrame(rafFocus);
      rafFocus = 0;
    }
    unbind();
    scroller = null;
    track = null;
  }

  function syncEdgePadding() {
    if (!scroller || !track) return;
    const items = getItems();
    if (!items.length) return;
    const itemHeight = items[0].getBoundingClientRect().height;
    const pad = Math.max(0, (scroller.clientHeight - itemHeight) / 2);
    /* Mismo hueco que stepper → título (.mentor-catalog__header padding-top = --spacer-4) */
    const gapRaw = getComputedStyle(document.documentElement)
      .getPropertyValue('--spacer-4')
      .trim();
    const gapTop = Number.parseFloat(gapRaw);
    const padTop = Math.min(pad, Number.isFinite(gapTop) ? gapTop : 16);
    /* Bottom: mismo gap que entre tarjetas, no la reserva de centrado
       (evita el hueco grande tras la última tarjeta). */
    const cardGapRaw = getComputedStyle(document.documentElement)
      .getPropertyValue('--mentor-carousel-gap')
      .trim();
    const cardGap = Number.parseFloat(cardGapRaw);
    const padBottom = Math.min(pad, Number.isFinite(cardGap) ? cardGap : 12);
    track.style.setProperty('--carousel-pad', `${pad}px`);
    track.style.setProperty('--carousel-pad-top', `${padTop}px`);
    track.style.setProperty('--carousel-pad-bottom', `${padBottom}px`);
  }

  function refresh() {
    if (!scroller || !track) return;
    reducedMotion = prefersReducedMotion();
    syncEdgePadding();
    updateFocusFromScroll();
  }

  /**
   * @param {HTMLElement} listEl — #mentor-list (track)
   * @param {HTMLElement} [wrapEl] — .mentor-catalog__list-wrap (scroller)
   */
  function mount(listEl, wrapEl) {
    destroy();
    track = listEl;
    scroller = wrapEl || listEl.parentElement;
    if (!track || !scroller) return;

    reducedMotion = prefersReducedMotion();
    scroller.classList.add('mentor-carousel');
    track.classList.add('mentor-carousel__track');
    scroller.setAttribute('tabindex', '0');
    scroller.setAttribute('role', 'region');
    scroller.setAttribute('aria-roledescription', 'carrusel');
    scroller.setAttribute('aria-label', 'Mentores disponibles');

    bind();
    requestAnimationFrame(() => {
      syncEdgePadding();
      requestAnimationFrame(() => {
        updateFocusFromScroll();
        springToIndex(0);
      });
    });
  }

  window.addEventListener('resize', () => {
    if (window.MentorCarousel) window.MentorCarousel.refresh();
  });

  window.MentorCarousel = {
    mount,
    refresh,
    destroy,
    snapNearest,
  };
})();
