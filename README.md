# ONGym_YIC2022
Đây là sản phẩm dự thi tin học trẻ được tổ chức tại thành phố Đà Nẵng năm 2022.
Bản quyền tác giả thuộc Nguyễn Xuân Việt Long và team RCG.



Hướng dẫn sử dụng:

Đầu tiên máy của bạn phải có NodeJS, cài đặt tại đây: https://nodejs.org/en/download/


Mở terminal trỏ vào folder và nhập: npm start


Truy cập tại địa chỉ http://localhost:8888/trangchu


Nếu khởi chạy mà báo lỗi canvas thì lí do là vì phiên bản canvas không phù hợp, chỉnh sửa lại như sau:

Xoá node_modules

Xoá package-lock.json

npm uninstall canvas

npm i

npm install

npm rebuild --build-from-source canvas

npm rebuild canvas --update-binary

npm uninstall canvas

npm i canvas@latest


Nguồn công nghệ sử dụng chính: https://github.com/tensorflow/tfjs-models.git
