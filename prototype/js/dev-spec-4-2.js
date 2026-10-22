/**
 * Panel dev — especificación Figma 4.2 (?debug=true o dev-spec-4-2.html)
 */
(function () {
  const spec = window.FIGMA_4_2;
  const devPanel = document.getElementById('dev-panel');
  if (!spec || !devPanel) return;

  const section = document.createElement('div');
  section.className = 'dev-panel__section';
  section.innerHTML = `
    <h2>Especificación 4.2</h2>
    <dl>
      <dt>Frame</dt><dd>${spec.frameNodeId}</dd>
      <dt>Frame agenda</dt><dd>${spec.screens.agenda}</dd>
      <dt>4.2.1 Elegir día</dt><dd>${spec.screens.pickDay}</dd>
      <dt>4.2.4 Confirmar slot</dt><dd>${spec.screens.confirmSlot}</dd>
      <dt>4.2.5 Confirmada</dt><dd>${spec.screens.confirmed}</dd>
      <dt>Toast confirmación</dt><dd>${spec.screens.slotConfirmToast}</dd>
      <dt>Sin huecos (Figma)</dt><dd>${spec.screens.sinHuecosEmpty}</dd>
      <dt>Slot ocupado (Figma)</dt><dd>${spec.screens.slotOcupadoToast}</dd>
      <dt>CTA confirmar</dt><dd>${spec.buttons.confirm}</dd>
      <dt>CTA plan</dt><dd>${spec.buttons.goToPlan}</dd>
      <dt>Sin huecos</dt><dd>${spec.scenarios.sinHuecos}</dd>
      <dt>Slot ocupado</dt><dd>${spec.scenarios.slotOcupado}</dd>
      <dt>Sin conexión</dt><dd>${spec.scenarios.sinConexion} (patrón 4.1.1)</dd>
      <dt>Perfiles semana</dt><dd>+0 variable · +1 variableAlt · +2 partialDays (L+J) · +3 sinHuecos · +4 variableAlt</dd>
      <dt>Calendario</dt><dd>Gregoriano real — semana lun–dom, +${spec.availability.maxWeeksForward} sem max adelante</dd>
      <dt>Home recordatorio</dt><dd>4.3 — <a href="#home-initial">#home-initial</a> (requiere booking)</dd>
    </dl>
    <p class="dev-panel__nav-label">Navegación 4.2 (requiere mentor en sesión)</p>
    <ul class="dev-panel__links">
      <li><a href="index.html#appointment">Agenda</a></li>
      <li><a href="index.html?scenario=sin-conexion#appointment">Agenda sin conexión</a></li>
      <li><a href="index.html?scenario=sin-huecos#appointment">Sin huecos</a></li>
      <li><a href="index.html?scenario=slot-ocupado#appointment">Slot ocupado</a></li>
      <li><a href="index.html#appointment-confirmed">Confirmación</a></li>
      <li><a href="index.html#home-initial">Home 4.3</a></li>
    </ul>
  `;
  devPanel.appendChild(section);
})();
