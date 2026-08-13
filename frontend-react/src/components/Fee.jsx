import { useEffect, useState } from "react";

function Fee() {
  const [fees, setFees] = useState([]);

  const [form, setForm] = useState({
    studentName: "",
    registerNumber: "",
    amount: "",
    paymentDate: "",
    paymentStatus: "",
  });

  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:8080/fees";

  // ================= LOAD FEES =================

  useEffect(() => {
    let cancelled = false;

    const loadFees = async () => {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("Failed to fetch fees");
        }

        const data = await response.json();

        if (!cancelled) {
          setFees(data);
        }
      } catch (error) {
        console.error("Error loading fees:", error);
      }
    };

    loadFees();

    return () => {
      cancelled = true;
    };
  }, []);

  // ================= INPUT =================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `${API}/${editingId}`
        : API;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: form.studentName,
          registerNumber: form.registerNumber,
          amount: Number(form.amount),
          paymentDate: form.paymentDate,
          paymentStatus: form.paymentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save fee");
      }

      alert(
        editingId
          ? "Fee updated successfully!"
          : "Fee added successfully!"
      );

      resetForm();

      // Refresh list after add/update
      const updatedResponse = await fetch(API);
      const updatedData = await updatedResponse.json();
      setFees(updatedData);

    } catch (error) {
      console.error("Error:", error);
      alert("Unable to save fee!");
    }
  };

  // ================= EDIT =================

  const handleEdit = (fee) => {
    setEditingId(fee.id);

    setForm({
      studentName: fee.studentName || "",
      registerNumber: fee.registerNumber || "",
      amount: fee.amount ?? "",
      paymentDate: fee.paymentDate || "",
      paymentStatus: fee.paymentStatus || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fee?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Fee deleted successfully!");

      const updatedResponse = await fetch(API);
      const updatedData = await updatedResponse.json();
      setFees(updatedData);

    } catch (error) {
      console.error("Error:", error);
      alert("Unable to delete fee!");
    }
  };

  // ================= RESET =================

  const resetForm = () => {
    setForm({
      studentName: "",
      registerNumber: "",
      amount: "",
      paymentDate: "",
      paymentStatus: "",
    });

    setEditingId(null);
  };

  // ================= CALCULATIONS =================

  const totalCollected = fees
    .filter((fee) => fee.paymentStatus === "Paid")
    .reduce(
      (total, fee) => total + Number(fee.amount || 0),
      0
    );

  const totalPending = fees
    .filter((fee) => fee.paymentStatus === "Pending")
    .reduce(
      (total, fee) => total + Number(fee.amount || 0),
      0
    );

  const paidCount = fees.filter(
    (fee) => fee.paymentStatus === "Paid"
  ).length;

  const pendingCount = fees.filter(
    (fee) => fee.paymentStatus === "Pending"
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
            Fee Management
          </h1>

          <p>
            Manage student hostel fee payments
          </p>

        </div>

        <div className="today">
          ₹ {fees.length} Records
        </div>

      </div>


      {/* ================= SUMMARY ================= */}

      <div className="stats-grid">

        {/* COLLECTED */}

        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon available-icon">
              ✓
            </div>

            <span className="stat-label">
              COLLECTED
            </span>

          </div>

          <h2>
            ₹{totalCollected.toLocaleString("en-IN")}
          </h2>

          <p>
            Total paid amount
          </p>

        </div>


        {/* PENDING */}

        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon fee-icon">
              ₹
            </div>

            <span className="stat-label">
              PENDING
            </span>

          </div>

          <h2>
            ₹{totalPending.toLocaleString("en-IN")}
          </h2>

          <p>
            Amount to be collected
          </p>

        </div>


        {/* PAID RECORDS */}

        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon students-icon">
              P
            </div>

            <span className="stat-label">
              PAID RECORDS
            </span>

          </div>

          <h2>
            {paidCount}
          </h2>

          <p>
            Successful payments
          </p>

        </div>


        {/* PENDING RECORDS */}

        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon rooms-icon">
              !
            </div>

            <span className="stat-label">
              PENDING RECORDS
            </span>

          </div>

          <h2>
            {pendingCount}
          </h2>

          <p>
            Pending payments
          </p>

        </div>

      </div>


      {/* ================= ADD FEE ================= */}

      <div className="panel">

        <div className="panel-heading">

          <div>

            <h2>
              {editingId
                ? "Edit Fee"
                : "Add New Fee"}
            </h2>

            <p>
              Enter student payment information
            </p>

          </div>

        </div>


        <form
          onSubmit={handleSubmit}
          className="student-form"
        >

          {/* STUDENT NAME */}

          <div className="student-input">

            <label>
              Student Name
            </label>

            <input
              type="text"
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              placeholder="Enter student name"
              required
            />

          </div>


          {/* REGISTER NUMBER */}

          <div className="student-input">

            <label>
              Register Number
            </label>

            <input
              type="text"
              name="registerNumber"
              value={form.registerNumber}
              onChange={handleChange}
              placeholder="Example: 24CSE101"
              required
            />

          </div>


          {/* AMOUNT */}

          <div className="student-input">

            <label>
              Amount
            </label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Example: 5000"
              min="0"
              required
            />

          </div>


          {/* PAYMENT DATE */}

          <div className="student-input">

            <label>
              Payment Date
            </label>

            <input
              type="date"
              name="paymentDate"
              value={form.paymentDate}
              onChange={handleChange}
              required
            />

          </div>


          {/* STATUS */}

          <div className="student-input">

            <label>
              Payment Status
            </label>

            <select
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Status
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Pending">
                Pending
              </option>

            </select>

          </div>


          {/* BUTTONS */}

          <div className="student-buttons">

            <button
              type="submit"
              className="student-add-button"
            >
              {editingId
                ? "Update Fee"
                : "Add Fee"}
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


      {/* ================= FEE LIST ================= */}

      <div className="panel">

        <div className="student-list-header">

          <div>

            <h2>
              Fee Records
            </h2>

            <p>
              View and manage student payments
            </p>

          </div>

          <span className="student-count">
            {fees.length} Records
          </span>

        </div>


        <div className="student-table-container">

          <table className="student-table">

            <thead>

              <tr>

                <th>ID</th>
                <th>Student</th>
                <th>Register No</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {fees.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No fee records found
                  </td>

                </tr>

              ) : (

                fees.map((fee) => (

                  <tr key={fee.id}>

                    <td>
                      <span className="student-id">
                        {fee.id}
                      </span>
                    </td>


                    <td>

                      <div className="student-person">

                        <div className="student-avatar">
                          {fee.studentName
                            ? fee.studentName
                                .charAt(0)
                                .toUpperCase()
                            : "S"}
                        </div>

                        <strong>
                          {fee.studentName || "-"}
                        </strong>

                      </div>

                    </td>


                    <td>
                      {fee.registerNumber || "-"}
                    </td>


                    <td>
                      <strong>
                        ₹
                        {Number(
                          fee.amount || 0
                        ).toLocaleString("en-IN")}
                      </strong>
                    </td>


                    <td>
                      {fee.paymentDate || "-"}
                    </td>


                    <td>

                      <span
                        className={
                          fee.paymentStatus === "Paid"
                            ? "fee-paid"
                            : "fee-pending"
                        }
                      >
                        {fee.paymentStatus || "-"}
                      </span>

                    </td>


                    <td>

                      <div className="student-actions">

                        <button
                          className="edit"
                          onClick={() =>
                            handleEdit(fee)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete"
                          onClick={() =>
                            handleDelete(fee.id)
                          }
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

export default Fee;