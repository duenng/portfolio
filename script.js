'use strict';

const nodeDetails = {
  brokers: 'IBKR and Futu adapters retrieve portfolio snapshots when broker software, credentials, and API services are available.',
  paper: 'Editable positions are stored in SQLite, giving the application a persistent paper portfolio without a live broker connection.',
  api: 'Python/FastAPI serves portfolio data. Per-holding pattern queries use semaphore-limited concurrency and a TTL cache.',
  interface: 'A Next.js interface presents holdings, weights, sector allocation, and P/L. AI insights use validated JSON with rule-based fallbacks.'
};

document.querySelectorAll('[data-node]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    const selected = button.classList.contains('selected');
    document.querySelectorAll('[data-node]').forEach(node => {
      node.classList.remove('selected');
      node.setAttribute('aria-pressed', 'false');
    });
    if (!selected) {
      button.classList.add('selected');
      button.setAttribute('aria-pressed', 'true');
    }
    document.querySelector('#diagram-detail p').textContent = selected
      ? 'Select a component to see how it works.'
      : nodeDetails[button.dataset.node];
  });
});

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(filter => {
      filter.classList.toggle('active', filter === button);
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    document.querySelectorAll('.project-card').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    });
  });
});

const projects = {
  optitrade: `
    <p class="dialog-kicker">JAN — AUG 2026 / MSc CAPSTONE</p>
    <h2 id="dialog-title">OptiTrade Portfolio &amp; Paper Trading</h2>
    <p class="dialog-lead">A portfolio-monitoring and paper-trading system built as part of a five-person MSc capstone. I was the Portfolio Lead, focusing on portfolio APIs, broker integration, holdings views, and portfolio insights.</p>
    <div class="tags"><span>Python</span><span>FastAPI</span><span>Next.js</span><span>SQLite WAL</span><span>IBKR / Futu APIs</span></div>
    <h3>What I worked on</h3>
    <ul><li>Built portfolio endpoints and holdings views for position weights, sector allocation, daily P/L, and unrealised P/L.</li><li>Implemented IBKR and Futu portfolio adapters alongside persistent paper portfolios. Live broker connections depend on the relevant broker software and credentials; paper portfolios are the default demo path.</li><li>Used semaphore-limited parallel queries and TTL caching for chart-pattern data associated with portfolio holdings.</li><li>Integrated LLM insights with strict JSON validation and rule-based fallbacks using portfolio concentration and profit/loss data when the model was unavailable or returned invalid output.</li><li>Worked on signal-poller and paper-trade storage paths with position caps, cooldowns, stop-loss and trailing-stop rules, and contributed to the SQLite WAL migration and trade-history interface.</li></ul>
    <h3>Validation and scope</h3><p class="dialog-lead">The team’s portfolio contract tests covered 44 adversarial parser inputs and seven mocked end-to-end chain cases. The paper-trading path was demonstrated, but a meaningful live signal-performance evaluation was not available in the report.</p>
    <p class="dialog-note">Built and evaluated as an MSc capstone, with persistent paper portfolios as the main demonstration environment.</p>`,
  momentum: `
    <p class="dialog-kicker">JAN — MAY 2025 / HKU COMP7415</p>
    <h2 id="dialog-title">Volatility-adjusted momentum</h2>
    <p class="dialog-lead">A Python long/short strategy using daily VOO data, implemented and backtested on ALGOGENE. The project connects a trend hypothesis to signal logic, position sizing, and performance evaluation.</p>
    <div class="tags"><span>Python</span><span>NumPy</span><span>TA-Lib</span><span>ALGOGENE</span></div>
    <h3>Implementation</h3><ul><li>Used 10-, 50-, and 150-day exponential moving averages with an ADX &gt;30 filter for long/short trend conditions.</li><li>Calculated position size against a USD 200 target risk budget using a 1.5 × ATR reference distance, and submitted trailing-stop orders.</li><li>Evaluated 1,258 trading days and 79 trades from January 2020 to December 2024.</li></ul>
    <div class="dialog-metrics"><div><b>0.95</b><span>REPORTED ANNUALISED SHARPE</span></div><div><b>30.85%</b><span>REPORTED MAX DRAWDOWN</span></div><div><b>79</b><span>BACKTEST TRADES</span></div></div>
    <h3>How to read the results</h3><p class="dialog-lead">The backtest settings show zero transaction costs and leverage configured at 5×. These are historical simulation results, not live returns. Costs and leverage assumptions matter when interpreting performance.</p><p class="dialog-note">The report does not establish an independent out-of-sample evaluation or a fully specified slippage model. A next iteration would add explicit execution costs, benchmark comparisons, and held-out testing.</p>`,
  detection: `
    <p class="dialog-kicker">SEP 2023 — JUN 2024 / BSc FINAL YEAR PROJECT</p>
    <h2 id="dialog-title">Drinking waste object detection</h2>
    <p class="dialog-lead">An object-detection project focused on identifying drinking waste and deploying the model to an Android application.</p>
    <div class="tags"><span>YOLOv8</span><span>Kotlin</span><span>Android</span></div>
    <h3>Implementation</h3><ul><li>Developed a YOLOv8 object-detection model for item categorisation.</li><li>Deployed the model to an Android application written in Kotlin.</li><li>Tuned memory usage and batch size for on-device inference.</li></ul>
    <h3>What I learned</h3><p class="dialog-lead">This project gave me experience taking a machine learning model beyond a training environment and working within the constraints of a mobile application.</p>`
};

const dialog = document.querySelector('#project-dialog');
let lastProjectTrigger;
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    lastProjectTrigger = button;
    document.querySelector('#dialog-content').innerHTML = projects[button.dataset.project];
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
    document.querySelector('#close-dialog').focus();
  });
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  lastProjectTrigger?.focus();
});

let toastTimeout;
document.querySelector('#copy-email').addEventListener('click', async () => {
  const email = 'ngsuiyat2002@gmail.com';
  const toast = document.querySelector('#toast');
  try {
    await navigator.clipboard.writeText(email);
    toast.textContent = 'Email address copied';
  } catch {
    toast.textContent = 'Email: ' + email;
  }
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3500);
});
document.querySelector('#year').textContent = new Date().getFullYear();
