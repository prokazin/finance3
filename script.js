const tg = window.Telegram.WebApp;
tg.expand();

const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const addButton = document.getElementById("add");
const listDiv = document.getElementById("list");

let records = JSON.parse(localStorage.getItem("records") || "[]");

function render() {
  listDiv.innerHTML = records
    .map((r, i) => `<p>${r.type === 'income' ? '💰 Доход' : r.type === 'expense' ? '💸 Расход' : '📉 Долг'}: ${r.amount}₽ 
    <button onclick="remove(${i})">×</button></p>`)
    .join("");
}

addButton.addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;
  if (!amount) return alert("Введите сумму!");
  records.push({ type, amount });
  localStorage.setItem("records", JSON.stringify(records));
  render();
  amountInput.value = "";
});

function remove(index) {
  records.splice(index, 1);
  localStorage.setItem("records", JSON.stringify(records));
  render();
}

render();
