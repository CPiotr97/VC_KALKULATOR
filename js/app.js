let mode = 'vc';        // 'vc' | 'n' | 'vf'
let feedType = 'mill';  // 'mill' | 'turn'  — tylko dla mode === 'vf'
let feedDir = 'forward';// 'forward' (liczy Vf) | 'reverse' (liczy fz / f z Vf)
let units = 'metric';   // 'metric' | 'imperial'

const MM_PER_IN = 25.4;
const FTMIN_PER_MMIN = 3.280839895 / 1000; // m/min -> ft/min: *3.28084 ; tu liczymy z mm ostrożnie osobno

const UNIT_LABELS = {
  metric:  { len: 'mm',  vc: 'm/min',  vf: 'mm/min', fzu: 'mm/ząb', fu: 'mm/obr', vcDivisor: 1000 },
  imperial:{ len: 'cal', vc: 'ft/min', vf: 'cal/min', fzu: 'cal/ząb', fu: 'cal/obr', vcDivisor: 12 }
};

function setUnits(u){
  if(u === units) return;
  const goingImperial = (u === 'imperial');

  // konwersja aktualnych wartości w polach, żeby liczby dalej miały fizyczny sens
  convertField('D', goingImperial ? (v => v / MM_PER_IN) : (v => v * MM_PER_IN), goingImperial ? 3 : 2);
  convertField('vc', goingImperial ? (v => v * 3.280839895) : (v => v / 3.280839895), 2);
  convertField('fz', goingImperial ? (v => v / MM_PER_IN) : (v => v * MM_PER_IN), goingImperial ? 5 : 3);
  convertField('f', goingImperial ? (v => v / MM_PER_IN) : (v => v * MM_PER_IN), goingImperial ? 5 : 3);
  convertField('vfinput', goingImperial ? (v => v / MM_PER_IN) : (v => v * MM_PER_IN), goingImperial ? 3 : 1);

  units = u;
  document.getElementById('btn-mm').classList.toggle('active', u==='metric');
  document.getElementById('btn-in').classList.toggle('active', u==='imperial');

  refreshUnitLabels();
  calc();
}

function convertField(id, fn, decimals){
  const el = document.getElementById(id);
  const val = parseFloat(el.value);
  if(!isNaN(val)){
    el.value = parseFloat(fn(val).toFixed(decimals));
  }
}

function refreshUnitLabels(){
  const u = UNIT_LABELS[units];
  document.getElementById('unit-D').textContent = 'D [' + u.len + ']';
  document.getElementById('unit-vc').textContent = 'Vc [' + u.vc + ']';
  document.getElementById('unit-fz').textContent = 'fz [' + u.fzu + ']';
  document.getElementById('unit-f').textContent = 'f [' + u.fu + ']';

  if(mode === 'vf' && feedDir === 'reverse'){
    document.getElementById('unit-vfinput').textContent = 'Vf [' + u.vf + ']';
  } else {
    document.getElementById('unit-vfinput').textContent = 'Vf [' + u.vf + ']';
  }

  // odśwież etykiety odczytu zależnie od aktualnego trybu
  if(mode === 'vc'){
    document.getElementById('runit').textContent = u.vc;
  } else if(mode === 'vf'){
    updateFeedFields(false);
  }
}

function setMode(m){
  mode = m;
  document.getElementById('btn-vc').classList.toggle('active', m==='vc');
  document.getElementById('btn-n').classList.toggle('active', m==='n');
  document.getElementById('btn-vf').classList.toggle('active', m==='vf');

  document.getElementById('vf-sub').style.display = (m==='vf') ? 'flex' : 'none';
  document.getElementById('vf-dir').style.display = (m==='vf') ? 'flex' : 'none';
  document.getElementById('field-D').style.display = (m==='vf') ? 'none' : 'block';
  document.getElementById('field-vc').style.display = (m==='n') ? 'block' : 'none';
  document.getElementById('field-n').style.display = (m==='vc' || m==='vf') ? 'block' : 'none';

  document.getElementById('title').textContent =
    (m==='vf') ? 'Posuw' : 'Prędkość skrawania';
  document.getElementById('sym').textContent = (m==='vf') ? 'Vf / f' : 'Vc';

  const u = UNIT_LABELS[units];

  if(m==='vf'){
    setFeedType(feedType);
  } else {
    document.getElementById('field-fz').style.display = 'none';
    document.getElementById('field-z').style.display = 'none';
    document.getElementById('field-f').style.display = 'none';
    document.getElementById('field-vfinput').style.display = 'none';
    document.getElementById('rlabel').textContent = (m==='vc') ? 'Prędkość skrawania' : 'Prędkość obrotowa';
    document.getElementById('runit').textContent = (m==='vc') ? u.vc : 'obr/min';
    document.getElementById('formula').textContent = (m==='vc')
      ? 'Vc = (π × D × n) / ' + u.vcDivisor
      : 'n = (Vc × ' + u.vcDivisor + ') / (π × D)';
  }
  calc();
}

