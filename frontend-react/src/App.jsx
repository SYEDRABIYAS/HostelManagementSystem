import { useState } from "react";
import Student from "./components/Student";
import Room from "./components/Room";
import Fee from "./components/Fee";
import Report from "./components/Report";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">H</div>

          <div>
            <h2>HostelHub</h2>
            <p>Management System</p>
          </div>
        </div>

        <div className="nav-title">
          MAIN MENU
        </div>

        <nav className="navigation">

          <button
            className={
              activePage === "Dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("Dashboard")}
          >
            <span className="nav-icon">⌂</span>
            Dashboard
          </button>

          <button
            className={
              activePage === "Students"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("Students")}
          >
            <span className="nav-icon">♙</span>
            Students
          </button>

          <button
            className={
              activePage === "Rooms"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("Rooms")}
          >
            <span className="nav-icon">▦</span>
            Rooms
          </button>

          <button
            className={
              activePage === "Fees"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("Fees")}
          >
            <span className="nav-icon">₹</span>
            Fees
          </button>

          <button
            className={
              activePage === "Reports"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("Reports")}
          >
            <span className="nav-icon">▤</span>
            Reports
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button className="nav-item">
            <span className="nav-icon">⚙</span>
            Settings
          </button>

          <div className="profile">

            <div className="profile-avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>

          </div>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* DASHBOARD */}
        {activePage === "Dashboard" && (
          <Dashboard
            setActivePage={setActivePage}
          />
        )}

        {/* STUDENTS */}
        {activePage === "Students" && (
          <Student />
        )}

        {/* ROOMS */}
        {activePage === "Rooms" && (
          <Room />
        )}

        {/* FEES */}
        {activePage === "Fees" && (
          <Fee />
        )}

        {/* REPORTS */}
        {activePage === "Reports" && (
          <Report />
        )}

      </main>

    </div>
  );
}


/* ================================================= */
/* DASHBOARD                                         */
/* ================================================= */

function Dashboard({ setActivePage }) {

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">

        <div>

          <div className="eyebrow">
            WELCOME BACK 👋
          </div>

          <h1>
            Hostel Dashboard
          </h1>

          <p>
            Here's what's happening in your hostel today.
          </p>

        </div>

        <div className="today">
          📅 Today
        </div>

      </div>


      {/* STAT CARDS */}
      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon students-icon">
              ♙
            </div>

            <span className="stat-label">
              TOTAL STUDENTS
            </span>

          </div>

          <h2>7</h2>

          <p>
            Currently registered
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon rooms-icon">
              ▦
            </div>

            <span className="stat-label">
              TOTAL ROOMS
            </span>

          </div>

          <h2>25</h2>

          <p>
            Hostel rooms
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon available-icon">
              ✓
            </div>

            <span className="stat-label">
              AVAILABLE ROOMS
            </span>

          </div>

          <h2>18</h2>

          <p>
            Ready for allocation
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon fee-icon">
              ₹
            </div>

            <span className="stat-label">
              PENDING FEES
            </span>

          </div>

          <h2>
            ₹12,500
          </h2>

          <p>
            To be collected
          </p>

        </div>

      </div>


      {/* QUICK ACTIONS + OVERVIEW */}
      <div className="content-grid">

        {/* QUICK ACTIONS */}
        <div className="panel">

          <div className="panel-heading">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Frequently used actions
              </p>

            </div>

          </div>


          <button
            className="action"
            onClick={() => setActivePage("Students")}
          >

            <div className="action-icon purple">
              +
            </div>

            <div>

              <strong>
                Add Student
              </strong>

              <span>
                Register a new student
              </span>

            </div>

            <b>›</b>

          </button>


          <button
            className="action"
            onClick={() => setActivePage("Rooms")}
          >

            <div className="action-icon blue">
              ▦
            </div>

            <div>

              <strong>
                Manage Rooms
              </strong>

              <span>
                View room availability
              </span>

            </div>

            <b>›</b>

          </button>


          <button
            className="action"
            onClick={() => setActivePage("Fees")}
          >

            <div className="action-icon green">
              ₹
            </div>

            <div>

              <strong>
                Collect Fee
              </strong>

              <span>
                Record student payment
              </span>

            </div>

            <b>›</b>

          </button>

        </div>


        {/* HOSTEL OVERVIEW */}
        <div className="panel">

          <div className="panel-heading">

            <div>

              <h2>
                Hostel Overview
              </h2>

              <p>
                Current occupancy
              </p>

            </div>

          </div>


          <div className="occupancy-box">

            <div className="progress-circle">

              <div>

                <strong>
                  28%
                </strong>

                <span>
                  Occupied
                </span>

              </div>

            </div>


            <div className="occupancy-info">

              <div className="occupancy-row">

                <span>
                  <i className="dot occupied"></i>
                  Occupied
                </span>

                <strong>
                  7
                </strong>

              </div>


              <div className="occupancy-row">

                <span>
                  <i className="dot available"></i>
                  Available
                </span>

                <strong>
                  18
                </strong>

              </div>


              <div className="occupancy-row">

                <span>
                  <i className="dot maintenance"></i>
                  Maintenance
                </span>

                <strong>
                  0
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* RECENT STUDENTS */}
      <div className="panel recent-panel">

        <div className="panel-heading">

          <div>

            <h2>
              Recent Students
            </h2>

            <p>
              Recently registered hostel students
            </p>

          </div>

          <button
            className="view-all"
            onClick={() => setActivePage("Students")}
          >
            View All →
          </button>

        </div>


        <div className="recent-student">

          <div className="student-avatar">
            A
          </div>

          <div className="student-info">

            <strong>
              Anu
            </strong>

            <span>
              Room A102
            </span>

          </div>

          <span className="department">
            CSE
          </span>

        </div>


        <div className="recent-student">

          <div className="student-avatar">
            K
          </div>

          <div className="student-info">

            <strong>
              Kaviya
            </strong>

            <span>
              Room A102
            </span>

          </div>

          <span className="department">
            CSE
          </span>

        </div>


        <div className="recent-student">

          <div className="student-avatar">
            R
          </div>

          <div className="student-info">

            <strong>
              Rabiya
            </strong>

            <span>
              Room A103
            </span>

          </div>

          <span className="department">
            IT
          </span>

        </div>

      </div>

    </div>
  );
}

export default App;