const $ = id => document.getElementById(id);
const fields = ['flour', 'hydration', 'salt', 'starter', 'starterHydration'];
const round1 = n => Math.round(n * 10) / 10;
const fmt = n => `${round1(n)} g`;
function setAmount(id, value) {
  const target = $(id);
  if (value === null || !Number.isFinite(value)) { target.textContent = '—'; return; }
  const digits = String(round1(value));
  target.dataset.long = digits.length > 5 ? 'extra' : digits.length > 3 ? 'true' : 'false';
  target.replaceChildren(document.createTextNode(`${digits} `));
  const unit = document.createElement('small'); unit.textContent = 'g'; target.append(unit);
}
function calculate() {
  const values = fields.map(id => $(id).value === '' ? NaN : Number($(id).value));
  const invalid = values.some(value => !Number.isFinite(value) || value < 0);
  if (invalid) {
    ['flourAdd','waterAdd','saltAdd','doughTotal'].forEach(id => setAmount(id, null));
    $('starterAdd').textContent = '—';
    $('details').textContent = 'Fill in all five amounts to see your recipe.';
    $('warning').textContent = values.some(v => v < 0) ? 'Use zero or a positive number for each amount.' : '';
    $('warning').hidden = !$('warning').textContent;
    return;
  }
  const [flourTotal, hydrationPct, saltPct, starterWeight, starterHydrationPct] = values;
  const starterFlour = starterWeight / (1 + starterHydrationPct / 100);
  const starterWater = starterWeight - starterFlour;
  const waterTotal = flourTotal * hydrationPct / 100;
  const saltTotal = flourTotal * saltPct / 100;
  const flourAdd = flourTotal - starterFlour;
  const waterAdd = waterTotal - starterWater;
  const impossible = flourAdd < -1e-9 || waterAdd < -1e-9;
  setAmount('flourAdd', flourAdd < -1e-9 ? null : Math.max(0,flourAdd));
  setAmount('waterAdd', waterAdd < -1e-9 ? null : Math.max(0,waterAdd));
  setAmount('saltAdd', saltTotal);
  setAmount('doughTotal', impossible ? null : flourTotal + waterTotal + saltTotal);
  $('starterAdd').textContent = fmt(starterWeight);
  $('details').textContent = `Your starter already brings ${fmt(starterFlour)} flour + ${fmt(starterWater)} water.`;
  const warnings = [];
  if (flourAdd < -1e-9) warnings.push('Your starter contains more flour than your target. Use less starter or increase total flour.');
  if (waterAdd < -1e-9) warnings.push('Your starter contains more water than this hydration allows. Use less starter or increase hydration.');
  $('warning').textContent = warnings.join(' ');
  $('warning').hidden = !warnings.length;
}
fields.forEach(id => $(id).addEventListener('input', calculate));
calculate();
