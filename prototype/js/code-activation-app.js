/**
 * Historia 1.1 — Activación con código de compra
 */
(function () {
  const spec = window.FIGMA_1_1;
  if (!spec?.codeActivation) return;

  const codeSpec = spec.codeActivation;
  const bridgeSpec = codeSpec.bridge;
  const manualSpec = codeSpec.manual;
  const scannerSpec = codeSpec.scanner;
  const validationSpec = codeSpec.validation;
  const mockSpec = codeSpec.mock;
  const storageKeys = codeSpec.storageKeys;

  let cameraStream = null;
  let scannerHashListenerBound = false;
  let scanIntervalId = null;
  let mockScanTimeoutId = null;
  let barcodeDetector = null;
  let scannerActive = false;
  let usingMockPreview = true;
  let currentSheetState = 'standard';
  let scannerStaticDemo = false;
  let successNavigateTimeoutId = null;

  function resolveAssetBase() {
    const path = window.location.pathname;
    if (path.includes('/code/scanner/')) return '../../';
    if (path.includes('/code/manual/')) return '../../';
    if (path.includes('/code/')) return '../';
    if (path.includes('/activation/')) return '../';
    return '';
  }

  function resolveAsset(path) {
    if (!path) return '';
    if (/^https?:\/\//.test(path) || path.startsWith('/')) return path;
    const base = resolveAssetBase();
    if (path.startsWith('../') || path.startsWith('./')) {
      return `${base}${path.replace(/^\.\.\//, '')}`;
    }
    return `${base}${path}`;
  }

  function isActivationFlow() {
    return Boolean(document.getElementById('screen-splash'));
  }

  function navigateTo(key) {
    if (window.ActivationFlow?.navigateTo) {
      window.ActivationFlow.navigateTo(key);
      return;
    }

    const path = window.location.pathname;

    if (key === 'payment-success') {
      window.location.href = path.includes('/code/')
        ? `${resolveAssetBase()}payment/success/index.html`
        : '#payment-success';
      return;
    }

    if (path.includes('/code/manual/')) {
      if (key === 'code-bridge') {
        window.location.href = '../index.html';
        return;
      }
      if (key === 'code-scanner') {
        window.location.href = '../scanner/index.html';
        return;
      }
    }

    if (path.includes('/code/scanner/')) {
      if (key === 'code-bridge') {
        window.location.href = '../index.html';
        return;
      }
      if (key === 'code-manual') {
        window.location.href = '../manual/index.html';
        return;
      }
    }

    if (path.includes('/code/index.html') || /\/code\/?$/.test(path)) {
      if (key === 'code-manual') {
        window.location.href = 'manual/index.html';
        return;
      }
      if (key === 'code-scanner') {
        window.location.href = 'scanner/index.html';
        return;
      }
    }

    window.location.hash = key;
  }

  function onlyDigits(value) {
    return value.replace(/\D/g, '');
  }

  function isValidCodeFormat(value) {
    const digits = onlyDigits(value);
    return digits.length === validationSpec.codeLength;
  }

  function isValidPurchaseCode(value) {
    const digits = onlyDigits(value);
    if (!isValidCodeFormat(digits)) return false;
    if (mockSpec.usedCodes?.includes(digits)) return false;
    if (mockSpec.invalidCodes.includes(digits)) return false;
    if (mockSpec.validCodes.includes(digits)) return true;
    return !/^0+$/.test(digits);
  }

  function getCodeScanOutcome(value) {
    const digits = onlyDigits(value);
    if (!isValidCodeFormat(digits)) return 'readError';
    if (mockSpec.usedCodes?.includes(digits)) return 'alreadyUsed';
    if (mockSpec.invalidCodes.includes(digits)) return 'invalid';
    if (isValidPurchaseCode(digits)) return 'valid';
    return 'invalid';
  }

  function getScannerDemoMap() {
    return {
      ...(codeSpec.scannerScreenDemos || {}),
      ...(codeSpec.scannerSheetDemos || {}),
    };
  }

  function resolveScannerScreenKey(hashKey) {
    const demos = getScannerDemoMap();
    if (demos[hashKey]) return demos[hashKey];
    if (hashKey === 'code-scanner') return 'standard';
    return null;
  }

  function clearSuccessNavigateTimeout() {
    if (successNavigateTimeoutId !== null) {
      clearTimeout(successNavigateTimeoutId);
      successNavigateTimeoutId = null;
    }
  }

  function isScannerSheetVisible() {
    const sheet = document.getElementById('code-scanner-sheet');
    return Boolean(sheet && !sheet.classList.contains('is-hidden'));
  }

  function isCodeValidated() {
    return sessionStorage.getItem(storageKeys.codeValidated) === 'true';
  }

  function markCodeValidated() {
    sessionStorage.setItem(storageKeys.codeValidated, 'true');
  }

  function clearCodeValidated() {
    sessionStorage.removeItem(storageKeys.codeValidated);
  }

  function goToSuccess() {
    markCodeValidated();
    navigateTo('payment-success');
  }

  function renderTitleLines(lines, className) {
    return lines.map((line) => `<span class="${className}">${line}</span>`).join('');
  }

  function renderHelperLines(lines, className) {
    return lines
      .map((line) => `<span class="${className}">${line}</span>`)
      .join('');
  }

  function createCodeBridgeMarkup() {
    const backBar =
      window.BarraSuperiorBack?.render({
        id: 'code-bridge-back',
        variant: 'predeterminada',
      }) || '';

    return `
      <section
        class="screen screen--code-bridge"
        id="screen-code-bridge"
        aria-label="Activar código — escanear"
      >
        ${backBar}
        <div class="code-screen">
          <div class="code-screen__content">
            <div class="code-screen__stack">
              <h1 class="code-screen__title" id="code-bridge-title"></h1>
              <img
                class="code-screen__illustration"
                id="code-bridge-illustration"
                src=""
                alt=""
                width="250"
                height="250"
              />
              <p class="code-screen__instructions" id="code-bridge-instructions"></p>
              <div class="code-screen__actions">
                <button type="button" class="btn btn--primary" id="code-bridge-scan"></button>
                <div class="code-screen__manual-block">
                  <p class="code-screen__manual-helper" id="code-bridge-manual-helper"></p>
                  <button type="button" class="code-screen__link-btn" id="code-bridge-manual"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function createCodeManualMarkup() {
    const backBar =
      window.BarraSuperiorBack?.render({
        id: 'code-manual-back',
        variant: 'predeterminada',
      }) || '';

    return `
      <section
        class="screen screen--code-manual"
        id="screen-code-manual"
        aria-label="Activar código — manual"
      >
        ${backBar}
        <div class="code-screen">
          <div class="code-screen__content">
            <div class="code-screen__stack">
              <div class="code-screen__intro-block">
                <h1 class="code-screen__title" id="code-manual-title"></h1>
                <p class="code-screen__instructions" id="code-manual-instructions"></p>
              </div>

              <form class="code-manual-form" id="code-manual-form" novalidate>
                <div class="code-field" data-code-field>
                  <label class="code-field__label" for="code-manual-input" id="code-manual-label"></label>
                  <input
                    class="code-field__input"
                    id="code-manual-input"
                    name="purchase-code"
                    type="text"
                    inputmode="numeric"
                    autocomplete="off"
                    maxlength="13"
                  />
                  <p class="code-field__hint" id="code-manual-hint"></p>
                  <p class="code-field__error" id="code-manual-error" hidden></p>
                </div>
                <button
                  type="submit"
                  class="btn btn--primary btn--disabled"
                  id="code-manual-submit"
                  disabled
                ></button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function createCodeScannerMarkup() {
    const backBar =
      window.BarraSuperiorBack?.render({
        id: 'code-scanner-back',
        /* Fondo cámara oscuro → Variante4 / PressedClaro */
        variant: 'claro',
      }) || '';

    return `
      <section
        class="screen screen--code-scanner"
        id="screen-code-scanner"
        aria-label="Escanear código de barras"
      >
        <div class="code-scanner">
          ${backBar}
          <div class="code-scanner__viewport" id="code-scanner-viewport">
            <div class="code-scanner__preview-wrap" aria-hidden="true">
              <img
                class="code-scanner__preview-mock"
                id="code-scanner-preview-mock"
                src=""
                alt=""
              />
            </div>
            <img
              class="code-scanner__viewport-overlay"
              id="code-scanner-viewport-overlay"
              src=""
              alt=""
              hidden
            />
            <div class="code-scanner__overlay" aria-hidden="true">
              <div class="code-scanner__mask"></div>
              <div class="code-scanner__frame" id="code-scanner-frame">
                <span class="code-scanner__frame-corners" aria-hidden="true"></span>
                <span class="code-scanner__scan-line" aria-hidden="true"></span>
                <span class="code-scanner__frame-error" id="code-scanner-frame-error" hidden aria-hidden="true">
                  <img
                    class="code-scanner__frame-error-icon"
                    id="code-scanner-frame-error-icon"
                    src=""
                    alt=""
                    width="40"
                    height="40"
                  />
                </span>
                <span class="code-scanner__frame-success" id="code-scanner-frame-success" hidden aria-hidden="true">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                    <circle class="code-scanner__frame-success-circle" cx="28" cy="28" r="26" fill="currentColor" />
                    <path
                      class="code-scanner__frame-success-check"
                      d="M16.5 29.2L24.1 36.2L40 20.4"
                      stroke="#fff"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

          </div>

          <div class="code-scanner__sheet" id="code-scanner-sheet">
            <div class="code-scanner__sheet-body">
              <div class="code-scanner__sheet-intro">
                <h2 class="code-scanner__sheet-title" id="code-scanner-sheet-title"></h2>
                <p class="code-scanner__sheet-text" id="code-scanner-sheet-text"></p>
              </div>
              <img
                class="code-scanner__sheet-illustration"
                id="code-scanner-sheet-illustration"
                src=""
                alt=""
                width="150"
                height="150"
              />
              <div class="code-scanner__sheet-actions" id="code-scanner-sheet-actions">
                <p class="code-screen__manual-helper" id="code-scanner-manual-helper" hidden></p>
                <button type="button" class="code-screen__link-btn" id="code-scanner-manual" hidden></button>
                <p class="code-scanner__sheet-support" id="code-scanner-sheet-support" hidden></p>
              </div>
            </div>
          </div>

          <div
            class="code-scanner__permission-dialog"
            id="code-scanner-permission-dialog"
            hidden
            role="dialog"
            aria-modal="true"
            aria-labelledby="code-scanner-permission-title"
            aria-describedby="code-scanner-permission-message"
          >
            <button
              type="button"
              class="code-scanner__permission-backdrop"
              id="code-scanner-permission-backdrop"
              aria-label="Cerrar"
            ></button>
            <div class="code-scanner__permission-card">
              <h2 class="code-scanner__permission-title" id="code-scanner-permission-title"></h2>
              <p class="code-scanner__permission-message" id="code-scanner-permission-message"></p>
              <div class="code-scanner__permission-actions">
                <button type="button" class="code-scanner__permission-btn code-scanner__permission-btn--deny" id="code-scanner-permission-deny"></button>
                <button type="button" class="code-scanner__permission-btn code-scanner__permission-btn--allow" id="code-scanner-permission-allow"></button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function applyScannerLayoutTokens() {
    const scannerRoot = document.querySelector('.code-scanner');
    if (!scannerRoot) return;

    scannerRoot.style.setProperty('--scanner-frame-top', `${scannerSpec.frameTopPx ?? 152}px`);
    scannerRoot.style.setProperty('--scanner-frame-width', `${scannerSpec.frameWidthPx ?? 269}px`);
    scannerRoot.style.setProperty('--scanner-frame-height', `${scannerSpec.frameHeightPx ?? 148}px`);
    scannerRoot.style.setProperty(
      '--scanner-sheet-height',
      `${scannerSpec.sheetFixedHeightPx ?? 438}px`
    );
  }

  function initCodeBridge() {
    const title = document.getElementById('code-bridge-title');
    const illustration = document.getElementById('code-bridge-illustration');
    const instructions = document.getElementById('code-bridge-instructions');
    const scanBtn = document.getElementById('code-bridge-scan');
    const manualHelper = document.getElementById('code-bridge-manual-helper');
    const manualBtn = document.getElementById('code-bridge-manual');

    if (title) title.textContent = bridgeSpec.title;
    if (illustration && bridgeSpec.illustrationAsset) {
      illustration.src = resolveAsset(bridgeSpec.illustrationAsset);
      illustration.alt = '';
    }
    if (instructions) instructions.textContent = bridgeSpec.instructions;
    if (scanBtn) scanBtn.textContent = bridgeSpec.scanCta;
    if (manualHelper) {
      const helperLines = bridgeSpec.manualHelperLines || [];
      if (helperLines.length) {
        manualHelper.hidden = false;
        manualHelper.innerHTML = renderHelperLines(
          helperLines,
          'code-screen__manual-helper-line'
        );
      } else {
        manualHelper.hidden = true;
        manualHelper.innerHTML = '';
      }
    }
    if (manualBtn) manualBtn.textContent = bridgeSpec.manualCta;

    scanBtn?.addEventListener('click', () => navigateTo('code-scanner'));
    manualBtn?.addEventListener('click', () => navigateTo('code-manual'));

    window.BarraSuperiorBack?.bind('code-bridge-back', () => {
      navigateTo('plan-selection');
    });
  }

  function initCodeManual() {
    const title = document.getElementById('code-manual-title');
    const instructions = document.getElementById('code-manual-instructions');
    const label = document.getElementById('code-manual-label');
    const input = document.getElementById('code-manual-input');
    const hint = document.getElementById('code-manual-hint');
    const error = document.getElementById('code-manual-error');
    const submitBtn = document.getElementById('code-manual-submit');
    const form = document.getElementById('code-manual-form');
    const fieldWrap = form?.querySelector('[data-code-field]');

    window.BarraSuperiorBack?.bind('code-manual-back', () => navigateTo('code-bridge'));

    if (title && manualSpec.titleLines) {
      title.innerHTML = renderTitleLines(manualSpec.titleLines, 'code-screen__title-line');
    }
    if (instructions) instructions.textContent = manualSpec.instructions;
    if (label) label.textContent = manualSpec.fieldLabel;
    if (input) {
      input.placeholder = manualSpec.fieldPlaceholder;
      input.setAttribute('aria-describedby', 'code-manual-hint code-manual-error');
    }
    if (hint) {
      hint.id = 'code-manual-hint';
      hint.textContent = manualSpec.fieldHint;
    }
    if (error) error.id = 'code-manual-error';
    if (submitBtn) submitBtn.textContent = manualSpec.submitCta;

    function setFieldError(message) {
      if (!fieldWrap || !error || !hint || !input) return;
      if (!message) {
        error.hidden = true;
        error.textContent = '';
        hint.hidden = false;
        fieldWrap.classList.remove('code-field--error');
        input.removeAttribute('aria-invalid');
        return;
      }
      error.hidden = false;
      error.textContent = message;
      hint.hidden = true;
      fieldWrap.classList.add('code-field--error');
      input.setAttribute('aria-invalid', 'true');
    }

    function updateSubmitState() {
      if (!submitBtn || !input) return;
      const validFormat = isValidCodeFormat(input.value);
      submitBtn.disabled = !validFormat;
      submitBtn.classList.toggle('btn--disabled', !validFormat);
    }

    input?.addEventListener('input', () => {
      const digits = onlyDigits(input.value).slice(0, validationSpec.codeLength);
      if (input.value !== digits) input.value = digits;
      setFieldError(null);
      updateSubmitState();
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!input || submitBtn?.disabled) return;

      const value = input.value;
      if (!isValidCodeFormat(value)) {
        setFieldError(validationSpec.invalidFormat);
        return;
      }

      if (isValidPurchaseCode(value)) {
        goToSuccess();
        return;
      }

      setFieldError(validationSpec.invalidCode);
    });

    updateSubmitState();
  }

  function stopScanLoop() {
    if (scanIntervalId !== null) {
      clearInterval(scanIntervalId);
      scanIntervalId = null;
    }
    if (mockScanTimeoutId !== null) {
      clearTimeout(mockScanTimeoutId);
      mockScanTimeoutId = null;
    }
    document.getElementById('code-scanner-frame')?.classList.remove('is-scanning');
    document.getElementById('code-scanner-preview-mock')?.classList.remove('is-live');
  }

  function setPermissionDialogVisible(visible) {
    const dialog = document.getElementById('code-scanner-permission-dialog');
    if (!dialog) return;
    dialog.hidden = !visible;
    document.querySelector('.code-scanner')?.classList.toggle('is-permission-open', Boolean(visible));
  }

  function fillPermissionDialogCopy() {
    const title = document.getElementById('code-scanner-permission-title');
    const message = document.getElementById('code-scanner-permission-message');
    const deny = document.getElementById('code-scanner-permission-deny');
    const allow = document.getElementById('code-scanner-permission-allow');

    if (title) title.textContent = scannerSpec.permissionTitle || '“Rookie” quiere acceder a la cámara';
    if (message) {
      message.textContent =
        scannerSpec.permissionMessage ||
        'Esto permite escanear el código de barras de tu ticket de compra.';
    }
    if (deny) deny.textContent = scannerSpec.permissionDeny || 'No permitir';
    if (allow) allow.textContent = scannerSpec.permissionAllow || 'Permitir';
  }

  function setPreviewLive(live) {
    const mock = document.getElementById('code-scanner-preview-mock');
    mock?.classList.toggle('is-live', Boolean(live));
  }

  function scheduleMockScanSuccess() {
    if (mockScanTimeoutId !== null || scannerStaticDemo) return;

    mockScanTimeoutId = window.setTimeout(() => {
      mockScanTimeoutId = null;
      if (!scannerActive) return;
      handleScannerResult(mockSpec.validCodes[0]);
    }, scannerSpec.mockScanDelayMs ?? 3200);
  }

  function startScanLoop() {
    stopScanLoop();
    const frame = document.getElementById('code-scanner-frame');
    frame?.classList.add('is-scanning');
    setPreviewLive(true);
    scheduleMockScanSuccess();
  }

  function stopCameraTracks() {
    if (!cameraStream) return;
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }

  function stopCamera() {
    stopScanLoop();
    clearSuccessNavigateTimeout();
    scannerActive = false;
    scannerStaticDemo = false;
    setPermissionDialogVisible(false);
    setPreviewLive(false);
    stopCameraTracks();
  }

  function loadScannerPreviewImage() {
    const mock = document.getElementById('code-scanner-preview-mock');
    if (mock && scannerSpec.previewMockAsset) {
      mock.src = resolveAsset(scannerSpec.previewMockAsset);
      mock.alt = '';
      mock.hidden = false;
    }
  }

  /** Vista simulada sin getUserMedia — nunca pide permiso real. */
  function startScannerPreview() {
    scannerActive = true;
    usingMockPreview = true;
    loadScannerPreviewImage();
    setPermissionDialogVisible(false);
    setPreviewLive(false);
  }

  function beginMockCameraSession() {
    setPermissionDialogVisible(false);
    setScannerFrameVariant('neutral');
    startScannerPreview();
    setScannerSheetState('standard', { showSheet: true });
    startScanLoop();
  }

  function showFakeCameraPermission() {
    fillPermissionDialogCopy();
    loadScannerPreviewImage();
    setPreviewLive(false);
    document.getElementById('code-scanner-frame')?.classList.remove('is-scanning');
    setPermissionDialogVisible(true);
    scannerActive = true;
  }

  /** Entrada al flujo vivo: diálogo iOS falso → escaneo mock. */
  function startCamera() {
    stopCameraTracks();
    showFakeCameraPermission();
  }

  function renderSheetTitle(state) {
    if (state.titleLines?.length) {
      return state.titleLines
        .map((line) => `<span class="code-scanner__sheet-title-line">${line}</span>`)
        .join('');
    }
    return state.title || '';
  }

  const frameErrorIconAssets = {
    x: '../assets/figma/033d0299d6fb0afc70d45de6453566895fb440ba.svg',
  };

  function applyScannerViewportState(state) {
    const viewport = document.getElementById('code-scanner-viewport');
    const overlay = document.getElementById('code-scanner-viewport-overlay');
    const mock = document.getElementById('code-scanner-preview-mock');

    const isError = state?.frameVariant === 'error';
    viewport?.classList.toggle('is-blurred', Boolean(isError && state?.viewportBlur));

    if (overlay) {
      if (state?.viewportOverlayAsset) {
        overlay.src = resolveAsset(state.viewportOverlayAsset);
        overlay.hidden = false;
        overlay.style.width = state.viewportOverlayStyle?.width || '';
        overlay.style.height = state.viewportOverlayStyle?.height || '';
        overlay.style.left = state.viewportOverlayStyle?.left || '';
        overlay.style.top = state.viewportOverlayStyle?.top || '';
      } else {
        overlay.hidden = true;
        overlay.removeAttribute('src');
        overlay.style.width = '';
        overlay.style.height = '';
        overlay.style.left = '';
        overlay.style.top = '';
      }
    }

    if (mock) {
      mock.classList.toggle('is-blurred', Boolean(isError && state?.viewportBlur));
    }
  }

  function setScannerFrameVariant(variant, errorIcon) {
    const frame = document.getElementById('code-scanner-frame');
    const successBadge = document.getElementById('code-scanner-frame-success');
    const errorBadge = document.getElementById('code-scanner-frame-error');
    const errorBadgeIcon = document.getElementById('code-scanner-frame-error-icon');
    if (!frame) return;

    frame.classList.toggle('is-error', variant === 'error');
    frame.classList.toggle('is-success', variant === 'success');

    if (successBadge) {
      successBadge.hidden = variant !== 'success';
      if (variant === 'success') {
        successBadge.classList.remove('is-animating');
        // Restart the draw animation deterministically
        void successBadge.offsetWidth;
        successBadge.classList.add('is-animating');
      } else {
        successBadge.classList.remove('is-animating');
      }
    }

    if (errorBadge && errorBadgeIcon) {
      const showErrorIcon = variant === 'error' && errorIcon;
      errorBadge.hidden = !showErrorIcon;
      if (showErrorIcon && frameErrorIconAssets[errorIcon]) {
        errorBadgeIcon.src = resolveAsset(frameErrorIconAssets[errorIcon]);
      }
    }
  }

  function applyScannerSuccessState(options = {}) {
    clearSuccessNavigateTimeout();
    stopScanLoop();
    setPreviewLive(false);

    // Card "Cómo escanear" permanece visible durante la confirmación
    setScannerSheetVisibility(true);
    setScannerFrameVariant('success');
    applyScannerViewportState({});
    currentSheetState = 'success';

    if (options.autoNavigate === false) return;

    const checkMs = scannerSpec.successCheckMs ?? 450;
    const holdMs = scannerSpec.successHoldMs ?? 700;
    const delay = checkMs + holdMs;
    successNavigateTimeoutId = window.setTimeout(() => {
      successNavigateTimeoutId = null;
      stopCamera();
      goToSuccess();
    }, delay);
  }

  function setScannerSheetVisibility(visible) {
    const sheet = document.getElementById('code-scanner-sheet');
    if (!sheet) return;
    sheet.classList.toggle('is-hidden', !visible);
  }

  function setScannerSheetState(stateKey, options = {}) {
    const states = scannerSpec.sheetStates || {};
    const state = states[stateKey] || states.standard;
    if (!state) return;

    currentSheetState = stateKey in states ? stateKey : 'standard';

    const sheet = document.getElementById('code-scanner-sheet');
    const sheetBody = sheet?.querySelector('.code-scanner__sheet-body');
    const sheetTitle = document.getElementById('code-scanner-sheet-title');
    const sheetText = document.getElementById('code-scanner-sheet-text');
    const sheetIllustration = document.getElementById('code-scanner-sheet-illustration');
    const manualHelper = document.getElementById('code-scanner-manual-helper');
    const manualBtn = document.getElementById('code-scanner-manual');
    const supportText = document.getElementById('code-scanner-sheet-support');

    if (sheetTitle) {
      if (state.titleLines?.length) {
        sheetTitle.innerHTML = renderSheetTitle(state);
      } else {
        sheetTitle.textContent = state.title || '';
      }
    }
    if (sheetText) sheetText.textContent = state.text || '';
    if (sheetIllustration && state.illustrationAsset) {
      sheetIllustration.src = resolveAsset(state.illustrationAsset);
      sheetIllustration.alt = '';
      sheetIllustration.hidden = false;
    }
    if (sheetBody) {
      sheetBody.style.gap = `${state.bodyGap ?? 18}px`;
    }

    setScannerFrameVariant(state.frameVariant || 'neutral', state.frameErrorIcon);
    applyScannerViewportState(state);

    const footer = state.footer || {};
    if (footer.type === 'support') {
      if (manualHelper) manualHelper.hidden = true;
      if (manualBtn) manualBtn.hidden = true;
      if (supportText) {
        supportText.hidden = false;
        if (footer.supportEmail) {
          const prefix = footer.supportPrefix || '';
          supportText.innerHTML = `${prefix}<a class="code-scanner__sheet-support-link" href="mailto:${footer.supportEmail}">${footer.supportEmail}</a>`;
        } else {
          supportText.textContent = footer.supportText || '';
        }
      }
    } else {
      if (supportText) {
        supportText.hidden = true;
        supportText.textContent = '';
        supportText.innerHTML = '';
      }
      if (manualHelper) {
        manualHelper.hidden = false;
        manualHelper.innerHTML = renderHelperLines(
          footer.helperLines || [],
          'code-screen__manual-helper-line'
        );
      }
      if (manualBtn) {
        manualBtn.hidden = false;
        manualBtn.textContent = footer.cta || 'Introducir código manualmente';
      }
    }

    const shouldShowSheet = options.showSheet !== false && stateKey !== 'success';
    if (state.sheetPinned !== false && shouldShowSheet) {
      setScannerSheetVisibility(true);
    } else if (options.showSheet === false) {
      setScannerSheetVisibility(false);
    }
  }

  function closeScannerSheet() {
    const states = scannerSpec.sheetStates || {};
    const state = states[currentSheetState] || states.standard;
    if (state?.sheetPinned) return;
    setScannerSheetVisibility(false);
    if (state?.allowRetryOnClose !== false) {
      setScannerFrameVariant('neutral');
      applyScannerViewportState(states.standard || {});
      if (scannerActive && !scannerStaticDemo) {
        startScanLoop();
      }
    } else {
      stopScanLoop();
      setScannerFrameVariant('neutral');
      applyScannerViewportState(states.standard || {});
    }
  }

  function showScannerError(message) {
    /* Banner de error opcional — el flujo principal usa sheet states */
    void message;
  }

  function handleScannerResult(code) {
    stopScanLoop();
    const outcome = getCodeScanOutcome(code);

    if (outcome === 'valid') {
      applyScannerSuccessState();
      return;
    }

    const sheetKey =
      outcome === 'alreadyUsed'
        ? 'alreadyUsed'
        : outcome === 'readError'
          ? 'readError'
          : 'invalid';
    setScannerSheetState(sheetKey);
  }

  function enterScannerRoute(hashKey) {
    const screenKey = resolveScannerScreenKey(hashKey);
    if (!screenKey) return;

    clearSuccessNavigateTimeout();
    const demoMap = getScannerDemoMap();
    scannerStaticDemo = Boolean(demoMap[hashKey]);

    if (screenKey === 'success') {
      applyScannerSuccessState({ autoNavigate: !scannerStaticDemo });
      if (scannerStaticDemo) {
        stopCameraTracks();
        startScannerPreview();
      }
      return;
    }

    setScannerSheetState(screenKey);

    if (scannerStaticDemo) {
      stopCameraTracks();
      stopScanLoop();
      startScannerPreview();
      return;
    }

    applyScannerLayoutTokens();
    startCamera();
  }

  function initCodeScanner() {
    applyScannerLayoutTokens();
    fillPermissionDialogCopy();
    loadScannerPreviewImage();

    const backBtn = document.getElementById('code-scanner-back');
    const manualBtn = document.getElementById('code-scanner-manual');
    const allowBtn = document.getElementById('code-scanner-permission-allow');
    const denyBtn = document.getElementById('code-scanner-permission-deny');
    const backdrop = document.getElementById('code-scanner-permission-backdrop');

    window.BarraSuperiorBack?.bind(backBtn, () => {
      stopCamera();
      navigateTo('code-bridge');
    });

    manualBtn?.addEventListener('click', () => {
      stopCamera();
      navigateTo('code-manual');
    });

    const acceptPermission = () => beginMockCameraSession();
    allowBtn?.addEventListener('click', acceptPermission);
    denyBtn?.addEventListener('click', acceptPermission);
    backdrop?.addEventListener('click', acceptPermission);

    if (!scannerHashListenerBound) {
      window.addEventListener('hashchange', () => {
        const key = window.location.hash.replace(/^#/, '');
        if (resolveScannerScreenKey(key)) {
          enterScannerRoute(key);
        } else if (key === 'code-scanner') {
          enterScannerRoute(key);
        } else {
          stopCamera();
        }
      });
      scannerHashListenerBound = true;
    }
  }

  function mountActivationCodeScreens() {
    const container = document.querySelector('.phone-shell__body');
    if (!container || !isActivationFlow()) return false;

    let mountedAny = false;

    if (!document.getElementById('screen-code-bridge')) {
      container.insertAdjacentHTML('afterbegin', createCodeBridgeMarkup());
      initCodeBridge();
      mountedAny = true;
    }

    if (!document.getElementById('screen-code-manual')) {
      container.insertAdjacentHTML('beforeend', createCodeManualMarkup());
      initCodeManual();
      mountedAny = true;
    }

    if (!document.getElementById('screen-code-scanner')) {
      container.insertAdjacentHTML('beforeend', createCodeScannerMarkup());
      initCodeScanner();
      mountedAny = true;
    }

    return mountedAny;
  }

  window.CodeActivationFlow = {
    createBridgeMarkup: createCodeBridgeMarkup,
    createManualMarkup: createCodeManualMarkup,
    createScannerMarkup: createCodeScannerMarkup,
    initBridge: initCodeBridge,
    initManual: initCodeManual,
    initScanner: initCodeScanner,
    isValidPurchaseCode,
    isCodeValidated,
    markCodeValidated,
    clearCodeValidated,
    goToSuccess,
    stopCamera,
    startCamera,
    setScannerSheetState,
    closeScannerSheet,
    enterScannerRoute,
    applyScannerSuccessState,
    getCodeScanOutcome,
  };

  const mountedCodeScreens = mountActivationCodeScreens();

  if (mountedCodeScreens && window.location.hash) {
    window.ActivationFlow?.refreshRoute?.();
  }

  if (document.getElementById('screen-code-bridge') && !document.getElementById('screen-splash')) {
    initCodeBridge();
    document.getElementById('screen-code-bridge')?.classList.add('is-active');
    document.title = 'Rookie — Activar código';
  }

  if (document.getElementById('screen-code-manual') && !document.getElementById('screen-splash')) {
    initCodeManual();
    document.getElementById('screen-code-manual')?.classList.add('is-active');
    document.title = 'Rookie — Código manual';
  }

  if (document.getElementById('screen-code-scanner') && !document.getElementById('screen-splash')) {
    initCodeScanner();
    document.getElementById('screen-code-scanner')?.classList.add('is-active');
    enterScannerRoute(window.location.hash.replace(/^#/, '') || 'code-scanner');
    document.title = 'Rookie — Escanear código';
  }
})();
