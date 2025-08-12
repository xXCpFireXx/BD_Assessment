const apiUrl = 'http://localhost:3000/customers';
const form = document.getElementById('customerForm');
const tableBody = document.querySelector('#customerTable tbody');

async function loadCustomers() {
  const res = await fetch(apiUrl);
  const data = await res.json();
  tableBody.innerHTML = '';
  data.forEach(customer => {
    const row = `<tr>
      <td>${customer.cc_customer}</td>
      <td>${customer.customer_name}</td>
      <td>${customer.address || ''}</td>
      <td>${customer.phone || ''}</td>
      <td>${customer.email}</td>
      <td>
        <button onclick="editCustomer('${customer.cc_customer}')" class="btn btn-sm btn-warning">Edit</button>
        <button onclick="deleteCustomer('${customer.cc_customer}')" class="btn btn-sm btn-danger">Delete</button>
      </td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id').value;
  const body = {
    cc_customer: document.getElementById('cc_customer').value,
    customer_name: document.getElementById('customer_name').value,
    address: document.getElementById('address').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value
  };
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiUrl}/${id}` : apiUrl;
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  form.reset();
  document.getElementById('id').value = '';
  loadCustomers();
});

window.editCustomer = async function (cc) {
  const res = await fetch(`${apiUrl}`);
  const data = await res.json();
  const customer = data.find(c => c.cc_customer === cc);
  document.getElementById('id').value = customer.cc_customer;
  document.getElementById('cc_customer').value = customer.cc_customer;
  document.getElementById('customer_name').value = customer.customer_name;
  document.getElementById('address').value = customer.address || '';
  document.getElementById('phone').value = customer.phone || '';
  document.getElementById('email').value = customer.email;
};

window.deleteCustomer = async function (cc) {
  if (confirm('Delete this customer?')) {
    await fetch(`${apiUrl}/${cc}`, { method: 'DELETE' });
    loadCustomers();
  }
};

loadCustomers();
