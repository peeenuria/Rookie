/**
 * DateFormat — formateo de fechas en español (meses siempre en minúscula).
 */
(function () {
  const monthNames = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const weekdayNamesCapitalized = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  const weekdayNamesLowercase = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];

  function monthName(date) {
    return monthNames[date.getMonth()];
  }

  /** Martes, 14 de julio */
  function formatDateLabel(date) {
    const weekday = weekdayNamesCapitalized[date.getDay()];
    return `${weekday}, ${date.getDate()} de ${monthName(date)}`;
  }

  /** martes 14 de julio */
  function formatToastDateLabel(date) {
    const weekday = weekdayNamesLowercase[date.getDay()];
    return `${weekday} ${date.getDate()} de ${monthName(date)}`;
  }

  /** Hoy, 14 de julio */
  function formatTodayLabel(date) {
    return `Hoy, ${date.getDate()} de ${monthName(date)}`;
  }

  /** 10–16 julio o 28 julio – 3 agosto */
  function formatWeekRangeLabel(weekStart, weekEnd) {
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.getDate()}–${weekEnd.getDate()} ${monthName(weekStart)}`;
    }

    return `${weekStart.getDate()} ${monthName(weekStart)} – ${weekEnd.getDate()} ${monthName(weekEnd)}`;
  }

  /** julio 2026 */
  function formatMonthYear(date) {
    return `${monthName(date)} ${date.getFullYear()}`;
  }

  /** Fecha real del sistema en formato YYYY-MM-DD (zona horaria local). */
  function getTodayIso() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** julio-agosto 2026 */
  function formatMonthRangeBanner(first, last) {
    const name1 = monthName(first);
    const name2 = monthName(last);
    const y1 = first.getFullYear();
    const y2 = last.getFullYear();

    if (first.getMonth() === last.getMonth() && y1 === y2) {
      return `${name1} ${y1}`;
    }

    if (y1 === y2) {
      return `${name1}-${name2} ${y1}`;
    }

    return `${name1} ${y1}-${name2} ${y2}`;
  }

  window.DateFormat = {
    monthNames,
    weekdayNamesCapitalized,
    weekdayNamesLowercase,
    monthName,
    formatDateLabel,
    formatToastDateLabel,
    formatTodayLabel,
    formatWeekRangeLabel,
    formatMonthYear,
    formatMonthRangeBanner,
    getTodayIso,
  };
})();
