from fastapi import FastAPI, HTTPException,Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from difflib import SequenceMatcher
from datetime import date
from typing import List,Dict


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NhanVien(BaseModel):
    manv: str
    hoten: str
    phongban: str
    chucvu: str
    luong: float

nhanviens = []

@app.post("/nhanvien")
async def them_nhanvien(nhanvien: dict):
    nhanviens.append(nhanvien)
    return JSONResponse({"message": "Thêm nhân viên thành công"})

@app.put("/nhanvien/{manv}")
async def sua_nhanvien(manv: str, nhanvien: dict):
    global nhanviens
    for nv in nhanviens:
        if nv["manv"] == manv:
            nv.update(nhanvien)
            return JSONResponse({"message": "Sửa thông tin nhân viên thành công"})
    raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên")

@app.delete("/nhanvien/{manv}")
async def xoa_nhanvien(manv: str):
    global nhanviens
    for nv in nhanviens:
        if nv["manv"] == manv:
            nhanviens.remove(nv)
            return JSONResponse({"message": "Xóa nhân viên thành công"})
    return JSONResponse({"message": "Không tìm thấy nhân viên"}, status_code=404)

@app.get("/nhanvien")
async def get_nhanvien():
    return JSONResponse({"nhanviens": nhanviens})

class DatPhong(BaseModel):
    check_in_date: str
    check_out_date: str
    room_type: str
    phone: str
    cccd: str
class DatPhongUpdate(BaseModel):
    check_in_date: str
    check_out_date: str
    room_type: str
    phone: str
class ApproveRequest(BaseModel):
    room_type: str

# Sample data to simulate the booking database
datphongs = []

# Room counts for each room type
room_counts = {
    'single': {'occupied': 0, 'max': 10},
    'double': {'occupied': 0, 'max': 5},
    'suite': {'occupied': 0, 'max': 2}
}

@app.post("/datphong")
async def them_datphong(datphong: DatPhong):
    datphongs.append(datphong.model_dump())
    return JSONResponse({"message": "Đặt phòng thành công"})

@app.put("/datphong/{cccd}")
async def sua_datphong(cccd: str, datphong: DatPhong):
    for dp in datphongs:
        if dp["cccd"] == cccd:
            dp.update(datphong.model_dump())
            return {"message": "Sửa thông tin đặt phòng thành công"}
    raise HTTPException(status_code=404, detail="Không tìm thấy thông tin đặt phòng")
@app.delete("/datphong/{cccd}")
async def xoa_datphong(cccd: str):
    for dp in datphongs:
        if dp["cccd"] == cccd:
            datphongs.remove(dp)
            return JSONResponse({"message": "Xóa thông tin đặt phòng thành công"})
    raise HTTPException(status_code=404, detail="Không tìm thấy thông tin đặt phòng")

@app.get("/datphong")
async def get_datphong():
    return JSONResponse({"datphongs": datphongs})

@app.post("/approve/{cccd}")
async def approve_booking(cccd: str, request: Request):
    data = await request.json()
    room_type = data['room_type']
    
    for dp in datphongs:
        if dp["cccd"] == cccd:
            if room_type in room_counts:
                if room_counts[room_type]['occupied'] < room_counts[room_type]['max']:
                    room_counts[room_type]['occupied'] += 1
                    datphongs.remove(dp)  # Xóa đặt phòng đã duyệt thành công
                    return JSONResponse({"message": "Đã duyệt đặt phòng"})
                else:
                    raise HTTPException(status_code=400, detail="Phòng đã hết")
            else:
                raise HTTPException(status_code=404, detail="Loại phòng không tồn tại")
    raise HTTPException(status_code=404, detail="Không tìm thấy thông tin đặt phòng")
@app.put("/datphong/{cccd}")
async def sua_datphong(cccd: str, datphong: DatPhong):
    for dp in datphongs:
        if dp["cccd"] == cccd:
            dp.update(datphong.dict())
            return {"message": "Sửa thông tin đặt phòng thành công"}
    raise HTTPException(status_code=404, detail="Không tìm thấy thông tin đặt phòng")

# Cập nhật cấu trúc dữ liệu
data = {
    "Xin chào": ["xin chào", "chào", "hello", "hi", "xin chao"],
    "Thông tin đặt phòng": ["đặt phòng", "booking", "làm thế nào để đặt phòng"],
    "Giờ nhận phòng": ["giờ nhận phòng", "check in"],
    "Giờ trả phòng": ["giờ trả phòng", "check out"],
    "Tiện nghi": ["tiện nghi", "facilities", "có những gì", "dịch vụ"],
    "Địa chỉ": ["địa chỉ", "location", "khách sạn ở đâu"],
    "Thông tin về khách sạn": ["khách sạn", "hotel", "thông tin khách sạn"]
}

