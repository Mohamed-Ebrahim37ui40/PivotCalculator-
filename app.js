/**
 * PivotCalc - Main Application Logic
 */
import {
  BRANDS,
  calculateWheels,
  calcPlantingRate,
  calcHarvestRate,
  calcPlantingNeeds,
  calcHarvestNeeds,
  radiusFromArea,
} from './calculations.js';
import { t, translations } from './i18n.js';

// ========== State ==========
const state = {
  lang: localStorage.getItem('pc_lang') || 'ar',
  theme: localStorage.getItem('pc_theme') || 'light',
  area: 0,
  brand: 'zimmatic',
  customSpans: null,
  customLengths: null,
  usingCustom: false,
  // Tab 2 inputs (persist)
  avgJumboWeight: '',
  totalJumbos: '',
  // Tab 3
  harvestedJumbos: '',
  // Tab 4
  needsAvgWeight: '',
  needsArea: '',
  needsRate: '',
  harvestRateInput: '',
  harvestArea: '',
  truckCapacity: '',
};

let deferredPrompt = null;

// ========== DOM Helpers ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function applyLang() {
  const lang = state.lang;
  document.documentElement.lang = lang;
  document.body.classList.toggle('rtl', lang === 'ar');
  document.body.classList.toggle('ltr', lang === 'en');
  localStorage.setItem('pc_lang', lang);

  // Update all [data-i18n] elements
  $$('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key, lang);
  });

  // Update placeholders
  $$('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key, lang);
  });

  // Brand select options
  updateBrandSelect();
}

function applyTheme() {
  document.documentElement.setAttribute(
    'data-theme',
    state.theme === 'dark' ? 'dark' : 'light'
  );
  localStorage.setItem('pc_theme', state.theme);
  const icon = $('#themeIcon');
  if (icon) {
    icon.innerHTML =
      state.theme === 'dark'
        ? `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`
        : `<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.4-9.54c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
  }
}

function updateBrandSelect() {
  const sel = $('#brandSelect');
  if (!sel) return;
  const current = sel.value || state.brand;
  sel.innerHTML = '';
  Object.values(BRANDS).forEach((b) => {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = state.lang === 'ar' ? b.nameAr : b.nameEn;
    sel.appendChild(opt);
  });
  sel.value = current;
}

// ========== Calculations & Render ==========
function getActiveBrand() {
  return BRANDS[state.brand] || BRANDS.zimmatic;
}

function runCalculation() {
  const area = parseFloat(state.area) || 0;
  const brand = getActiveBrand();
  let result;

  if (state.usingCustom && state.customSpans) {
    result = calculateWheels(
      area,
      brand.commonLength,
      brand.spanWidth,
      state.customSpans,
      state.customLengths
    );
  } else {
    result = calculateWheels(area, brand.commonLength, brand.spanWidth);
  }

  renderWheelsTable(result);
  renderStats(result);
  updateDependentTabs(result);
  return result;
}

function renderStats(result) {
  $('#statRadius').textContent = result.radius ? result.radius.toFixed(1) : '—';
  $('#statTowers').textContent = result.numTowers || '—';
  $('#statSpans').textContent = result.totalSpans || '—';
  $('#statTotalArea').textContent = result.totalArea
    ? result.totalArea.toFixed(3)
    : '—';
}

function renderWheelsTable(result) {
  const tbody = $('#wheelsBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  // Always show at least 9 rows (empty if needed)
  const minRows = 9;
  const wheels = result.wheels || [];
  const rows = Math.max(minRows, wheels.length);

  for (let i = 0; i < rows; i++) {
    const w = wheels[i];
    const tr = document.createElement('tr');
    if (w) {
      tr.innerHTML = `
        <td>${w.index}</td>
        <td>${w.spans}</td>
        <td>${w.area.toFixed(3)}</td>
      `;
    } else {
      tr.innerHTML = `<td>${i + 1}</td><td>—</td><td>—</td>`;
      tr.style.opacity = '0.4';
    }
    tbody.appendChild(tr);
  }
}

function updateDependentTabs(result) {
  const totalArea = result.totalArea || 0;

  // Tab 2
  const avgW = parseFloat(state.avgJumboWeight) || 0;
  const numJ = parseFloat(state.totalJumbos) || 0;
  if (avgW && numJ && totalArea) {
    const r = calcPlantingRate(numJ, avgW, totalArea);
    $('#outSeedTons').textContent = r.totalSeedTons.toFixed(3);
    $('#outPlantingRate').textContent = r.ratePerFeddan.toFixed(3);
  } else {
    $('#outSeedTons').textContent = '—';
    $('#outPlantingRate').textContent = '—';
  }

  // Tab 3
  const harvested = parseFloat(state.harvestedJumbos) || 0;
  if (harvested && totalArea) {
    $('#outHarvestRate').textContent = calcHarvestRate(
      harvested,
      totalArea
    ).toFixed(3);
  } else {
    $('#outHarvestRate').textContent = '—';
  }
}

// ========== Custom Page ==========
function openCustomPage() {
  $('#mainPage').classList.remove('active');
  $('#customPage').classList.add('active');
  renderCustomTable();
}

function closeCustomPage() {
  $('#customPage').classList.remove('active');
  $('#mainPage').classList.add('active');
}

function renderCustomTable() {
  const area = parseFloat(state.area) || 0;
  const brand = getActiveBrand();
  // Start with auto calculation to get structure
  const base = calculateWheels(area, brand.commonLength, brand.spanWidth);
  const tbody = $('#customBody');
  tbody.innerHTML = '';

  const minRows = Math.max(9, base.wheels.length);
  const existingSpans = state.customSpans;
  const existingLengths = state.customLengths;

  for (let i = 0; i < minRows; i++) {
    const w = base.wheels[i];
    const spansVal =
      existingSpans && existingSpans[i] != null
        ? existingSpans[i]
        : w
          ? w.spans
          : '';
    const lenVal =
      existingLengths && existingLengths[i] != null
        ? existingLengths[i]
        : w
          ? w.length
          : '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input type="number" min="0" max="50" step="1" class="custom-span" data-idx="${i}" value="${spansVal}"></td>
      <td><input type="number" min="0" max="80" step="0.1" class="custom-length" data-idx="${i}" value="${lenVal}"></td>
    `;
    tbody.appendChild(tr);
  }
}

