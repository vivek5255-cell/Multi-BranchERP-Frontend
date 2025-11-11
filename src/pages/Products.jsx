// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import "../styles/forms.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    productName: "",
    sku: "",
    unit: "",
    purchasePrice: "",
  });

  // load from backend
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
          console.error(err);
          setError("Failed to load products.");
      }
    };
    load();
  }, []);

  const openAdd = () => {
    setForm({
      productName: "",
      sku: "",
      unit: "",
      purchasePrice: "",
    });
    setIsEdit(false);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEdit = (p) => {
    setForm({
      productName: p.productName || "",
      sku: p.sku || "",
      unit: p.unit || "",
      purchasePrice: p.purchasePrice || "",
    });
    setIsEdit(true);
    setEditingId(p.id);
    setShowForm(true);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // backend already uses same field names → no mapping needed
    const payload = {
      productName: form.productName,
      sku: form.sku,
      unit: form.unit,
      purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : 0,
    };

    try {
      if (isEdit && editingId) {
        const updated = await updateProduct(editingId, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? updated : p))
        );
      } else {
        const saved = await addProduct(payload);
        setProducts((prev) => [...prev, saved]);
      }

      setShowForm(false);
      setIsEdit(false);
      setEditingId(null);
      setForm({
        productName: "",
        sku: "",
        unit: "",
        purchasePrice: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to save product.");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Do you really want to delete this product?");
    if (!ok) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Products</h2>
        <button className="primary-btn" onClick={openAdd}>
          + Add Product
        </button>
      </div>

      {error && <div className="error-text">{error}</div>}

      <Table
        columns={["ID", "Product Name", "SKU", "Unit", "Purchase Price", "Actions"]}
        data={products.map((p) => [
          p.id,
          p.productName,
          p.sku,
          p.unit,
          p.purchasePrice,
          <div key={p.id} className="table-actions">
            <button className="btn-sm light" onClick={() => openEdit(p)}>
              Edit
            </button>
            <button className="btn-sm danger" onClick={() => handleDelete(p.id)}>
              Delete
            </button>
          </div>,
        ])}
      />

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>{isEdit ? "Edit Product" : "Add Product"}</h3>
            {error && <div className="error-text">{error}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                Product Name
                <input
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                SKU
                <input name="sku" value={form.sku} onChange={handleChange} />
              </label>
              <label>
                Unit
                <input name="unit" value={form.unit} onChange={handleChange} />
              </label>
              <label>
                Purchase Price
                <input
                  name="purchasePrice"
                  type="number"
                  step="0.01"
                  value={form.purchasePrice}
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

export default Products;
