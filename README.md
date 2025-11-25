# Payment Card Tool Client

## Để run: Trong terminal tại folder PaymentcardtoolsClient chạy lệnh:

```bash
npm run dev
```

## Yêu cầu hệ thống

- Node.js (phiên bản 16.x trở lên)
- npm hoặc yarn

## Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/Waito3007/PaymentcardtoolsClient.git
cd PaymentcardtoolsClient
```

### 2. Cài đặt dependencies

```bash
npm install
```

hoặc nếu sử dụng yarn:

```bash
yarn install
```

## Khởi động ứng dụng

### Development mode

Chạy ứng dụng ở chế độ development với hot reload:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Build production

Build ứng dụng cho production:

```bash
npm run build
```

Các file build sẽ được tạo trong thư mục `dist/`

### Preview production build

Xem trước bản build production:

```bash
npm run preview
```

### Lint code

Kiểm tra code với ESLint:

```bash
npm run lint
```

## Cấu trúc thư mục

```
PaymentcardtoolsClient/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   │   └── logo/       # Logo files
│   ├── components/     # React components
│   │   ├── Pagination.jsx
│   │   ├── ResultBadge.jsx
│   │   ├── ResultTable.jsx
│   │   ├── SummaryCard.jsx
│   │   └── Toolbar.jsx
│   ├── utils/          # Utility functions
│   │   └── listing.js
│   ├── App.jsx         # Main App component
│   ├── App.css         # App styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## Công nghệ sử dụng

- **React 19.2.0** - UI Library
- **Vite 7.2.4** - Build tool & dev server
- **ESLint** - Code linting

## Troubleshooting

### Lỗi khi cài đặt dependencies

Thử xóa `node_modules` và `package-lock.json`, sau đó cài lại:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port đã được sử dụng

Nếu port 5173 đã được sử dụng, Vite sẽ tự động chọn port khác. Kiểm tra terminal để xem port đang sử dụng.

## License

Private project