function autoFillCustom() {
  const area = parseFloat(state.area) || 0;
  const brand = getActiveBrand();
  const result = calculateWheels(area, brand.commonLength, brand.spanWidth);
  state.customSpans = result.wheels.map((w) => w.spans);
  state.customLengths = result.wheels.map((w) => w.length);
  renderCustomTable();
}

function saveCustom() {
  const spanInputs = $$('.custom-span');
  const lengthInputs = $$('.custom-length');
  const spans = [];
  const lengths = [];

  spanInputs.forEach((inp, i) => {
    const s = parseFloat(inp.value);
    const l = parseFloat(lengthInputs[i]?.value);
    if (!isNaN(s) && s > 0) {
      spans.push(Math.round(s));
      lengths.push(!isNaN(l) && l > 0 ? l : s * 1.8);
    }
  });

  if (spans.length === 0) {
    state.usingCustom = false;
    state.customSpans = null;
    state.customLengths = null;
  } else {
    state.usingCustom = true;
    state.customSpans = spans;
    state.customLengths = lengths;
  }

  closeCustomPage();
  runCalculation();
}

// ========== Tab 4 Needs ==========
function updateNeeds() {
  // Planting needs
  const avgW = parseFloat(state.needsAvgWeight) || 0;
  const area = parseFloat(state.needsArea) || 0;
  const rate = parseFloat(state.needsRate) || 0;
  if (avgW && area && rate) {
    const r = calcPlantingNeeds(avgW, area, rate);
    $('#outNeedsJumbos').textContent = r.numJumbos.toFixed(2);
    $('#outNeedsTons').textContent = r.quantityTons.toFixed(3);
  } else {
    $('#outNeedsJumbos').textContent = '—';
    $('#outNeedsTons').textContent = '—';
  }

  // Harvest needs
  const hRate = parseFloat(state.harvestRateInput) || 0;
  const hArea = parseFloat(state.harvestArea) || 0;
  const truck = parseFloat(state.truckCapacity) || 0;
  if (hRate && hArea) {
    const r = calcHarvestNeeds(hRate, hArea, truck);
    $('#outHarvestJumbos').textContent = r.numJumbos.toFixed(2);
    $('#outNumTrucks').textContent = truck ? r.numTrucks.toFixed(2) : '—';
  } else {
    $('#outHarvestJumbos').textContent = '—';
    $('#outNumTrucks').textContent = '—';
  }
}

