document.addEventListener('DOMContentLoaded', function() {
    // Các biến đếm phòng
    let singleRoomOccupied = 0;
    let singleRoomMax = 10;
    let doubleRoomOccupied = 0;
    let doubleRoomMax = 5;
    let suiteRoomOccupied = 0;
    let suiteRoomMax = 2;
    let currentRowIndex = null;

    // Tham chiếu đến các phần tử trong DOM
    const table = document.getElementById('booking-table');
    const editForm = document.getElementById('edit-form');
    const editBookingForm = document.getElementById('edit-booking-form');

    // Cập nhật số lượng phòng trong bảng với chuỗi định dạng
    document.getElementById('single-room-count').textContent = `${singleRoomOccupied}/${singleRoomMax}`;
    document.getElementById('double-room-count').textContent = `${doubleRoomOccupied}/${doubleRoomMax}`;
    document.getElementById('suite-room-count').textContent = `${suiteRoomOccupied}/${suiteRoomMax}`;

    // Hàm hiển thị form chỉnh sửa
    function handleEditButtonClick(rowIndex) {
        currentRowIndex = rowIndex;
        const row = table.rows[rowIndex];
        document.getElementById('edit-check-in-date').value = row.cells[0].innerText;
        document.getElementById('edit-check-out-date').value = row.cells[1].innerText;
        document.getElementById('edit-room-type').value = row.cells[2].innerText.toLowerCase();
        document.getElementById('edit-phone').value = row.cells[3].innerText;
        document.getElementById('edit-cccd').value = row.cells[4].innerText;

        editForm.style.display = 'block';
    }

    // Hàm đóng form chỉnh sửa
    function closeEditForm() {
        document.getElementById("edit-form").style.display = 'none';
    }

    // Hàm cập nhật trạng thái phòng dựa trên số lượng
    function updateRoomStatus(occupied, max, statusElement) {
        if (occupied >= max) {
            statusElement.textContent = 'Hết Phòng';
            statusElement.style.color = 'red';
        } else {
            statusElement.textContent = 'Còn Phòng';
            statusElement.style.color = 'green';
        }
    }
    updateRoomStatus(singleRoomOccupied, singleRoomMax, document.getElementById('single-room-status'));
    updateRoomStatus(doubleRoomOccupied, doubleRoomMax, document.getElementById('double-room-status'));
    updateRoomStatus(suiteRoomOccupied, suiteRoomMax, document.getElementById('suite-room-status'));
    function deleteBooking(cccd, row) {
        fetch(`http://127.0.0.1:8000/datphong/${cccd}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            console.log('Booking deleted successfully');
            row.remove();
        })
        .catch(error => console.error('Error deleting booking:', error));
    }
    
    // Hàm duyệt đặt phòng
    function approveBooking(cccd, roomType) {
        fetch(`http://127.0.0.1:8000/approve/${cccd}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ room_type: roomType }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Booking approved successfully:', data);

            // Cập nhật số lượng phòng đã đặt dựa trên loại phòng
            switch (roomType) {
                case 'single':
                    singleRoomOccupied++;
                    break;
                case 'double':
                    doubleRoomOccupied++;
                    break;
                case 'suite':
                    suiteRoomOccupied++;
                    break;
                default:
                    // Xử lý các loại phòng không mong muốn
                    break;
            }

            // Cập nhật lại các phần tử hiển thị số lượng phòng
            document.getElementById('single-room-count').textContent = `${singleRoomOccupied}/${singleRoomMax}`;
            document.getElementById('double-room-count').textContent = `${doubleRoomOccupied}/${doubleRoomMax}`;
            document.getElementById('suite-room-count').textContent = `${suiteRoomOccupied}/${suiteRoomMax}`;

            // Cập nhật lại trạng thái phòng
            updateRoomStatus(singleRoomOccupied, singleRoomMax, document.getElementById('single-room-status'));
            updateRoomStatus(doubleRoomOccupied, doubleRoomMax, document.getElementById('double-room-status'));
            updateRoomStatus(suiteRoomOccupied, suiteRoomMax, document.getElementById('suite-room-status'));

            // Xóa các hàng trong bảng
            const tbody = document.getElementById('booking-table').getElementsByTagName('tbody')[0];
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
        })
        .catch(error => console.error('Error approving booking:', error));
    }
    // Fetch và điền dữ liệu vào bảng đặt phòng
    fetch('http://127.0.0.1:8000/datphong')
        .then(response => response.json())
        .then(data => {
            const bookings = data.datphongs;
            const tbody = document.getElementById('booking-table').getElementsByTagName('tbody')[0];

            bookings.forEach(booking => {
                const row = tbody.insertRow();
                row.setAttribute('data-booking-id', booking.id);

                // Thêm các cell cho từng thông tin đặt phòng
                const cellCheckInDate = row.insertCell();
                cellCheckInDate.textContent = booking.check_in_date;

                const cellCheckOutDate = row.insertCell();
                cellCheckOutDate.textContent = booking.check_out_date;

                const cellRoomType = row.insertCell();
                cellRoomType.textContent = booking.room_type;

                const cellPhone = row.insertCell();
                cellPhone.textContent = booking.phone;

                const cellCCCD = row.insertCell();
                cellCCCD.textContent = booking.cccd;

                // Thêm nút "Chỉnh sửa"
                const cellEdit = row.insertCell();
                const editButton = document.createElement('button');
                editButton.textContent = 'Chỉnh sửa';
                editButton.classList.add("button");
                editButton.id = "edit-button";
                editButton.addEventListener('click', () => handleEditButtonClick(row.rowIndex));
                cellEdit.appendChild(editButton);

                // Thêm nút "Xóa"
                const cellDelete = row.insertCell();
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Xóa';
                deleteButton.classList.add('button');
                deleteButton.addEventListener('click', () => deleteBooking(booking.cccd, row));
                cellDelete.appendChild(deleteButton);
                // Thêm nút "Duyệt"
                const cellApprove = row.insertCell();
                const approveButton = document.createElement('button');
                approveButton.textContent = 'Duyệt';
                approveButton.classList.add('approve-button');
                approveButton.addEventListener('click', () => approveBooking(booking.cccd, booking.room_type));
                cellApprove.appendChild(approveButton);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    // Xử lý submit form chỉnh sửa
    editBookingForm.addEventListener('submit-edit', async (event) => {
        event.preventDefault(); // Ngăn không cho form submit mặc định

        const updatedBooking = {
            check_in_date: document.getElementById('edit-check-in-date').value,
            check_out_date: document.getElementById('edit-check-out-date').value,
            room_type: document.getElementById('edit-room-type').value,
            phone: document.getElementById('edit-phone').value
        };
        const cccd = document.getElementById('edit-cccd').value; // Lấy cccd để update

        try {
            const response = await fetch(`http://127.0.0.1:8000/datphong/${cccd}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedBooking)
            });
    
            if (response.ok) {
                const row = table.rows[currentRowIndex];
                row.cells[0].innerText = updatedBooking.check_in_date;
                row.cells[1].innerText = updatedBooking.check_out_date;
                row.cells[2].innerText = updatedBooking.room_type.charAt(0).toUpperCase() + updatedBooking.room_type.slice(1);
                row.cells[3].innerText = updatedBooking.phone;
    
                closeEditForm();
                alert('Sửa thông tin đặt phòng thành công');
            } else {
                const errorData = await response.json();
                alert(`Lỗi: ${errorData.detail}`);
            }
        } catch (error) {
            alert('Lỗi kết nối đến server');
            console.error('Error:', error);
        }
    });

    document.getElementById('cancel-edit').addEventListener('click', closeEditForm);
});
document.addEventListener('DOMContentLoaded', function() {
    // Đặt ngày hiện tại cho các trường ngày
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('edit-check-in-date').setAttribute('min', today);
    document.getElementById('edit-check-out-date').setAttribute('min', today);

    var checkInDate = document.getElementById('edit-check-in-date');
    var checkOutDate = document.getElementById('edit-check-out-date');

    // Đảm bảo ngày check-out không thể trước ngày check-in
    checkInDate.addEventListener('input', function() {
        if (checkInDate.value > checkOutDate.value) {
            checkOutDate.value = checkInDate.value;
        }
    });

    checkOutDate.addEventListener('input', function() {
        if (checkOutDate.value < checkInDate.value) {
            checkInDate.value = checkOutDate.value;
        }
    });
});
// Khai báo các biến mà không gán giá trị ban đầu
let singleRoomOccupied;
let singleRoomMax;
let doubleRoomOccupied;
let doubleRoomMax;
let suiteRoomOccupied;
let suiteRoomMax;

// Hàm fetch dữ liệu từ API và cập nhật UI
function fetchRoomDataAndUpdateUI() {
    fetch('http://your-api-url/api/rooms')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Gán các giá trị từ API vào các biến tương ứng
            singleRoomOccupied = data.single.occupied;
            singleRoomMax = data.single.max;
            doubleRoomOccupied = data.double.occupied;
            doubleRoomMax = data.double.max;
            suiteRoomOccupied = data.suite.occupied;
            suiteRoomMax = data.suite.max;
            
            // Cập nhật giao diện dựa trên dữ liệu đã lấy từ API
            updateInitialRoomCounts(singleRoomOccupied, singleRoomMax, doubleRoomOccupied, doubleRoomMax, suiteRoomOccupied, suiteRoomMax);
            updateRoomStatus(singleRoomOccupied, singleRoomMax, document.getElementById('single-room-status'));
            updateRoomStatus(doubleRoomOccupied, doubleRoomMax, document.getElementById('double-room-status'));
            updateRoomStatus(suiteRoomOccupied, suiteRoomMax, document.getElementById('suite-room-status'));
        })
        .catch(error => console.error('Error fetching room data:', error));
}

// Hàm cập nhật UI ban đầu
function updateInitialRoomCounts(singleOccupied, singleMax, doubleOccupied, doubleMax, suiteOccupied, suiteMax) {
    document.getElementById('single-room-count').textContent = `${singleOccupied}/${singleMax}`;
    document.getElementById('double-room-count').textContent = `${doubleOccupied}/${doubleMax}`;
    document.getElementById('suite-room-count').textContent = `${suiteOccupied}/${suiteMax}`;
}

// Gọi hàm fetchRoomDataAndUpdateUI khi trang web được tải
document.addEventListener('DOMContentLoaded', () => {
    fetchRoomDataAndUpdateUI();
});
