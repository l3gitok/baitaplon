document.addEventListener('DOMContentLoaded', function() {
    // Đặt ngày hiện tại cho các trường ngày
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('check-in-date').setAttribute('min', today);
    document.getElementById('check-out-date').setAttribute('min', today);

    var checkInDate = document.getElementById('check-in-date');
    var checkOutDate = document.getElementById('check-out-date');

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

// Xử lý khi form được submit
document.getElementById('booking-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const checkInDate = document.getElementById('check-in-date').value;
    const checkOutDate = document.getElementById('check-out-date').value;
    const roomType = document.getElementById('room-type').value;
    const phone = document.getElementById('phone').value;
    const cccd = document.getElementById('CCCD').value;

    const formData = {
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        room_type: roomType,
        phone: phone,
        cccd: cccd
    };

    fetch('http://127.0.0.1:8000/datphong', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Đặt phòng thành công") {
            alert('Đặt phòng thành công. Vui lòng đợi phản hồi từ chúng tôi.');
        } else {
            alert('Đặt phòng thất bại, vui lòng thử lại');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi, vui lòng thử lại sau');
    });
});
