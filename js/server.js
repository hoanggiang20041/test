const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware để xử lý JSON từ request
app.use(bodyParser.json());

// File lưu trữ người dùng
const usersFile = 'users.json';

// Đọc thông tin người dùng từ file
function readUsers() {
    if (fs.existsSync(usersFile)) {
        const data = fs.readFileSync(usersFile);
        return JSON.parse(data);
    }
    return [];
}

// Lưu thông tin người dùng vào file
function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Đăng ký người dùng
app.post('/register', (req, res) => {
    const { username, password, fullName, dob, address } = req.body;
    const users = readUsers();

    // Kiểm tra xem tên người dùng đã tồn tại chưa
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.json({ message: 'Tên người dùng đã tồn tại.' });
    }

    // Thêm người dùng mới vào danh sách
    const newUser = { username, password, fullName, dob, address };
    users.push(newUser);
    writeUsers(users);

    return res.json({ message: 'Đăng ký thành công.' });
});

// Đăng nhập người dùng
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    // Tìm người dùng với tên đăng nhập và mật khẩu khớp
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        return res.json({ message: 'Đăng nhập thành công' });
    } else {
        return res.json({ message: 'Tên người dùng hoặc mật khẩu không đúng.' });
    }
});

// Server lắng nghe
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