// ========== Event Bindings ==========
function bindEvents() {
  // Theme
  $('#btnTheme')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
  });

  // Language
  $('#btnLang')?.addEventListener('click', () => {
    state.lang = state.lang === 'ar' ? 'en' : 'ar';
    applyLang();
  });

  // Modals
  $('#btnAyah')?.addEventListener('click', () => openModal('ayah'));
  $('#btnAbout')?.addEventListener('click', () => openModal('about'));
  $('#btnIdea')?.addEventListener('click', () => openModal('idea'));
  $('#modalClose')?.addEventListener('click', closeModal);
  $('#overlay')?.addEventListener('click', (e) => {
    if (e.target === $('#overlay')) closeModal();
  });

  // Tabs
  $$('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.tab-btn').forEach((b) => b.classList.remove('active'));
      $$('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = $(`#panel-${btn.dataset.tab}`);
      if (panel) panel.classList.add('active');
    });
  });

  // Area input
  $('#areaInput')?.addEventListener('input', (e) => {
    state.area = e.target.value;
    state.usingCustom = false; // reset custom when area changes
    state.customSpans = null;
    state.customLengths = null;
    runCalculation();
  });

  // Brand select
  $('#brandSelect')?.addEventListener('change', (e) => {
    state.brand = e.target.value;
    state.usingCustom = false;
    state.customSpans = null;
    state.customLengths = null;
    if (state.brand === 'custom') {
      openCustomPage();
    } else {
      runCalculation();
    }
  });

  // Auto fill
  $('#btnAutoFill')?.addEventListener('click', () => {
    state.brand = 'zimmatic';
    state.usingCustom = false;
    state.customSpans = null;
    state.customLengths = null;
    $('#brandSelect').value = 'zimmatic';
    // If no area, set a sample
    if (!parseFloat(state.area)) {
      state.area = 125;
      $('#areaInput').value = 125;
    }
    runCalculation();
  });

  // Clear
  $('#btnClear')?.addEventListener('click', () => {
    state.area = 0;
    state.usingCustom = false;
    state.customSpans = null;
    state.customLengths = null;
    $('#areaInput').value = '';
    runCalculation();
  });

  // Custom page
  $('#btnCustomBack')?.addEventListener('click', closeCustomPage);
  $('#btnCustomAuto')?.addEventListener('click', autoFillCustom);
  $('#btnCustomSave')?.addEventListener('click', saveCustom);

  // Tab 2 inputs
  $('#inputAvgWeight')?.addEventListener('input', (e) => {
    state.avgJumboWeight = e.target.value;
    runCalculation();
  });
  $('#inputTotalJumbos')?.addEventListener('input', (e) => {
    state.totalJumbos = e.target.value;
    runCalculation();
  });

  // Tab 3
  $('#inputHarvested')?.addEventListener('input', (e) => {
    state.harvestedJumbos = e.target.value;
    runCalculation();
  });

  // Tab 4
  ['needsAvgWeight', 'needsArea', 'needsRate', 'harvestRateInput', 'harvestArea', 'truckCapacity'].forEach(
    (key) => {
      const el = $(`#input-${key}`);
      if (el) {
        el.addEventListener('input', (e) => {
          state[key] = e.target.value;
          updateNeeds();
        });
      }
    }
  );

  // Install
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    $('#installBanner')?.classList.add('show');
  });

  $('#btnInstall')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    $('#installBanner')?.classList.remove('show');
  });

  $('#btnInstallDismiss')?.addEventListener('click', () => {
    $('#installBanner')?.classList.remove('show');
  });
}

function openModal(type) {
  const overlay = $('#overlay');
  const title = $('#modalTitle');
  const body = $('#modalBody');
  const lang = state.lang;

  if (type === 'ayah') {
    title.textContent = t('ayahTitle', lang);
    body.className = 'modal-body ayah';
    body.textContent = t('ayahText', lang);
  } else if (type === 'about') {
    title.textContent = t('aboutTitle', lang);
    body.className = 'modal-body';
    body.textContent = t('aboutText', lang);
  } else if (type === 'idea') {
    title.textContent = t('ideaTitle', lang);
    body.className = 'modal-body';
    body.textContent = t('ideaText', lang);
  }

  overlay.classList.add('open');
}

function closeModal() {
  $('#overlay')?.classList.remove('open');
}

// ========== Init ==========
function init() {
  applyTheme();
  applyLang();
  bindEvents();
  runCalculation();
  updateNeeds();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .catch((err) => console.warn('SW registration failed:', err));
  }
}

document.addEventListener('DOMContentLoaded', init);
