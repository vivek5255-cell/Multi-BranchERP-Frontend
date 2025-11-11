// src/pages/Vendors.jsx
import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import {
  getVendors,
  addVendor,
  updateVendor,
  deleteVendor,
} from "../services/vendorService";
import "../styles/forms.css";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // form state (UI names)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gst: "",
  });

  // ====== load vendors on mount ======
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getVendors();
        setVendors(data);
      } catch (err) {
        setError("Failed to load vendors.");
      }
    };
    load();
  }, []);

  // ====== open "add" modal ======
  const openAdd = () => {
    setForm({ name: "", phone: "", gst: "" });
    setIsEdit(false);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  // ====== open "edit" modal ======
  const openEdit = (vendor) => {
    setForm({
      name: vendor.vendorName || "",
      phone: vendor.phone || "",
      gst: vendor.gstin || "",
    });
    setIsEdit(true);
    setEditingId(vendor.id);
    setShowForm(true);
    setError("");
  };

  // ====== handle form change ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // ====== submit (add or edit) ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // map UI → backend
    const payload = {
      vendorName: form.name,
      phone: form.phone,
      gstin: form.gst,
    };

    try {
      if (isEdit && editingId) {
        const updated = await updateVendor(editingId, payload);
        // update in list
        setVendors((prev) =>
          prev.map((v) => (v.id === editingId ? updated : v))
        );
      } else {
        const saved = await addVendor(payload);
        setVendors((prev) => [...prev, saved]);
      }

      setShowForm(false);
      setIsEdit(false);
      setEditingId(null);
      setForm({ name: "", phone: "", gst: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to save vendor.");
    }
  };

  // ====== delete ======
  const handleDelete = async (id) => {
    const ok = window.confirm("Do you really want to delete this vendor?");
    if (!ok) return;

    try {
      await deleteVendor(id);
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete vendor.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Vendors</h2>
        <button className="primary-btn" onClick={openAdd}>
          + Add Vendor
        </button>
      </div>

      {error && <div className="error-text">{error}</div>}

      <Table
        columns={["ID", "Vendor Name", "Phone", "GSTIN", "Actions"]}
        data={vendors.map((v) => [
          v.id,
          v.vendorName,
          v.phone,
          v.gstin,
          // 👇 React elements are fine in our Table
          <div key={v.id} className="table-actions">
            <button
              className="btn-sm light"
              onClick={() => openEdit(v)}
            >
              Edit
            </button>
            <button
              className="btn-sm danger"
              onClick={() => handleDelete(v.id)}
            >
              Delete
            </button>
          </div>,
        ])}
      />

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>{isEdit ? "Edit Vendor" : "Add Vendor"}</h3>
            {error && <div className="error-text">{error}</div>}
            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                Vendor Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Phone
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>
              <label>
                GST No
                <input
                  name="gst"
                  value={form.gst}
                  onChange={handleChange}
                />
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

export default Vendors;
