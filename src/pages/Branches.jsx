// src/pages/Branches.jsx
import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import {
  getBranches,
  addBranch,
  updateBranch,
  deleteBranch,
} from "../services/branchService";
import "../styles/forms.css";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    branchName: "",
    branchCode: "",
    city: "",
    state: "",
    active: true,
  });

  // load all
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBranches();
        setBranches(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load branches.");
      }
    };
    load();
  }, []);

  const openAdd = () => {
    setForm({
      branchName: "",
      branchCode: "",
      city: "",
      state: "",
      active: true,
    });
    setIsEdit(false);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEdit = (b) => {
    setForm({
      branchName: b.branchName || "",
      branchCode: b.branchCode || "",
      city: b.city || "",
      state: b.state || "",
      active: b.active !== undefined ? b.active : true,
    });
    setIsEdit(true);
    setEditingId(b.id);
    setShowForm(true);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isEdit && editingId) {
        const updated = await updateBranch(editingId, form);
        setBranches((prev) =>
          prev.map((b) => (b.id === editingId ? updated : b))
        );
      } else {
        const saved = await addBranch(form);
        setBranches((prev) => [...prev, saved]);
      }

      setShowForm(false);
      setIsEdit(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to save branch. Maybe branch code is duplicate?"
      );
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this branch?");
    if (!ok) return;
    try {
      await deleteBranch(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete branch.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Branches</h2>
        <button className="primary-btn" onClick={openAdd}>
          + Add Branch
        </button>
      </div>

      {error && <div className="error-text">{error}</div>}

      <Table
        columns={["ID", "Code", "Branch Name", "City", "State", "Active", "Actions"]}
        data={branches.map((b) => [
          b.id,
          b.branchCode,
          b.branchName,
          b.city,
          b.state,
          b.active ? "Yes" : "No",
          <div key={b.id} className="table-actions">
            <button className="btn-sm light" onClick={() => openEdit(b)}>
              Edit
            </button>
            <button className="btn-sm danger" onClick={() => handleDelete(b.id)}>
              Delete
            </button>
          </div>,
        ])}
      />

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>{isEdit ? "Edit Branch" : "Add Branch"}</h3>
            {error && <div className="error-text">{error}</div>}
            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                Branch Name
                <input
                  name="branchName"
                  value={form.branchName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Branch Code
                <input
                  name="branchCode"
                  value={form.branchCode}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                City
                <input name="city" value={form.city} onChange={handleChange} />
              </label>
              <label>
                State
                <input name="state" value={form.state} onChange={handleChange} />
              </label>
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />
                Active
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;
