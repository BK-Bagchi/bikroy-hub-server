# 🛒 BikroyHub

Bikroy Hub is a peer-to-peer (P2P) marketplace where buyers and sellers can connect, post ads, and exchange goods.
It comes with secure **authentication**, **payment escrow system**, **admin dashboard**, and **dispute resolution system**.

---

## 🚀 Features

### 🔑 Authentication

- Google Login (handled on frontend with JWT).
- JWT token-based authentication & session management.
- Logout clears token and resets session.

### 📦 Ads Management

- Admin Ads Preview → Admin can accept or reject ads before publishing.
- Rejected ads by admin won't appear to system user.
- Post Ads with image upload (via ImgBB API).
- Store display_url and delete_url in database.
- Delete ads (both DB entry and image).
- View Posted Ads with "See More" toggle.

### 💳 Escrow Payment System (SSLCommerz Integration)

- Buyer pays Admin during purchase.
- On delivery confirmation, Seller can claim money from Admin.
- On order cancel/refund, Buyer can request refund from Admin.
- Admin acts as escrow to secure transactions.

### ⚖️ Dispute Management

- Buyer or Seller can raise disputes.
- Admin Dashboard → Admin can monitor and resolve disputes.
- Helps ensure trust and fairness in transactions.

### 💬 Real-time chatting option

- Real-time chat using Socket.IO for smooth buyer-seller communication.

### 🎨 UI/UX

- Responsive design with Bootstrap.
- Search bar with responsive layout.
- Responsive typography (font-size scales by screen size).

---

## ✨ Why This Project Stands Out

- **Real-World Application** → Implements a marketplace with escrow logic, similar to OLX/eBay.
- **Scalable Full-Stack Architecture** → Built with React, Node.js, Express, MongoDB.
- **Secure Payments** → Integrated SSLCommerz Payment Gateway to handle real transactions.
- **Escrow System** → Admin securely holds funds until delivery is confirmed.
- **Admin Controls** → Dispute management + ad approval flow ensures platform integrity.

This project showcases my ability to design, build, and deploy production-level applications with end-to-end functionality. 🚀

---

## 🛠️ Tech Stack

### Frontend

- React (CRA)
- React Router v5
- Bootstrap
- Axios

### Backend

- Node.js + Express.js
- MongoDB (Mongoose)
- JWT Authentication
- SSLCommerz Payment Gateway Integration

### Storage & APIs

- ImgBB (for image hosting)
- Custom REST APIs for ads, payments, disputes

### Real-time chat

- 💬 Real-time chat using Socket.IO for smooth buyer-seller communication.

---

## 📂 Project Structure

```
bikroy-hub/
│── bikroy-hub-server/             # Back-end of this project (built with NodeJS, ExpressJS, MongoDB, Mongoose)
│── public/
│── src/
    │── Components/
        │── About/                  # About component
        │── Admin/                  # Admin dashboard
        │── AdsHome/                # Component to show ads at home screen
        │── Bottom/                 # Bottom  component
        │── Categories/             # Component to show different categories
        │── Chat/                   # Buyer-seller chat box component
        │── Database/               # Few static data(Ex: Categories)
        │── Main/                   # All component routes here using react-router
        │── MyAccount/              # Shows different tabs of user account
        │── MyProfile/              # Shows user profile and edit profile
        │── PaymentNotification/    # Success or fail payment notification component
        │── PostAd/                 # Post and edit ad, shows buyer and seller order details
        │── Search/                 # Search component
        │── ShowAds/                # Shows user selected ad
        │── Sign/                   # Sign in using auth component
        │── Top/                    # Contents Navbar and project name
    │── Hooks/                      # Custom hook for JWT Token decode
    │── Resources/                  # Resources component
│── .env/                           # Environment variables
│── Readme.md/                      # Project description
```

---

## 🔑 Environment Variables

### Frontend (.env)

```
# backend server
REACT_APP_API_BASE_URL=http://localhost:5000
# for img upload
REACT_APP_API_KEY=your_imgbb_api_key
```

### Backend (.env)

