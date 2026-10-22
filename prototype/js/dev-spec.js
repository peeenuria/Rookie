/**
 * Renderiza el panel de especificación Figma (solo dev-spec.html o ?debug=true)
 */
(function () {
  const spec = window.FIGMA_4_1;
  const devPanel = document.getElementById('dev-panel');
  if (!spec || !devPanel) return;

  const b = spec.buttons;
  devPanel.innerHTML = `
    <h2>Especificación 4.1</h2>
    <dl>
      <dt>Frame</dt><dd>${spec.frameNodeId}</dd>
      <dt>Pantalla catálogo</dt><dd>12528:42310 (4.1.2)</dd>
      <dt>4.1.3 Elegir</dt><dd>${b.selected.example} <em>(patrón: ${b.selected.chooseTemplate})</em></dd>
      <dt>4.1.4 Primary</dt><dd>${b.confirmation.primaryTemplate} <em>(sustituye {miRole})</em></dd>
      <dt>Estado pulsado</dt><dd>Card sin cambio visual — biografía expandida debajo</dd>
      <dt>Assets PNG</dt><dd>${Object.keys(spec.assets.mentors).length} fotos card + 1 hero confirmación</dd>
      <dt>Spacing título→subtítulo</dt><dd>18px (Figma y=198→216)</dd>
      <dt>Spacing subtítulo→lista</dt><dd>18px (Figma y=272→290)</dd>
      <dt>Gap entre cards</dt><dd>24px</dd>
      <dt>Gap interno card</dt><dd>8px</dd>
      <dt>Hero 4.1.4</dt><dd>Encuadre por mentor (<code>object-position</code> + <code>heroPhotoSize</code>). Laura OK. Marcos, Sofía y David: pendiente de pulido visual fino (fotos card con sujeto desplazado a la derecha).</dd>
    </dl>
  `;
})();
