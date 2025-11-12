const tg = window.Telegram.WebApp;
tg.expand();

const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");
const addButton = document.getElementById("add");
const listDiv = document.getElementById("list");
const chartCanvas = document.getElementById("chart");

let records = [];

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

function quickAdd(amount) {
  addRecord(typeSelect.value, amount, categorySelect.value);
}

function render() {
  let balance = 0;
  listDiv.innerHTML = records.map((r,i) => {
    if (r.type === "income") balance += r.amount;
    if (r.type === "expense") balance -= r.amount;
    if (r.type === "debt") balance -= r.amount;
    return `<p>${r.type==='income'?'💰 Доход':r.type==='expense'?'💸 Расход':'📉 Долг'} (${r.category}): ${r.amount}₽ 
      <button onclick="removeRecord(${i})">×</button></p>`;
  }).join("");
  
  if(balance < 1000) listDiv.innerHTML += `<p style="color:red">⚠ Остаток меньше 1000₽!</p>`;

  renderChart();
}

function renderChart() {
  chartCanvas.style.display = 'block';
  const income = records.filter(r => r.type==='income').reduce((a,b)=>a+b.amount,0);
  const expense = records.filter(r => r.type==='expense').reduce((a,b)=>a+b.amount,0);
  const debt = records.filter(r => r.type==='debt').reduce((a,b)=>a+b.amount,0);

  new Chart(chartCanvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Доход','Расход','Долг'],
      datasets:[{
        data:[income, expense, debt],
        backgroundColor:['#4caf50','#f44336','#ff9800']
      }]
    }
  });
}

function showTab(tab) {
  listDiv.style.display = tab==='records' ? 'block' : 'none';
  chartCanvas.style.display = tab==='graph' ? 'block' : 'none';
}

fetchRecords();
