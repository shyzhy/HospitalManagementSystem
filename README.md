# 🏥 MedFlow | Hospital Management System

**MedFlow** is a modern, full-stack Hospital Management System (HMS) designed to streamline patient care, appointment scheduling, and medical record-keeping. Built with a focus on speed, security, and a premium user experience, MedFlow bridges the gap between healthcare providers and patients through a centralized, intuitive dashboard.

---

## 🚀 Key Features

* **Role-Based Access Control (RBAC):** Dedicated interfaces for **Admins, Doctors, and Patients**, ensuring secure data access and specialized workflows.
* **Smart Appointment Management:** Real-time scheduling with automatic physician assignment and "Self-Service" options for patients to view or cancel consultations.
* **Comprehensive Medical Records:** Unified digital profiles for patients including blood type, allergies, chronic conditions, and full treatment history.
* **Digital Prescriptions & Treatments:** Automated tracking of medication dosages, frequencies, and physician-led treatment plans.
* **Live Search & Filtering:** Instant, real-time search bars across all lists (Patients, Consultations, Doctors) for rapid data retrieval.
* **Responsive UI/UX:** A high-end, "Glassmorphism" inspired dashboard built with React and Tailwind CSS.

---

## 🛠️ Tech Stack

* **Frontend:** React (TypeScript), Tailwind CSS, Axios.
* **Backend:** Django REST Framework (DRF), Djoser Auth.
* **Database:** SQLite (Development) / PostgreSQL (Production).

---

## ⚙️ Installation & Setup

### Prerequisites
* **Python** 3.10+
* **Node.js** 18+

### 1. Backend Setup (Django)
```bash
# Navigate to backend folder
cd backend

# Create and activate virtual environment
python -m venv venv

# Activate on Windows:
.\venv\Scripts\activate
# Activate on Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Database Setup
python manage.py makemigrations
python manage.py migrate

# Create Admin User
python manage.py createsuperuser

# Start Server
python manage.py runserver
```

### 2. Frontend Setup (React)
```bash
# Navigate to frontend folder
cd frontend

# Install packages
npm install

# Start Development Server
npm start
```

## 🔗 API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET / POST` | `/api/v1/doctors/` | List all doctors or add a new one |
| `GET / PUT / DELETE` | `/api/v1/doctors/<id>/` | Retrieve, update, or delete a specific doctor |
| `GET / POST` | `/api/v1/patients/` | List all patients or add a new one |
| `GET / PUT / DELETE` | `/api/v1/patients/<id>/` | Retrieve, update, or delete a specific patient |
| `GET / POST` | `/api/v1/consultations/` | List all consultations or book a new one |
| `GET / PUT / DELETE` | `/api/v1/consultations/<id>/` | Retrieve, update, or delete a consultation |
| `GET / POST` | `/api/v1/prescriptions/` | List all prescriptions or add a new one |
| `GET / PUT / DELETE` | `/api/v1/prescriptions/<id>/` | Retrieve, update, or delete a prescription |
| `GET / POST` | `/api/v1/treatments/` | List all treatments or add a new one |
| `GET / PUT / DELETE` | `/api/v1/treatments/<id>/` | Retrieve, update, or delete a treatment |
| `GET / POST` | `/api/v1/medical_records/` | List all medical records or add a new one |
| `GET / PUT / DELETE` | `/api/v1/medical_records/<id>/` | Retrieve, update, or delete a medical record |
