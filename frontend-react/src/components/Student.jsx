import { useEffect, useState } from "react";

function Student() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    registerNumber: "",
    department: "",
    year: "",
    gender: "",
    phone: "",
    email: "",
    roomNumber: "",
    address: "",
  });

  const API = "http://localhost:8080/students";

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();

        if (!cancelled) {
          setStudents(data);
        }
      } catch (error) {
        console.error("Error loading students:", error);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      registerNumber: "",
      department: "",
      year: "",
      gender: "",
      phone: "",
      email: "",
      roomNumber: "",
      address: "",
    });

    setEditingId(null);
  };

  const refreshStudents = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to refresh students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error refreshing students:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId ? `${API}/${editingId}` : API;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to save student");
      }

      alert(
        editingId
          ? "Student updated successfully!"
          : "Student added successfully!"
      );

      resetForm();
      await refreshStudents();
    } catch (error) {
      console.error(error);
      alert("Unable to save student!");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);

    setForm({
      name: student.name || "",
      registerNumber: student.registerNumber || "",
      department: student.department || "",
      year: student.year || "",
      gender: student.gender || "",
      phone: student.phone || "",
      email: student.email || "",
      roomNumber: student.roomNumber || "",
      address: student.address || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      alert("Student deleted successfully!");
      await refreshStudents();
    } catch (error) {
      console.error(error);
      alert("Unable to delete student!");
    }
  };

  return (
    <div className="student-page">

      <div className="student-header">
        <div>
          <div className="eyebrow">STUDENT MANAGEMENT</div>

          <h1>Student Management</h1>

          <p>Manage hostel student details</p>
        </div>

        <div className="student-total">
          <span>TOTAL STUDENTS</span>
          <strong>{students.length}</strong>
        </div>
      </div>

      <div className="student-card">

        <div className="student-title">
          <div className="student-icon">+</div>

          <div>
            <h2>
              {editingId ? "Edit Student" : "Add New Student"}
            </h2>

            <p>
              Enter the student information below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="student-form">

            <div className="student-input">
              <label>Student Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />
            </div>

            <div className="student-input">
              <label>Register Number</label>

              <input
                type="text"
                name="registerNumber"
                value={form.registerNumber}
                onChange={handleChange}
                placeholder="Enter register number"
                required
              />
            </div>

            <div className="student-input">
              <label>Department</label>

              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Example: CSE"
                required
              />
            </div>

            <div className="student-input">
              <label>Year</label>

              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="student-input">
              <label>Gender</label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="student-input">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="student-input">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            <div className="student-input">
              <label>Room Number</label>

              <input
                type="text"
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="Example: A101"
              />
            </div>

            <div className="student-input student-address">
              <label>Address</label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter student address"
              />
            </div>

          </div>

          <div className="student-buttons">

            <button
              type="submit"
              className="student-add-button"
            >
              {editingId ? "Update Student" : "Add Student"}
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

      <div className="student-card">

        <div className="student-list-header">

          <div>
            <h2>Student List</h2>

            <p>
              View and manage registered students
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
                <th>Year</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>

                    <td>
                      <span className="student-id">
                        {student.id}
                      </span>
                    </td>

                    <td>
                      <div className="student-person">

                        <div className="student-avatar">
                          {student.name
                            ? student.name.charAt(0).toUpperCase()
                            : "S"}
                        </div>

                        <strong>
                          {student.name || "-"}
                        </strong>

                      </div>
                    </td>

                    <td>
                      {student.registerNumber || "-"}
                    </td>

                    <td>
                      {student.department || "-"}
                    </td>

                    <td>
                      {student.year || "-"}
                    </td>

                    <td>
                      <span className="gender">
                        {student.gender || "-"}
                      </span>
                    </td>

                    <td>
                      {student.phone || "-"}
                    </td>

                    <td>
                      {student.email || "-"}
                    </td>

                    <td>
                      <span className="room">
                        {student.roomNumber || "-"}
                      </span>
                    </td>

                    <td>
                      <div className="student-actions">

                        <button
                          className="edit"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </button>

                      </div>
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

export default Student;