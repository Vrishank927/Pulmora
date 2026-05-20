# 🫁 Pumlora - AI-Powered Chest X-Ray Analysis

A full-stack medical imaging application that uses deep learning to analyze chest X-rays for pneumonia detection and severity assessment.

## 📁 Project Structure

```
Pumlora_dj_new/
├── Pumlora_dj/
│   └── mysite/
│       ├── mysite/              # Django backend
│       │   ├── core/            # API, models, ML logic
│       │   ├── mysite/          # Django settings & config
│       │   └── manage.py
│       └── pulmora-frontend/    # React + Vite frontend
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Python** 3.10+ ([Download](https://www.python.org/downloads/))
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git**

---

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd Pumlora_dj_new
```

---

### 2️⃣ Backend Setup (Django)

Navigate to the Django project:

```bash
cd Pumlora_dj/mysite/mysite
```

#### Create & Activate Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### ⚠️ Add ML Model Files

> The PyTorch model files (`.pt`) are **not included** in this repository due to file size limits.

Place the following files inside:
```
core/ml/best_pulmora_model_BC.pt   # Binary Classification model
core/ml/best_pulmora_model_MC.pt   # Multi-Class Severity model
```

Contact the project owner or check the release assets to obtain these files.

#### Apply Migrations

```bash
python manage.py migrate
```

#### Create Superuser (Optional - for Django Admin)

```bash
python manage.py createsuperuser
```

#### Run Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://127.0.0.1:8000`

---

### 3️⃣ Frontend Setup (React + Vite)

Open a **new terminal** and navigate to the frontend:

```bash
cd Pumlora_dj/mysite/pulmora-frontend
```

#### Install Dependencies

```bash
npm install
```

#### Run Development Server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test/` | GET | Health check |
| `/api/register/` | POST | Register new user |
| `/api/api-token-auth/` | POST | Obtain auth token |
| `/api/patient/create/` | POST | Create patient profile |
| `/api/patient/profile/` | GET | Get patient profile |
| `/api/xray/upload/` | POST | Upload X-ray image |
| `/api/prediction/<id>/` | GET | Get AI prediction for uploaded X-ray |
| `/api/report/<id>/` | GET | Generate medical report |
| `/api/reports/` | GET | List all reports |

---

## ⚙️ Environment Variables (Optional)

Create a `.env` file in `Pumlora_dj/mysite/mysite/` if needed:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
```

> ⚠️ **Never commit `.env` files to Git!** They are already ignored.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Django, Django REST Framework |
| Frontend | React, Vite, Tailwind CSS |
| ML | PyTorch, TorchVision |
| Auth | Token Authentication |

---

## 📜 License

This project is for educational and research purposes.

