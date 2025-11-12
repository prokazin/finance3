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

// Данные
let data = JSON.parse(localStorage.getItem("financeData")) || { income: [], expense: [], debt: [] };
let salary = parseFloat(localStorage.getItem("salary")) || 0;

// Сохранение данных
function saveData() {
  localStorage.setItem("financeData", JSON.stringify(data));
  updateUI();
  updateChart();
  updateBalance();
}

// Добавление записи
function addRecord(type) {
  const amount = parseFloat(document.getElementById(type + "Amount").value);
  const category = document.getElementById(type + "Category").value || "Без категории";
  if (!amount || amount <= 0) return;
  data[type].push({ amount, category, date: new Date() });
  saveData();
}

// Быстрое добавление
function quickAdd(type, sum) {
  const category = "Быстрое добавление";
  data[type].push({ amount: sum, category, date: new Date() });
  saveData();
}

// Обновление UI списков с иконками категорий
function updateUI() {
  const icons = {
    salary: "💰", gift: "🎁", food: "🍔", rent: "🏠",
    transport: "🚗", loan: "🏦", friend: "👥", other: "💵"
  };
  ["income","expense","debt"].forEach(type => {
    const list = document.getElementById(type+"List");
    list.innerHTML = "";
    data[type].forEach(item => {
      const icon = icons[item.category] || "💵";
      const li = document.createElement("li");
      li.innerHTML = `<span>${icon} ${item.category}</span><span>${item.amount} ₽</span>`;
      list.appendChild(li);
    });
  });
}

// Зарплата
function updateSalary() {
  const input = parseFloat(document.getElementById("salaryInput").value);
  if (!input || input < 0) return alert("Введите корректную зарплату!");
  salary = input;
  localStorage.setItem("salary", salary);
  updateBalance();
}

// Баланс
function updateBalance() {
  const incomeSum = data.income.reduce((a,b)=>a+b.amount,0);
  const expenseSum = data.expense.reduce((a,b)=>a+b.amount,0);
  const debtSum = data.debt.reduce((a,b)=>a+b.amount,0);
  const balance = salary + incomeSum - expenseSum - debtSum;
  document.getElementById("balanceAmount").textContent = balance.toFixed(2);
}

// График
function updateChart() {
  const ctx = document.getElementById("financeChart").getContext("2d");
  const incomeSum = data.income.reduce((a,b)=>a+b.amount,0);
  const expenseSum = data.expense.reduce((a,b)=>a+b.amount,0);
  const debtSum = data.debt.reduce((a,b)=>a+b.amount,0);

  const summary = document.getElementById("summary");
  summary.textContent = `Доход: ${incomeSum} ₽ | Расход: ${expenseSum} ₽ | Долги: ${debtSum} ₽ | Остаток: ${(salary + incomeSum - expenseSum - debtSum).toFixed(2)} ₽`;

  if (window.financeChart) window.financeChart.destroy();

  window.financeChart = new Chart(ctx,{
    type:"doughnut",
    data:{
      labels:["Доходы","Расходы","Долги"],
      datasets:[{
        data:[incomeSum,expenseSum,debtSum],
        backgroundColor:["#00b894","#ff7675","#fdcb6e"]
      }]
    },
    options:{
      responsive:true,
      plugins:{legend:{position:"bottom"}}
    }
  });
}

// Инициализация
document.getElementById("salaryInput").value = salary;
updateUI();
updateChart();
updateBalance();
