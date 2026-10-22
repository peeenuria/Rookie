/**
 * Panel dev — especificación Figma 4.3 (dev-spec-4-3.html o ?debug=true)
 */
(function () {
  const spec = window.FIGMA_4_3;
  const devPanel = document.getElementById('dev-panel');
  if (!spec || !devPanel) return;

  const section = document.createElement('div');
  section.className = 'dev-panel__section';
  section.innerHTML = `
    <h2>Especificación 4.3</h2>
    <dl>
      <dt>Frame</dt><dd>${spec.frameNodeId}</dd>
      <dt>4.3.1.1 Cita del día</dt><dd>${spec.screens.homeInitial}</dd>
      <dt>4.3.1.2 Puente Meets</dt><dd>${spec.screens.meetBridge}</dd>
      <dt>Puente carga</dt><dd>${spec.screens.meetBridgeLoading} (${spec.bridgeLoading.durationMs}ms → resumen)</dd>
      <dt>4.3.1.3 Meets externo</dt><dd>${spec.screens.meetExternal} (solo dev; HP omite)</dd>
      <dt>4.3.1.4 Resumen post-llamada</dt><dd>${spec.screens.callSummary}</dd>
      <dt>4.3.1.5 Home actualizado</dt><dd>${spec.screens.homeUpdated}</dd>
      <dt>Ventana unión</dt><dd>${spec.joinWindowMinutes} min antes de la cita</dd>
      <dt>Mock demo</dt><dd>?mock=${spec.mockParams.appointmentDay}</dd>
      <dt>Seguimiento</dt><dd>+${spec.followUpDaysAfter} días desde la primera cita</dd>
      <dt>CTA resumen HP</dt><dd>${spec.copy.goToUpdatedPlan}</dd>
      <dt>Meets stub</dt><dd>${spec.copy.meetStubSimulate}</dd>
      <dt>4.3.3.x (Figma 4.4.2.x)</dt><dd>BottomSheet ${spec.screens.bottomSheetNoShow}</dd>
    </dl>
    <p class="dev-panel__nav-label">Navegación 4.3 Happy Path (requiere booking en sesión)</p>
    <ul class="dev-panel__links">
      <li><a href="index.html?mock=appointment-day#home-initial">Home inicial (mock día cita)</a></li>
      <li><a href="index.html?mock=appointment-day#meet-bridge">Puente Meets → carga → resumen</a></li>
      <li><a href="index.html?mock=appointment-day#meet-external">Meets stub (dev)</a></li>
      <li><a href="index.html?mock=appointment-day#call-summary">Resumen post-llamada</a></li>
      <li><a href="index.html?mock=appointment-day#home-updated">Home actualizado</a></li>
    </ul>
    <p class="dev-panel__nav-label">Edge cases (Fases 2–4)</p>
    <ul class="dev-panel__links">
      <li><a href="index.html?scenario=${spec.scenarios.entraAntes}#home-initial">Entra antes de tiempo</a></li>
      <li><a href="index.html?scenario=${spec.scenarios.sinResumen}&amp;mock=${spec.mockParams.appointmentDay}#meet-bridge">Sin resumen mentor</a></li>
      <li><a href="index.html?scenario=${spec.scenarios.mentorNoAparece}&amp;mock=${spec.mockParams.appointmentDay}#meet-bridge">Mentor no aparece</a></li>
    </ul>
  `;
  devPanel.appendChild(section);
})();
