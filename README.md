# 🏥 Hospital Management System (HMS)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Java](https://img.shields.io/badge/Java-24-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive **Hospital Management System** with integrated **Annual Report Generation** capabilities, built as a final year project. This enterprise-level application manages all aspects of hospital operations including patient admissions, laboratory tests, pharmacy, dialysis, and real-time bed management.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Modules](#-modules)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 🏨 **Ward Management**
- ✅ Real-time bed occupancy tracking with color-coded visualization
- ✅ Patient admission and discharge workflow
- ✅ Inter-ward patient transfer management
- ✅ Bed assignment and availability monitoring
- ✅ Patient information modal on bed selection

### 🔬 **Laboratory Management**
- ✅ Test order creation and tracking
- ✅ Sample collection and processing
- ✅ Multiple test types (CBC, Blood Glucose, Cholesterol, Urine Analysis)
- ✅ Results entry and validation
- ✅ Lab analytics and quality control
- ✅ Equipment management

### 💊 **Pharmacy Management**
- ✅ Medication inventory tracking
- ✅ Prescription processing and dispensing
- ✅ Low stock alerts and reordering
- ✅ Drug database management
- ✅ Pharmacy analytics and reporting

### 🩺 **Dialysis Management**
- ✅ Dialysis session scheduling
- ✅ Machine allocation and tracking
- ✅ Patient session history
- ✅ Analytics and reporting

### 🏢 **Clinic Management**
- ✅ Clinic appointments
- ✅ Prescription management
- ✅ Patient consultation tracking

### 📊 **Analytics & Reporting**
- ✅ Real-time dashboards for all modules
- ✅ Statistical analysis and visualization
- ✅ PDF report generation
- ✅ Annual hospital reports
- ✅ Performance metrics

### 🔐 **Security & Authentication**
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin, Doctor, Nurse, Lab Staff, Pharmacist)
- ✅ Secure API endpoints
- ✅ Session management

### 📡 **Real-time Features**
- ✅ WebSocket integration for live updates
- ✅ Real-time bed status updates
- ✅ Live lab test notifications
- ✅ Prescription status updates
- ✅ Analytics data streaming

---

## 🛠️ Technology Stack

### **Backend**
- **Framework:** Spring Boot 3.5.4
- **Language:** Java 24
- **Database:** MySQL 8.0
- **ORM:** JPA/Hibernate
- **Security:** Spring Security + JWT
- **Real-time:** WebSocket (STOMP)
- **PDF Generation:** iText
- **Build Tool:** Maven

### **Frontend**
- **Framework:** React 19.1.0
- **Build Tool:** Vite 6.3.5
- **Routing:** React Router DOM 7.6.2
- **Styling:** Tailwind CSS 3.4.17
- **HTTP Client:** Axios 1.11.0
- **Charts:** Chart.js 4.5.1 + react-chartjs-2
- **Icons:** Lucide React
- **WebSocket:** STOMP.js + SockJS
- **State Management:** React Hooks

### **Development Tools**
- **Version Control:** Git
- **API Testing:** Postman
- **Code Editor:** VS Code
- **Package Manager:** npm (Frontend), Maven (Backend)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Ward   │  │   Lab    │  │ Pharmacy │  │ Dialysis │   │
│  │Dashboard │  │Dashboard │  │Dashboard │  │Dashboard │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│              Application Layer (Spring Boot)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │   Services   │  │ Repositories │     │
│  │  (REST API)  │  │ (Business    │  │  (Data       │     │
│  │              │  │  Logic)      │  │   Access)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ JPA/Hibernate
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer (MySQL)                         │
│  Patients | Admissions | Wards | Lab Tests | Prescriptions  │
│  Medications | Dialysis Sessions | Transfers | Reports      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Modules

### 1. **Ward Management** 🏨
Comprehensive patient ward management with real-time bed tracking.

**Components:**
- Bed Management (Color-coded occupancy)
- Patient Admission/Discharge
- Transfer Management
- Lab Request Integration
- Prescription Management
- Analytics & Reporting

**API Endpoints:**
```
POST   /api/admissions/admit
PUT    /api/admissions/discharge/{id}
PUT    /api/admissions/transfer/{id}/ward/{wardId}/bed/{bedNumber}
GET    /api/admissions/active
GET    /api/admissions/getAll
GET    /api/wards/getAll
```

