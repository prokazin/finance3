const tg = window.Telegram.WebApp;
tg.expand();

const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");
const addButton = document.getElementById("add");
const listDiv = document.getElementById("list");
const chartCanvas = document.getElementById("chart");

let records = [];
let chartInstance = null;

async function fetchRecords() {
  const res = await fetch("/records");
  records = await res.json();
  render();
}

async function addRecord(type, amount, category) {
  await fetch("/records", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({type, amount, category})
  });
  await fetchRecords();
}

async function removeRecord(index) {
  await fetch(`/records/${index}`, { method: "DELETE" });
  await fetchRecords();
}

addButton.addEventListener("click", async () => {
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;
  const category = categorySelect.value;
  if (!amount) return alert("Введите сумму!");
  await addRecord(type, amount, category);
  amountInput.value = "";
});

async function quickAdd(amount) {
  await addRecord(typeSelect.value, amount, categorySelect.value);
}

function render() {
  let balance = 0;
  listDiv.innerHTML = records.map((r,i) => {
    if (r.type === "income") balance += r.amount;
    if (r.type === "expense") balance -= r.amount;
    if (r.type === "debt") balance -= r.amount;

    const color = r.type==='income' ? '#4caf50' : r.type==='expense' ? '#f44336' : '#ff9800';

    return `<div style="background:${color}; color:white; margin:5px auto; padding:10px; border-radius:5px; width:250px; text-align:left;">
      <strong>${r.type==='income'?'💰 Доход':r.type==='expense'?'💸 Расход':'📉 Долг'}</strong> (${r.category}): ${r.amount}₽
      <button style="float:right; background:white; color:black; border:none; border-radius:50%;" onclick="removeRecord(${i})">×</button>
    </div>`;
  }).join("");

  if(balance < 1000) listDiv.innerHTML += `<p style="color:red">⚠ Остаток меньше 1000₽!</p>`;

  renderChart();
  updateBalanceDisplay();
}

function renderChart() {
  const ctx = chartCanvas.getContext('2d');
  chartCanvas.width = window.innerWidth - 40;
  chartCanvas.height = 200;

  const income = records.filter(r => r.type==='income').reduce((a,b)=>a+b.amount,0);
  const expense = records.filter(r => r.type==='expense').reduce((a,b)=>a+b.amount,0);
  const debt = records.filter(r => r.type==='debt').reduce((a,b)=>a+b.amount,0);

  if(chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Доход','Расход','Долг'],
      datasets:[{
        data:[income, expense, debt],
        backgroundColor:['#4caf50','#f44336','#ff9800']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function showTab(tab) {
  listDiv.style.display = tab==='records' ? 'block' : 'none';
  chartCanvas.style.display = tab==='graph' ? 'block' : 'none';
  document.getElementById('settings').style.display = tab==='settings' ? 'block' : 'none';
  updateBalanceDisplay();
}

function clearAll() {
  if(confirm("Вы уверены, что хотите удалить все записи?")) {
    records = [];
    fetch("/records").then(() => render());
  }
}

function updateBalanceDisplay() {
  let balance = records.reduce((acc, r) => {
    if(r.type==='income') return acc + r.amount;
    if(r.type==='expense' || r.type==='debt') return acc - r.amount;
    return acc;
  }, 0);
  document.getElementById('balanceDisplay').textContent = balance + '₽';
}

fetchRecords();
