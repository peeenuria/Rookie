/**
 * CitaConfirmada — entrada standalone
 */
(function () {
  const spec = window.FIGMA_CITA_CONFIRMADA;
  if (!window.CitaConfirmada) return;

  const WEEKDAY_LOWER = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function parseIso(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function getBooking() {
    try {
      const raw = sessionStorage.getItem('appointmentBooking');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function getMentor(booking) {
    const id = booking?.mentorId || sessionStorage.getItem('selectedMentorId');
    return window.FIGMA_4_1?.mentors?.find((m) => m.id === id) || null;
  }

  function formatDateLabel(dayIso) {
    const date = parseIso(dayIso);
    if (window.DateFormat) return window.DateFormat.formatDateLabel(date);
    return dayIso;
  }

  /* Nombre + apellido(s) capitalizados solo primera letra (Maximiliano
     Etxebarria Goikoetxea) — formato específico de esta pantalla de
     resumen, distinto del "nombre + 1er apellido" que usan otras. */
  function formatFullNameTitleCase(rawName) {
    return String(rawName || '')
      .toLowerCase()
      .split(/[\s-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function buildState() {
    const booking = getBooking();
    const mentor = getMentor(booking);
    const details = window.FIGMA_MI_MENTOR?.mentorDetails?.[mentor?.id];

    return {
      mentorFullName: formatFullNameTitleCase(details?.fullName || mentor?.name),
      firstName: mentor?.firstName || '',
      dateLabel: booking?.dayIso ? formatDateLabel(booking.dayIso) : booking?.dateLabel || '',
      time: booking?.time || '',
      weekday: booking?.dayIso ? WEEKDAY_LOWER[parseIso(booking.dayIso).getDay()] : booking?.weekdayMeet || '',
    };
  }

  function bind() {
    document.getElementById('cita-confirmada-continue')?.addEventListener('click', () => {
      window.location.href = spec?.routes?.onContinue || '../home/index.html';
    });
  }

  function mount() {
    CitaConfirmada.mount(null, buildState());
    bind();

    if (window.AppointmentConfirmedCelebration) {
      requestAnimationFrame(() =>
        window.AppointmentConfirmedCelebration.play('#appointment-confirmed-check')
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