### 2. **Laboratory Management** 🔬
Complete laboratory workflow from test ordering to result reporting.

**Features:**
- Test Catalog Management
- Sample Collection
- Test Processing
- Result Entry (CBC, Glucose, Cholesterol, Urine)
- Quality Control
- Equipment Tracking

**API Endpoints:**
```
POST   /api/lab-requests/create
GET    /api/lab-requests/patient/{nationalId}
POST   /api/test-results/save
GET    /api/test-results/all
GET    /api/tests/getAll
```

### 3. **Pharmacy Management** 💊
Medication inventory and prescription dispensing system.

**Features:**
- Drug Database
- Inventory Management
- Prescription Processing
- Dispensing Control
- Stock Alerts
- Analytics

**API Endpoints:**
```
POST   /api/prescriptions/create
GET    /api/prescriptions/patient/{nationalId}
POST   /api/pharmacy/dispense
GET    /api/medications/getAll
```

### 4. **Dialysis Management** 🩺
Dialysis session scheduling and machine management.

**Features:**
- Session Scheduling
- Machine Allocation
- Patient History
- Analytics

### 5. **Admin & Authentication** 🔐
User management and access control.

**Features:**
- User Authentication (JWT)
- Role Management
- Access Control
- Admin Dashboard

---

## 💻 Installation

### Prerequisites
- **Java Development Kit (JDK) 24** or higher
- **Node.js 18+** and npm
- **MySQL 8.0+**
- **Maven 3.8+**
- **Git**

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project.git
cd hospital-annual-report-generation-system-final-year-project
```

2. **Configure MySQL Database**
```sql
CREATE DATABASE hms;
```

3. **Update application.properties**
```properties
# Navigate to: HMS/src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/hms
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

4. **Build and Run Backend**
```bash
cd HMS
./mvnw clean install
./mvnw spring-boot:run
```

Backend server will start at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Frontend application will start at `http://localhost:5173`

---

## ⚙️ Configuration

### Backend Configuration (`application.properties`)

```properties
# Application Name
spring.application.name=HMS

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/hms
spring.datasource.username=root
spring.datasource.password=

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server Port
server.port=8080

# Actuator Endpoints
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

### Frontend Configuration

The frontend uses environment variables. Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
```

---

## 🚀 Usage

### Accessing the Application

1. **Start Backend Server**
   - Navigate to `HMS` folder
   - Run: `./mvnw spring-boot:run`
   - Backend available at: `http://localhost:8080`

2. **Start Frontend Application**
   - Navigate to `frontend` folder
   - Run: `npm run dev`
   - Frontend available at: `http://localhost:5173`

### Default Login Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123`

**Doctor:**
- Username: `doctor`
- Password: `doctor123`

**Nurse:**
- Username: `nurse`
- Password: `nurse123`

### Key Workflows

#### 1. **Admitting a Patient**
1. Navigate to Ward Management → Admit Patient
2. Search and select patient
3. Choose ward and bed number
4. Set admission date/time
5. Submit admission

#### 2. **Creating Lab Request**
1. Navigate to Ward Management → Lab Requests
2. Click "Create New Request"
3. Select patient and tests
4. Submit request
5. Lab staff will process in Lab Dashboard

#### 3. **Dispensing Medication**
1. Navigate to Pharmacy Dashboard
2. View pending prescriptions
3. Select prescription to dispense
4. Verify medication availability
5. Complete dispensing

#### 4. **Viewing Bed Occupancy**
1. Navigate to Ward Management → Beds
2. View color-coded bed grid:
   - 🟢 **Green**: Available
   - 🔴 **Red**: Occupied
3. Click occupied bed to view patient details

---

## 📚 API Documentation

### Authentication

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response: { "token": "jwt_token_here" }
```

### Ward Management APIs

**Get All Active Admissions**
```http
GET /api/admissions/active
Authorization: Bearer {token}

Response: [
  {
    "admissionId": 101,
    "patientName": "John Doe",
    "wardId": 1,
    "bedNumber": "101",
    "admissionDate": "2025-10-17T10:00:00"
  }
]
```

**Admit Patient**
```http
POST /api/admissions/admit
Authorization: Bearer {token}
Content-Type: application/json

