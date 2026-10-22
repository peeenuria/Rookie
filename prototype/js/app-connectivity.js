/**
 * AppConnectivity — escenarios de red / carga compartidos (?scenario=)
 */
(function () {
  const SCENARIO_KEY = 'rookie.appScenario';

  const SCENARIOS = {
    CARGANDO: 'cargando',
    ERROR_CARGA: 'error-carga',
    SIN_CONEXION: 'sin-conexion',
  };

  function readScenarioFromUrl() {
    const fromSearch = new URLSearchParams(window.location.search).get('scenario');
    if (fromSearch) return fromSearch;

    const href = window.location.href;
    const queryStart = href.indexOf('?');
    if (queryStart === -1) return null;

    const hashStart = href.indexOf('#');
    const queryEnd = hashStart !== -1 && hashStart > queryStart ? hashStart : href.length;
    return new URLSearchParams(href.slice(queryStart + 1, queryEnd)).get('scenario');
  }

  function getScenario() {
    const fromUrl = readScenarioFromUrl();
    if (fromUrl) {
      sessionStorage.setItem(SCENARIO_KEY, fromUrl);
      return fromUrl;
    }
    return sessionStorage.getItem(SCENARIO_KEY);
  }

  function clearScenario() {
    sessionStorage.removeItem(SCENARIO_KEY);
  }

  function isOffline() {
    if (getScenario() === SCENARIOS.SIN_CONEXION) return true;
    return typeof navigator !== 'undefined' && navigator.onLine === false;
  }

  function isLoadingScenario() {
    const scenario = getScenario();
    return scenario === SCENARIOS.CARGANDO || scenario === SCENARIOS.ERROR_CARGA;
  }

  function shouldPersistLoading() {
    return getScenario() === SCENARIOS.ERROR_CARGA;
  }

  function resolveAfterLoading(callback, delayMs) {
    if (shouldPersistLoading()) return;
    window.setTimeout(callback, delayMs);
  }

  window.AppConnectivity = {
    SCENARIO_KEY,
    SCENARIOS,
    getScenario,
    clearScenario,
    isOffline,
    isLoadingScenario,
    shouldPersistLoading,
    resolveAfterLoading,
  };
})();
