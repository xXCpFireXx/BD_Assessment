import { capitalizeEachWord, notification } from "./utils"

// Base API URL
const API_URL = 'http://localhost:3000';

// DOM Elements
const form = document.getElementById('customer-form');
const tableBody = document.getElementById('customers-table-body');
const formTitle = document.getElementById('form-title');
const customerIdInput = document.getElementById('customer-id');
const cancelButton = document.getElementById('cancel-button');
const submitButton = document.getElementById('submit-button');

/**
 * Fetch all customers from the backend and render them in the table.
 */
async function fetchCustomers() {
  try {
    const response = await fetch(`${API_URL}/customers`);
    if (!response.ok) throw new Error('Error connecting to API');
    const customers = await response.json();

    tableBody.innerHTML = '';

    if (!customers || customers.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="center muted">No customers found.</td></tr>';
      return;
    }

    customers.forEach(customer => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${escapeHtml(customer.cc_customer)}</td>
        <td>${escapeHtml(customer.customer_name)}</td>
        <td>${escapeHtml(customer.address || '')}</td>
        <td>${escapeHtml(customer.phone || '')}</td>
        <td>${escapeHtml(customer.email)}</td>
        <td class="actions-cell">
          <button class="action-link edit" onclick="editCustomer('${customer.cc_customer}')">Edit</button>
          <button class="action-link delete" onclick="deleteCustomer('${customer.cc_customer}')">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error(err);
    tableBody.innerHTML = '<tr><td colspan="6" class="center muted">Error loading customers. Check console.</td></tr>';
  }
}

/**
 * Handle form submission to create or update a customer.
 */
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = customerIdInput.value;
  const customerData = {
    cc_customer: document.getElementById('cc_customer').value,
    customer_name: capitalizeEachWord(document.getElementById('customer_name').value),
    address: document.getElementById('address').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value
  };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/customers/${id}` : `${API_URL}/customers`;

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });

    if (!response.ok) {
      notification("An error occurred.", "#b60404ff", 3000);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'An error occurred.');
    }

    await response.json().catch(() => { });
    notification("Successful!", "#a7c957", 3000);
    resetForm();
    await fetchCustomers();

  } catch (error) {
    notification("Error saving customer", "#b60404ff", 3000);
    alert(`Error saving customer: ${error.message}`);
  }
});

/**
 * Fill the form with customer data for editing.
 */
window.editCustomer = async function (cc) {
  try {
    const res = await fetch(`${API_URL}/customers`);
    const customers = await res.json();
    const customer = customers.find(c => c.cc_customer === cc);

    formTitle.textContent = 'Edit Customer';
    customerIdInput.value = customer.cc_customer;
    document.getElementById('cc_customer').value = customer.cc_customer;
    document.getElementById('customer_name').value = customer.customer_name;
    document.getElementById('address').value = customer.address || '';
    document.getElementById('phone').value = customer.phone || '';
    document.getElementById('email').value = customer.email;

    submitButton.textContent = 'Update Customer';
    cancelButton.style.display = 'inline-block';
    window.scrollTo(0, 0);
  } catch (err) {
    notification("Error editing customer", "#b60404ff", 3000);
    console.error('Error editing customer:', err);
  }
};

/**
 * Delete a customer from the database.
 */
window.deleteCustomer = async function (cc) {
  if (!confirm('Are you sure you want to delete this customer?')) return;
  try {
    const response = await fetch(`${API_URL}/customers/${cc}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Unable to delete customer.');
    await fetchCustomers();
  } catch (err) {
    console.error('Error deleting customer:', err);
    alert('Error deleting customer.');
  }
};

/**
 * Reset the form to its initial state.
 */
function resetForm() {
  form.reset();
  customerIdInput.value = '';
  formTitle.textContent = 'Add New Customer';
  submitButton.textContent = 'Save Customer';
  cancelButton.style.display = 'none';
}

cancelButton.addEventListener('click', resetForm);

document.addEventListener('DOMContentLoaded', fetchCustomers);

/**
 * Escape potentially unsafe characters to prevent XSS.
 */
function escapeHtml(text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