responses = {
    "Xin chào": "Xin chào! Tôi là chatbot của khách sạn. Có gì tôi có thể giúp bạn?",
    "Thông tin đặt phòng": "Bạn có thể đặt phòng qua trang web của chúng tôi hoặc liên hệ trực tiếp qua điện thoại.",
    "Giờ nhận phòng": "Giờ nhận phòng là sau 2 giờ chiều.",
    "Giờ trả phòng": "Giờ trả phòng là trước 12 giờ trưa.",
    "Tiện nghi": "Khách sạn chúng tôi có hồ bơi, phòng gym, spa và nhà hàng.",
    "Địa chỉ": "Khách sạn nằm tại 123 Đường ABC, Quận 1, TP.HCM.",
    "Thông tin về khách sạn": "Khách sạn chúng tôi có 100 phòng, 5 tầng, có hồ bơi, phòng gym, spa và nhà hàng.Là khách sạn 5 sao số 1 thế giới."
}

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

# Hàm để sinh câu trả lời
def get_response(prompt):
    prompt = prompt.lower()
    for key, keywords in data.items():
        for keyword in keywords:
            if similar(keyword, prompt) > 0.8 or keyword in prompt:
                return responses[key]
    return "Xin lỗi, tôi không hiểu câu hỏi của bạn."

# API endpoint để nhận thông tin từ người dùng và trả về câu trả lời
class Message(BaseModel):
    user_input: str

@app.post("/chatbot/")
async def chatbot_response(message: Message):
    user_input = message.user_input
    response = get_response(user_input)
    return {"response": response}

# # data = {
#     "greeting": "Xin chào! Tôi là chatbot của khách sạn. Có gì tôi có thể giúp bạn?",
#     "booking_info": "Bạn có thể đặt phòng qua trang web của chúng tôi hoặc liên hệ trực tiếp qua điện thoại.",
#     "check_in_time": "Giờ nhận phòng là sau 2 giờ chiều.",
#     "check_out_time": "Giờ trả phòng là trước 12 giờ trưa.",
#     "facilities": "Khách sạn chúng tôi có hồ bơi, phòng gym, spa và nhà hàng.",
#     "location": "Khách sạn nằm tại 123 Đường ABC, Quận 1, TP.HCM."
#  }
# # Load pre-trained GPT-2 model and tokenizer
# model_name = "gpt2"
# model = GPT2LMHeadModel.from_pretrained(model_name)
# tokenizer = GPT2Tokenizer.from_pretrained(model_name)
# # Hàm để sinh câu trả lời từ GPT-2 hoặc dữ liệu cố định
# def get_gpt2_response(prompt):
#     # Kiểm tra xem câu nhập của người dùng có khớp với các câu trả lời cố định không
#     for key, value in data.items():
#         if key in prompt.lower():
#             return value
#     # Nếu không khớp, sinh câu trả lời từ mô hình GPT-2
#     inputs = tokenizer.encode(prompt, return_tensors="pt")
#     attention_mask = torch.ones_like(inputs)
#     temperature = 0.1  # Điều chỉnh độ "mềm" của phân phối xác suất khi sinh ra từng từ tiếp theo
#     top_k = 10         # Chỉ cho phép mô hình xem xét top 50 từ có xác suất cao nhất
#     top_p = 0.3        # Chỉ cho phép mô hình xem xét các từ có tổng xác suất lớn hơn 90%
#     # Sinh câu trả lời
#     outputs = model.generate(
#         inputs,
#         attention_mask=attention_mask,
#         max_length=100,
#         num_return_sequences=1,
#         pad_token_id=tokenizer.eos_token_id,
#         temperature=temperature,
#         top_k=top_k,
#         top_p=top_p,
#     )
#     response = tokenizer.decode(outputs[0], skip_special_tokens=True)
#     return response
# class Message(BaseModel):
#     user_input: str
# @app.post("/chatbot/")
# async def chatbot_response(message: Message):
#     user_input = message.user_input.lower()
#     # Gọi hàm để sinh câu trả lời
#     response = get_gpt2_response(user_input)
#     return {"response": response}