function setFeedType(t){
  feedType = t;
  document.getElementById('btn-mill').classList.toggle('active', t==='mill');
  document.getElementById('btn-turn').classList.toggle('active', t==='turn');
  document.getElementById('btn-rev').textContent = (t==='mill') ? 'Oblicz fz z Vf' : 'Oblicz f z Vf';
  updateFeedFields();
}

function setFeedDir(d){
  feedDir = d;
  document.getElementById('btn-fwd').classList.toggle('active', d==='forward');
  document.getElementById('btn-rev').classList.toggle('active', d==='reverse');
  updateFeedFields();
}

function updateFeedFields(doCalc){
  if(doCalc === undefined) doCalc = true;
  const u = UNIT_LABELS[units];
  const mill = feedType === 'mill';
  const fwd = feedDir === 'forward';

  document.getElementById('field-z').style.display = mill ? 'block' : 'none';
  document.getElementById('field-fz').style.display = (mill && fwd) ? 'block' : 'none';
  document.getElementById('field-f').style.display = (!mill && fwd) ? 'block' : 'none';
  document.getElementById('field-vfinput').style.display = (!fwd) ? 'block' : 'none';

  if(fwd){
    document.getElementById('rlabel').textContent = 'Prędkość posuwu';
    document.getElementById('runit').textContent = u.vf;
    document.getElementById('formula').textContent = mill
      ? 'Vf = fz × z × n'
      : 'Vf = f × n';
  } else if(mill){
    document.getElementById('rlabel').textContent = 'Posuw na ząb';
    document.getElementById('runit').textContent = u.fzu;
    document.getElementById('formula').textContent = 'fz = Vf / (z × n)';
  } else {
    document.getElementById('rlabel').textContent = 'Posuw na obrót';
    document.getElementById('runit').textContent = u.fu;
    document.getElementById('formula').textContent = 'f = Vf / n';
  }
  if(doCalc) calc();
}

function calc(){
  const u = UNIT_LABELS[units];
  const D = parseFloat(document.getElementById('D').value) || 0;
  const n = parseFloat(document.getElementById('n').value) || 0;
  let result = 0;
  let decimals = 1;

  if(mode === 'vc'){
    result = (Math.PI * D * n) / u.vcDivisor;
    decimals = 2;
  } else if(mode === 'n'){
    const vc = parseFloat(document.getElementById('vc').value) || 0;
    result = D > 0 ? (vc * u.vcDivisor) / (Math.PI * D) : 0;
    decimals = 0;
  } else if(mode === 'vf'){
    const mill = feedType === 'mill';
    const fwd = feedDir === 'forward';

    if(fwd){
      if(mill){
        const fz = parseFloat(document.getElementById('fz').value) || 0;
        const z = parseFloat(document.getElementById('z').value) || 0;
        result = fz * z * n;
      } else {
        const f = parseFloat(document.getElementById('f').value) || 0;
        result = f * n;
      }
      decimals = (units === 'imperial') ? 3 : 0;
    } else {
      const vf = parseFloat(document.getElementById('vfinput').value) || 0;
      if(mill){
        const z = parseFloat(document.getElementById('z').value) || 0;
        result = (n > 0 && z > 0) ? vf / (n * z) : 0;
      } else {
        result = n > 0 ? vf / n : 0;
      }
      decimals = (units === 'imperial') ? 5 : 3;
    }
  }

  document.getElementById('rvalue').textContent =
    result.toLocaleString('pl-PL', {maximumFractionDigits: decimals});
}

calc();
