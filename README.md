![S](https://github.com/user-attachments/assets/f96a9bdc-36d0-4f6f-95c0-bad89f0882b9)

A full-stack invoice management system with PDF generation and email capabilities, built with React, Express, and PostgreSQL.


## ✨ Features

- **Company Management**
  - Secure authentication
  - Profile customization with logos
  - Account management

- **Product & Client Management**
  - Add/edit/delete products
  - Manage client database
  - Quick search functionality

- **Invoice System**
  - Generate professional PDF invoices
  - Automatic calculations (tax, discounts)
  - Email invoices directly to clients
  - Invoice history tracking

## 🛠 Tech Stack

**Frontend**:
- React js
- SCSS
- EasyInvoice (PDF generation)

**Backend**:
- Node.js & Express
- Prisma ORM
- PostgreSQL

**Services**:
- SendGrid (Email delivery)
- Multer (File uploads)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running on port 5432)
- SendGrid API key (optional for email)

### Installation

1. **Clone the repository**
   - git clone https://github.com/Youssef-Bikouche/invoice-v-final
     
2. **Edit .env with your credentials**
- npx prisma migrate dev
- npm start
3. **set up backend** 
- cd server
- npm install
- cp .env.example .env

## 🌟 Upcoming Features
- Dashboard analytics
- Multi-language support
- Cloud storage integration
