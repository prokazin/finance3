const tg = window.Telegram.WebApp;
tg.expand();

const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const listDiv = document.getElementById("list");
const addButton = document.getElementById("add");

let records = JSON.parse(localStorage.getItem("records") || "[]");

function render() {
  listDiv.innerHTML = records
    .map(r => `<p>${r.type}: ${r.amount}₽</p>`)
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

render();