```
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_PORT=your_db_port
SSL_STORE_ID=your_ssl_store_id
SSL_STORE_NAME=your_ssl_store_name
SSL_STORE_PASSWORD=your_store_password
BASE_URL=your_base_url
FRONT_URL=your_front_url
JWT_SECRET=your_jwt_secret
FIREBASE_SERVICE_ACCOUNT_KEY='your_firebase_account_key'
```

---

## ⚙️ Setup & Installation

1. Create dir and Clone front-end

```
mkdir bikroy-hub
cd bikroy-hub
git clone git@github.com:<your-name>/bikroy-hub.git
npm install
npm run start
```

Get front-end repository [here](https://github.com/BK-Bagchi/bikroy-hub).

2. Create dir and Clone back-end

```
mkdir bikroy-hub-server
cd bikroy-hub-server
git clone git@github.com:<your-name>/bikroy-hub-server.git
npm install
npm run start
```

Get back-end repository [here](https://github.com/BK-Bagchi/bikroy-hub-server).

---

## 🚀 Usage Flow

### 🛠️ Admin Activities

- 👁️ **Preview Ads** → Admin reviews all newly posted ads.
- ✅ **Approve Ads** → Publish only valid/verified ads.
- ❌ **Reject Ads** → Decline suspicious or invalid listings.
- ⚖️ **Dispute Handling** → Monitor disputes between buyer & seller.
- 💰 **Escrow Fund Release** → Send payments to seller after delivery confirmation.
- 💸 **Refund Management** → Refund buyers in case of order cancellation.

You can check admin dashboard [here](https://bikroy-hub.netlify.app/admin). Currently it is open for everyone to see.

### 🛒 Buyer Activities

- 🔍 **Browse & Search Ads** → Find products by category or keyword.
- 💳 **Flexible Payment Options** → Pay fully online (held in escrow) or opt for Cash on Delivery.
- 📦 **Order Confirmation** → Confirm order pickup/delivery.
- 💬 **Real-time Chat** → Buyers and sellers can communicate directly for negotiation and updates.
- 🛑 **Dispute Raise** → Report issues directly to Admin for resolution.
- 💸 **Refund Requests** → Ask admin for refund in case of disputes/cancellations.

### 🤝 Seller Activities

- 📤 **Post Ads** → Upload products with images, description, and price.
- ⏳ **Wait for Admin Approval** → Ads are verified before publishing.
- 📦 **Fulfill Orders** → Deliver the product once buyer confirms purchase.
- 💬 **Real-time Chat** → Buyers and sellers can communicate directly for negotiation and updates.
- 💰 **Claim Payment** → Receive money from Admin after buyer confirms delivery.
- 🛑 **Dispute Raise** → Contact Admin if facing issues with buyer.

---

## 🗺️ Roadmap

1. ✅ Google login + JWT authentication
2. ✅ Ads posting & admin approval system
3. ✅ SSLCommerz escrow payment integration
4. ✅ Dispute management with admin panel
5. ✅ Buyer–Seller chat system
6. ✅ Advanced analytics for Admin

---

## 🚧 Future Improvements

- 🔔 Push Notifications → Notify users about order updates, payments, and disputes.
- ⭐ Ratings & Reviews → Buyers can rate sellers to build trust and credibility.
- 📱 Mobile App (React Native / Flutter) → Expand the platform to Android and iOS.
- 🛡️ Enhanced Security → Two-factor authentication (2FA) and stronger fraud detection.
- 📊 Analytics Dashboard → Insights for Admin on sales, disputes, and user growth.
- 🏦 Multiple Payment Gateways → Support bKash, Nagad, Stripe, and PayPal alongside SSLCommerz.

---

## 👨‍💻 Author

Developed with ❤️ by Balay Kumar Bagchi

### 👨 About Me

I’m Balay Kumar Bagchi, a Full-Stack Developer passionate about building scalable, real-world applications.
This project demonstrates my ability to:

- Architect secure, production-ready systems.
- Handle complex business logic like escrow payments & disputes.
- Deliver end-to-end solutions (frontend + backend + integration).

📫 Let’s connect → [LinkedIn](https://www.linkedin.com/in/bkbagchi-dipto/) | [Portfolio](https://bkbagchi-dipto.netlify.app/) | [Email](bkbagcchi.dipto@gmail.com) | [Github](https://github.com/bk-bagchi)
