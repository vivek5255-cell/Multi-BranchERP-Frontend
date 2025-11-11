

// src/pages/PurchaseOrder.jsx
import React, { useEffect, useState } from "react";
import "../styles/forms.css";
import Table from "../components/Table";

import { getVendors } from "../services/vendorService";
import { getBranches } from "../services/branchService";
import {
  getAllPurchaseOrders,
  addPurchaseOrder,
  updatePurchaseOrderStatus,
} from "../services/purchaseService";

const PurchaseOrder = () => {
  const [pos, setPos] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    vendorId: "",
    branchId: "",
    orderDate: "",
    status: "Pending",
    totalAmount: "",
  });

  // load vendors + branches + POs on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [vData, bData, poData] = await Promise.all([
          getVendors(),
          getBranches(),
          getAllPurchaseOrders(),
        ]);
        setVendors(vData);
        setBranches(bData);
        setPos(poData);
      } catch (err) {
        console.error(err);
        setError("Failed to load purchase orders.");
      }
    };
    load();
  }, []);

  const openForm = () => {
    setForm({
      vendorId: "",
      branchId: "",
      orderDate: new Date().toISOString().slice(0, 10),
      status: "Pending",
      totalAmount: "",
    });
    setError("");
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.vendorId || !form.branchId) {
      setError("Please select vendor and branch.");
      return;
    }

    // match backend structure (nested vendor, branch)
    const payload = {
      vendor: { id: Number(form.vendorId) },
      branch: { id: Number(form.branchId) },
      orderDate: form.orderDate,
      status: form.status,
      totalAmount: form.totalAmount ? Number(form.totalAmount) : 0,
    };

    try {
      const saved = await addPurchaseOrder(payload);
      setPos((prev) => [...prev, saved]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save purchase order.");
    }
  };

  const handleStatusChange = async (poId, newStatus) => {
    try {
      const updated = await updatePurchaseOrderStatus(poId, newStatus);
      setPos((prev) => prev.map((p) => (p.id === poId ? updated : p)));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Purchase Orders</h2>
        <button className="primary-btn" onClick={openForm}>
          + New PO
        </button>
      </div>

      {error && <div className="error-text">{error}</div>}

      <Table
        columns={[
          "ID",
          "PO Number",
          "Vendor",
          "Branch",
          "Order Date",
          "Status",
          "Amount",
          "Actions",
        ]}
        data={pos.map((po) => [
          po.id,
          po.poNumber || "—",
          po.vendor ? po.vendor.name || po.vendor.vendorName || `#${po.vendor.id}` : "—",
          po.branch ? po.branch.branchName || `#${po.branch.id}` : "—",
          po.orderDate || "—",
          po.status || "Pending",
          po.totalAmount != null ? po.totalAmount : "0",
          <div key={po.id} className="table-actions">
            <button
              className="btn-sm light"
              onClick={() => handleStatusChange(po.id, "Approved")}
            >
              Approve
            </button>
            <button
              className="btn-sm danger"
              onClick={() => handleStatusChange(po.id, "Cancelled")}
            >
              Cancel
            </button>
          </div>,
        ])}
      />

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Create Purchase Order</h3>
            {error && <div className="error-text">{error}</div>}
            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                Vendor
                <select
                  name="vendorId"
                  value={form.vendorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- select vendor --</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name || v.vendorName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Branch
                <select
                  name="branchId"
                  value={form.branchId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- select branch --</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branchName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Order Date
                <input
                  type="date"
                  name="orderDate"
                  value={form.orderDate}
                  onChange={handleChange}
                />
              </label>

              <label>
                Total Amount
                <input
                  type="number"
                  name="totalAmount"
                  value={form.totalAmount}
                  onChange={handleChange}
                  placeholder="e.g. 12000"
                />
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Received">Received</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;