{
  "patientNationalId": "123456789",
  "wardId": 1,
  "bedNumber": "101"
}
```

### Lab Management APIs

**Get All Test Results**
```http
GET /api/test-results/all
Authorization: Bearer {token}

Response: [
  {
    "resultId": 1,
    "patientName": "John Doe",
    "testName": "Complete Blood Count",
    "status": "COMPLETED",
    "resultDate": "2025-10-17T14:30:00"
  }
]
```

For complete API documentation, visit: `http://localhost:8080/swagger-ui.html` (when server is running)

---

## 📸 Screenshots

### Ward Management - Bed Overview
*Real-time bed occupancy with color-coded status (Green: Available, Red: Occupied)*

### Laboratory Dashboard
*Test order management and result entry interface*

### Pharmacy Dashboard
*Medication inventory and prescription processing*

### Analytics Dashboard
*Comprehensive hospital statistics and charts*

---

## 🗄️ Database Schema

### Key Tables

**patients**
- national_id (PK)
- name, date_of_birth, gender, contact

**wards**
- ward_id (PK)
- ward_name, ward_type

**admissions**
- admission_id (PK)
- patient_id (FK), ward_id (FK)
- bed_number, admission_date, status

**lab_requests**
- request_id (PK)
- patient_id (FK), requester_id (FK)
- status, created_date

**test_results**
- result_id (PK)
- request_id (FK), test_id (FK)
- result_data, result_date

**prescriptions**
- prescription_id (PK)
- patient_id (FK), admission_id (FK)
- medication_details, status

**medications**
- medication_id (PK)
- name, dosage, stock_quantity

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Standards
- Follow Java/Spring Boot best practices
- Use React hooks and functional components
- Write meaningful commit messages
- Add comments for complex logic
- Ensure all tests pass before submitting PR

---

## 📝 Project Structure

```
hospital-annual-report-generation-system-final-year-project/
├── HMS/                                 # Backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/HMS/HMS/
│   │   │   │   ├── config/           # Security, WebSocket config
│   │   │   │   ├── controller/       # REST API endpoints
│   │   │   │   ├── model/            # JPA entities
│   │   │   │   ├── repository/       # Data access layer
│   │   │   │   ├── service/          # Business logic
│   │   │   │   ├── DTO/              # Data transfer objects
│   │   │   │   └── websocket/        # WebSocket handlers
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                     # Unit tests
│   └── pom.xml                       # Maven dependencies
│
├── frontend/                          # Frontend (React)
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── ward/                 # Ward management
│   │   │   ├── lab/                  # Laboratory
│   │   │   ├── pharmacy/             # Pharmacy
│   │   │   ├── Dialysis/             # Dialysis
│   │   │   ├── Clinic/               # Clinic
│   │   │   └── admin/                # Admin portal
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # Entry point
│   ├── public/                       # Static assets
│   ├── package.json                  # npm dependencies
│   └── vite.config.js                # Vite configuration
│
└── README.md                         # This file
```

---

## 🎯 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Advanced AI-based diagnosis suggestions
- [ ] Telemedicine integration
- [ ] Electronic Health Records (EHR) export
- [ ] Insurance claim processing
- [ ] Appointment SMS/Email notifications
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced reporting with custom filters
- [ ] Integration with medical devices

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Developer:** Dilshan Perera  
**Institution:** [Your University Name]  
**Project Type:** Final Year Project  
**Year:** 2025  

---

## 📞 Contact

**Dilshan Perera**
- GitHub: [@Dilshan2002104-cpu](https://github.com/Dilshan2002104-cpu)
- Email: your.email@example.com
- LinkedIn: [Your LinkedIn Profile]

**Project Link:** [https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project](https://github.com/Dilshan2002104-cpu/hospital-annual-report-generation-system-final-year-project)

---

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- MySQL Documentation
- Chart.js Community
- Tailwind CSS Team
- All contributors and supporters

---

## 📊 Project Status

**Current Version:** 1.0.0  
**Status:** ✅ Active Development  
**Last Updated:** October 2025  

---

<div align="center">
  <p>Made with ❤️ for better healthcare management</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
