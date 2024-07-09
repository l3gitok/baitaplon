document.getElementById("addEmployeeForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const newEmployeeData = {};
    formData.forEach((value, key) => {
        newEmployeeData[key] = value;
    });
    if (Object.keys(newEmployeeData).length === 5) {
        fetch('http://127.0.0.1:8000/nhanvien', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmployeeData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi thêm dữ liệu nhân viên vào API:', response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dữ liệu nhân viên đã được thêm vào API:', data);
            alert('Thêm nhân viên thành công');
            window.location.replace("index.html");
        })
        .catch(error => {
            console.error('Lỗi khi thêm dữ liệu nhân viên vào API:', error);
            alert('Đã xảy ra lỗi khi thêm nhân viên');
        });
    }else {
        alert('Vui lòng điền đầy đủ thông tin nhân viên');
    }
});