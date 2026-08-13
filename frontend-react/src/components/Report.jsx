import { useEffect, useState } from "react";

function Report() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadReportData = async () => {
      try {
        const [studentResponse, roomResponse, feeResponse] =
          await Promise.all([
            fetch("http://localhost:8080/students"),
            fetch("http://localhost:8080/rooms"),
            fetch("http://localhost:8080/fees"),
          ]);

        if (
          !studentResponse.ok ||
          !roomResponse.ok ||
          !feeResponse.ok
        ) {
          throw new Error("Failed to fetch report data");
        }

        const studentData = await studentResponse.json();
        const roomData = await roomResponse.json();
        const feeData = await feeResponse.json();

        if (!cancelled) {
          setStudents(studentData);
          setRooms(roomData);
          setFees(feeData);
        }
      } catch (error) {
        console.error("Error loading report:", error);
      }
    };

    loadReportData();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalCapacity = rooms.reduce(
    (sum, room) => sum + Number(room.capacity || 0),
    0
  );

  const totalOccupied = rooms.reduce(
    (sum, room) => sum + Number(room.occupied || 0),
    0
  );

  const totalAvailable = Math.max(
    totalCapacity - totalOccupied,
    0
  );

  const totalCollected = fees
    .filter((fee) => fee.paymentStatus === "Paid")
    .reduce(
      (sum, fee) => sum + Number(fee.amount || 0),
      0
    );

  const totalPending = fees
    .filter((fee) => fee.paymentStatus === "Pending")
    .reduce(
      (sum, fee) => sum + Number(fee.amount || 0),
      0
    );

  const paidRecords = fees.filter(
    (fee) => fee.paymentStatus === "Paid"
  ).length;

  const pendingRecords = fees.filter(
    (fee) => fee.paymentStatus === "Pending"
  ).length;

  const occupancyPercentage =
    totalCapacity > 0
      ? Math.round(
          (totalOccupied / totalCapacity) * 100
        )
      : 0;

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">

        <div>
          <div className="eyebrow">
            HOSTEL MANAGEMENT
          </div>

          <h1>Reports</h1>

          <p>
            Hostel statistics and management reports
          </p>
        </div>

        <div className="today">
          📊 Overview
        </div>

      </div>


      {/* SUMMARY CARDS */}
      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon students-icon">
              S
            </div>

            <span className="stat-label">
              STUDENTS
            </span>
          </div>

          <h2>{students.length}</h2>

          <p>
            Registered students
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon rooms-icon">
              R
            </div>

            <span className="stat-label">
              ROOMS
            </span>
          </div>

          <h2>{rooms.length}</h2>

          <p>
            Total hostel rooms
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon available-icon">
              A
            </div>

            <span className="stat-label">
              AVAILABLE
            </span>
          </div>

          <h2>{totalAvailable}</h2>

          <p>
            Available beds
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon fee-icon">
              ₹
            </div>

            <span className="stat-label">
              COLLECTED
            </span>
          </div>

          <h2>
            ₹{totalCollected.toLocaleString("en-IN")}
          </h2>

          <p>
            Paid fees
          </p>

        </div>

      </div>


      {/* OVERVIEW */}
      <div className="content-grid">

        <div className="panel">

          <div className="panel-heading">

            <div>
              <h2>
                Hostel Overview
              </h2>

              <p>
                Current occupancy details
              </p>
            </div>

          </div>


          <div className="occupancy-box">

            <div
              className="progress-circle"
              style={{
                background: `conic-gradient(
                  #5b50e6 ${occupancyPercentage}%,
                  #eeeafd ${occupancyPercentage}% 100%
                )`,
              }}
            >

              <div>
                <strong>
                  {occupancyPercentage}%
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
                  Total Capacity
                </span>

                <strong>
                  {totalCapacity}
                </strong>

              </div>


              <div className="occupancy-row">

                <span>
                  <i className="dot occupied"></i>
                  Occupied
                </span>

                <strong>
                  {totalOccupied}
                </strong>

              </div>


              <div className="occupancy-row">

                <span>
                  <i className="dot available"></i>
                  Available
                </span>

                <strong>
                  {totalAvailable}
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* FEE OVERVIEW */}
        <div className="panel">

          <div className="panel-heading">

            <div>
              <h2>
                Fee Overview
              </h2>

              <p>
                Current payment summary
              </p>
            </div>

          </div>


          <div className="occupancy-info">

            <div className="occupancy-row">

              <span>
                <i className="dot available"></i>
                Paid Records
              </span>

              <strong>
                {paidRecords}
              </strong>

            </div>


            <div className="occupancy-row">

              <span>
                <i className="dot occupied"></i>
                Pending Records
              </span>

              <strong>
                {pendingRecords}
              </strong>

            </div>


            <div className="occupancy-row">

              <span>
                <i className="dot available"></i>
                Total Collected
              </span>

              <strong>
                ₹{totalCollected.toLocaleString("en-IN")}
              </strong>

            </div>


            <div className="occupancy-row">

              <span>
                <i className="dot maintenance"></i>
                Total Pending
              </span>

              <strong>
                ₹{totalPending.toLocaleString("en-IN")}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* STUDENT REPORT */}
      <div className="panel recent-panel">

        <div className="panel-heading">

          <div>
            <h2>
              Student Report
            </h2>

            <p>
              Registered hostel students
            </p>
          </div>

          <span className="student-count">
            {students.length} Students
          </span>

        </div>


        <div className="student-table-container">

          <table className="student-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Register No</th>
                <th>Department</th>
                <th>Room</th>
              </tr>

            </thead>


            <tbody>

              {students.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No student data found
                  </td>

                </tr>

              ) : (

                students.map((student) => (

                  <tr key={student.id}>

                    <td>
                      {student.id}
                    </td>

                    <td>
                      <strong>
                        {student.name || "-"}
                      </strong>
                    </td>

                    <td>
                      {student.registerNumber || "-"}
                    </td>

                    <td>
                      {student.department || "-"}
                    </td>

                    <td>
                      {student.roomNumber || "-"}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Report;