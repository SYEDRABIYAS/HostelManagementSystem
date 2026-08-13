import { useEffect, useState } from "react";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    roomNumber: "",
    capacity: "",
    occupied: "",
    status: "",
  });

  const API = "http://localhost:8080/rooms";

  // ================= LOAD ROOMS =================

  useEffect(() => {
    let cancelled = false;

    const loadRooms = async () => {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();

        if (!cancelled) {
          setRooms(data);
        }
      } catch (error) {
        console.error("Error loading rooms:", error);
      }
    };

    loadRooms();

    return () => {
      cancelled = true;
    };
  }, []);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= RESET =================

  const resetForm = () => {
    setForm({
      roomNumber: "",
      capacity: "",
      occupied: "",
      status: "",
    });

    setEditingId(null);
  };

  // ================= REFRESH ROOMS =================

  const refreshRooms = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to refresh rooms");
      }

      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error refreshing rooms:", error);
    }
  };

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const capacity = Number(form.capacity);
    const occupied = Number(form.occupied);

    if (occupied > capacity) {
      alert("Occupied count cannot be greater than capacity.");
      return;
    }

    try {
      const url = editingId
        ? `${API}/${editingId}`
        : API;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomNumber: form.roomNumber,
          capacity: capacity,
          occupied: occupied,
          status: form.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save room");
      }

      alert(
        editingId
          ? "Room updated successfully!"
          : "Room added successfully!"
      );

      resetForm();
      await refreshRooms();
    } catch (error) {
      console.error(error);
      alert("Unable to save room!");
    }
  };

  // ================= EDIT =================

  const handleEdit = (room) => {
    setEditingId(room.id);

    setForm({
      roomNumber: room.roomNumber || "",
      capacity: room.capacity ?? "",
      occupied: room.occupied ?? "",
      status: room.status || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Room deleted successfully!");

      await refreshRooms();
    } catch (error) {
      console.error(error);
      alert("Unable to delete room!");
    }
  };

  // ================= CALCULATIONS =================

  const totalCapacity = rooms.reduce(
    (total, room) => total + Number(room.capacity || 0),
    0
  );

  const totalOccupied = rooms.reduce(
    (total, room) => total + Number(room.occupied || 0),
    0
  );

  const totalAvailable = Math.max(
    totalCapacity - totalOccupied,
    0
  );

  const availableRooms = rooms.filter(
    (room) => room.status === "Available"
  ).length;

  const fullRooms = rooms.filter(
    (room) => room.status === "Full"
  ).length;

  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">

        <div>

          <div className="eyebrow">
            HOSTEL MANAGEMENT
          </div>

          <h1>
            Room Management
          </h1>

          <p>
            Manage hostel rooms and room availability
          </p>

        </div>

        <div className="today">
          🏠 {rooms.length} Rooms
        </div>

      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon rooms-icon">
              R
            </div>

            <span className="stat-label">
              TOTAL ROOMS
            </span>

          </div>

          <h2>
            {rooms.length}
          </h2>

          <p>
            Total hostel rooms
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon students-icon">
              C
            </div>

            <span className="stat-label">
              CAPACITY
            </span>

          </div>

          <h2>
            {totalCapacity}
          </h2>

          <p>
            Total beds
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon fee-icon">
              O
            </div>

            <span className="stat-label">
              OCCUPIED
            </span>

          </div>

          <h2>
            {totalOccupied}
          </h2>

          <p>
            Occupied beds
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

          <h2>
            {totalAvailable}
          </h2>

          <p>
            Available beds
          </p>

        </div>

      </div>


      {/* ================= ADD ROOM ================= */}

      <div className="panel">

        <div className="panel-heading">

          <div>

            <h2>
              {editingId
                ? "Edit Room"
                : "Add New Room"}
            </h2>

            <p>
              Enter room information below
            </p>

          </div>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="student-form">

            <div className="student-input">

              <label>
                Room Number
              </label>

              <input
                type="text"
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="Example: A101"
                required
              />

            </div>


            <div className="student-input">

              <label>
                Capacity
              </label>

              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                placeholder="Example: 4"
                min="1"
                required
              />

            </div>


            <div className="student-input">

              <label>
                Occupied
              </label>

              <input
                type="number"
                name="occupied"
                value={form.occupied}
                onChange={handleChange}
                placeholder="Example: 2"
                min="0"
                required
              />

            </div>


            <div className="student-input">

              <label>
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Status
                </option>

                <option value="Available">
                  Available
                </option>

                <option value="Full">
                  Full
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

              </select>

            </div>

          </div>


          <div className="student-buttons">

            <button
              type="submit"
              className="student-add-button"
            >
              {editingId
                ? "Update Room"
                : "Add Room"}
            </button>


            {editingId && (

              <button
                type="button"
                className="student-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* ================= ROOM LIST ================= */}

      <div className="student-card">

        <div className="student-list-header">

          <div>

            <h2>
              Room List
            </h2>

            <p>
              View and manage hostel rooms
            </p>

          </div>

          <span className="student-count">
            {availableRooms} Available
          </span>

        </div>


        <div className="student-table-container">

          <table className="student-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Room Number</th>
                <th>Capacity</th>
                <th>Occupied</th>
                <th>Available</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {rooms.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No rooms found
                  </td>

                </tr>

              ) : (

                rooms.map((room) => {

                  const available = Math.max(
                    Number(room.capacity || 0) -
                      Number(room.occupied || 0),
                    0
                  );

                  return (

                    <tr key={room.id}>

                      <td>

                        <span className="student-id">
                          {room.id}
                        </span>

                      </td>


                      <td>

                        <div className="student-person">

                          <div className="student-avatar">
                            R
                          </div>

                          <strong>
                            {room.roomNumber}
                          </strong>

                        </div>

                      </td>


                      <td>
                        {room.capacity}
                      </td>


                      <td>
                        {room.occupied}
                      </td>


                      <td>

                        <span className="room">
                          {available}
                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            room.status === "Available"
                              ? "room-status-available"
                              : room.status === "Full"
                              ? "room-status-full"
                              : "room-status-maintenance"
                          }
                        >
                          {room.status || "-"}
                        </span>

                      </td>


                      <td>

                        <div className="student-actions">

                          <button
                            className="edit"
                            onClick={() => handleEdit(room)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete"
                            onClick={() =>
                              handleDelete(room.id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= ROOM STATUS ================= */}

      <div className="panel">

        <div className="panel-heading">

          <div>

            <h2>
              Room Summary
            </h2>

            <p>
              Current room status
            </p>

          </div>

        </div>


        <div className="content-grid">

          <div className="action">

            <div className="action-icon green">
              A
            </div>

            <div>

              <strong>
                Available Rooms
              </strong>

              <span>
                {availableRooms} rooms available
              </span>

            </div>

          </div>


          <div className="action">

            <div className="action-icon blue">
              F
            </div>

            <div>

              <strong>
                Full Rooms
              </strong>

              <span>
                {fullRooms} rooms fully occupied
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Room;