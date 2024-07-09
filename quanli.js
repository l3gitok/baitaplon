const API_URL ='http://127.0.0.1:8000/nhanvien' ; // Thay thế bằng URL API của bạn

// Lấy danh sách khách hàng khi trang tải
fetchCustomers();

// Hàm lấy danh sách khách hàng
function fetchCustomers() {
  axios.get(API_URL)
    .then(response => {
      const customers = response.data;
      displayCustomers(customers);
    })
    .catch(error => {
      console.error("Lỗi khi lấy dữ liệu khách hàng:", error);
    });
}

// Hàm hiển thị danh sách khách hàng
function displayCustomers(customers) {
  const customerData = document.getElementById('customer-data');
  customerData.innerHTML = ""; // Xóa nội dung bảng hiện tại

  customers.forEach(customer => {
    const row = customerData.insertRow();
    row.insertCell().textContent = customer.id;
    row.insertCell().textContent = customer.name;
    row.insertCell().textContent = customer.email;
    row.insertCell().textContent = customer.phone;
  });
}
// Modal
const modal = document.getElementById("modal-add-customer");
const addCustomerForm = document.getElementById("add-customer-form");

// Hàm mở modal
function openAddCustomerModal() {
  modal.style.display = "block";
}

// Hàm đóng modal
function closeModal() {
  modal.style.display = "none";
}

// Hàm thêm khách hàng mới
function addCustomer() {
  const customerName = document.getElementById("customerName").value;
  const customerEmail = document.getElementById("customerEmail").value;
  const customerPhone = document.getElementById("customerPhone").value;

  const newCustomer = {
    name: customerName,
    email: customerEmail,
    phone: customerPhone
  };

  axios.post(API_URL, newCustomer)
    .then(response => {
      console.log("Khách hàng đã được thêm:", response.data);
      closeModal();
      fetchCustomers(); // Cập nhật danh sách khách hàng
    })
    .catch(error => {
      console.error("Lỗi khi thêm khách hàng:", error);
    });
}

// Thêm sự kiện click cho nút "Lưu" trong modal
addCustomerForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của form
  addCustomer();
});

const buttons = document.querySelectorAll('a[href="#XÓA"]'); // Lấy tất cả các nút "Xóa"

for (const button of buttons) {
  button.classList.add('gradient-button'); // Thêm lớp CSS cho nút
  button.addEventListener('click', function(event) {
    // Xử lý khi nút "Xóa" được nhấp
    event.preventDefault(); // Ngăn chặn hành động mặc định của nút (tải trang mới)

    const row = this.parentNode.parentNode; // Lấy hàng chứa nút "Xóa"
    const customerId = row.cells[0].textContent; // Lấy ID khách hàng từ ô đầu tiên

    const confirmationMessage = `Bạn có muốn xóa khách hàng ${customerId} không?`;
    if (confirm(confirmationMessage)) {
      // Xóa khách hàng khỏi bảng
      row.parentNode.removeChild(row);

      // Hiển thị thông báo
      alert(`Đã xóa khách hàng ${customerId}`);
    }
  });
}
