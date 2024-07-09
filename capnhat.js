async function submitForm(event) {
    event.preventDefault(); 

    const manv = document.getElementById('manv').value;
    const updatedData = {
        hoten: document.getElementById('hoten').value,
        phongban: document.getElementById('phongban').value,
        chucvu: document.getElementById('chucvu').value,
        luong: document.getElementById('luong').value
    };

    const url = `http://localhost:8000/nhanvien/${manv}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.detail || 'Có lỗi xảy ra khi cập nhật nhân viên.');
        }

        console.log(responseData.message);
        alert('Cập nhật thông tin nhân viên thành công!');

    } catch (error) {
        console.error('Lỗi khi cập nhật nhân viên:', error.message);
        alert('Đã xảy ra lỗi khi cập nhật thông tin nhân viên.');
    }
}
const form = document.getElementById('updateForm');
form.addEventListener('submit', submitForm);
