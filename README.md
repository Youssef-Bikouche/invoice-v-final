# � Invoice Management System

![Project Screenshot](./screenshot.png) *Replace with actual screenshot*

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
- React
- CSS Modules
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
   ```bash
   git clone https://github.com/yourusername/invoice-system.git
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma migrate dev
npm start
