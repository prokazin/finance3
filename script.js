const tabs = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab");

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    tabContents.forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

let data = JSON.parse(localStorage.getItem("financeData")) || { income: [], expense: [], debt: [] };

function saveData() {
  localStorage.setItem("financeData", JSON.stringify(data));
  updateUI();
  updateChart();
}

function addRecord(type) {
  const amount = parseFloat(document.getElementById(type + "Amount").value);
  const category = document.getElementById(type + "Category").value || "Без категории";
  if (!amount || amount <= 0) return;
  data[type].push({ amount, category, date: new Date() });
  saveData();
}

function quickAdd(type, sum) {
  const category = "Быстрое добавление";
  data[type].push({ amount: sum, category, date: new Date() });
  saveData();
}

function updateUI() {
  ["income", "expense", "debt"].forEach(type => {
    const list = document.getElementById(type + "List");
    list.innerHTML = "";
    data[type].forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${item.category}</span><span>${item.amount} ₽</span>`;
      list.appendChild(li);
    });
  });
}

function updateChart() {
  const ctx = document.getElementById("financeChart").getContext("2d");
  const incomeSum = data.income.reduce((a, b) => a + b.amount, 0);
  const expenseSum = data.expense.reduce((a, b) => a + b.amount, 0);
  const debtSum = data.debt.reduce((a,b) => a+b.amount,0);
  const summary = document.getElementById("summary");
  summary.textContent = `Доход: ${incomeSum} ₽ | Расход: ${expenseSum} ₽ | Долги: ${debtSum} ₽`;

  if (window.financeChart) window.financeChart.destroy();

  window.financeChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Доходы", "Расходы", "Долги"],
      datasets: [{
        data: [incomeSum, expenseSum, debtSum],
        backgroundColor: ["#00b894", "#ff7675", "#fdcb6e"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } }
    }
  });
}

updateUI();
updateChart();
