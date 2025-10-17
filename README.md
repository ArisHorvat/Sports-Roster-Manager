# 🏈 Sports Roster Manager

**Sports Roster Manager** is a full-featured application to manage athletes across multiple sports. Users can add, edit, filter, and organize players, track real-time statistics, and securely manage access with authentication.  

---

## ✨ Features

### Player Management
- **🧑‍💼 Add Players**: Create new player profiles with detailed information.  
- **✏️ Edit Players**: Update player information and assign to teams.  
- **🔄 Transfer Players**: Release players or assign them to another team.  
- **🔍 Filter Players**: Search and filter by name, team, or sport category.  
- **👀 View Other Teams’ Players**: Browse players in other teams.  

### Real-Time Stats & Data
- **📊 Statistics**: Monitor player performance in real time.  
- **💾 Caching**: Improve performance and reduce load times with cached data.  
- **📁 File Upload/Download**: Manage player assets like photos or documents.  

### Security & Backend
- **🔒 JWT Authentication**: Secure login and access control.  
- **⚙️ Backend API**: ASP.NET Core Web API serving all frontend requests.  
- **🗄 Database**: SQL Server with relational structure for players and stats.  

---

## 🛠 Tech Stack
- **Frontend**: WinUI 3 (desktop)  
- **Backend**: ASP.NET Core Web API  
- **Database**: SQL Server, Entity Framework Core  
- **Authentication**: JWT Token based  
- **Architecture**: MVVM, Code First, Clean Architecture principles  

---

## ⚡ Installation

### Backend
1. Clone the repository:  
```bash
git clone <repo-url>
```
2. Open the solution in **Visual Studio 2022** (or later) with **.NET 8 SDK** installed.  
3. Run the **Backend API project**.

### Frontend
1. Open and run the **WinUI 3 frontend project**.  
2. Connect it to the backend API for full functionality.

---

## 📡 API Endpoints (Examples)
- **GET /api/players**: Retrieve all players.  
- **GET /api/players/{id}**: Retrieve a specific player by ID.  
- **POST /api/players**: Add a new player.  
- **PUT /api/players/{id}**: Edit a player’s information.  
- **DELETE /api/players/{id}**: Release a player from the system.  
- **GET /api/players/filter**: Filter players by name, team, or category.  
- **POST /api/auth/login**: Authenticate and get a JWT token.  
- **POST /api/files/upload**: Upload player-related files.  
- **GET /api/files/download/{fileId}**: Download player files.  

> **Note:** All sensitive endpoints require a valid JWT token.

---

## 🚀 Usage
- Add, edit, and manage players in real time.  
- Filter and search players by team, sport, or name.  
- Release or transfer players between teams.  
- Track real-time statistics and player performance.  
- Upload and download files related to players.  
- Securely log in with JWT authentication.

---

## 🤗 Enjoy Sports Roster Manager!
This project is perfect for coaches, sports managers, and developers who want a full-featured roster management system with real-time stats and secure authentication. 🏆  

Happy managing! 🎉
