import { useEffect, useMemo, useState } from "react";
import {
  Container, Row, Col, Card, Button, Table, Form, Badge, InputGroup, Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import { getAllInvoices, createInvoice, updateInvoiceStatus, deleteInvoice } from "../services/invoiceService";
import { getAllPurchaseOrders } from "../services/purchaseService"; // you already have this

const STATUS_COLORS = {
  DRAFT: "secondary",
  ISSUED: "warning",
  PAID: "success",
  CANCELLED: "danger",
};

export default function Invoice() {
  // form state
  const [poId, setPoId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [status, setStatus] = useState("DRAFT");
  const [subtotal, setSubtotal] = useState("");
  const [tax, setTax] = useState("");
  const [discount, setDiscount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [notes, setNotes] = useState("");

  // data
  const [invoices, setInvoices] = useState([]);
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [invList, poList] = await Promise.all([getAllInvoices(), getAllPurchaseOrders()]);
      setInvoices(invList || []);
      setPos(poList || []);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to fetch", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // compute totals automatically when user types
  useEffect(() => {
    const s = parseFloat(subtotal) || 0;
    const t = parseFloat(tax) || 0;
    const d = parseFloat(discount) || 0;
    const tot = Math.max(0, s + t - d);
    setTotalAmount(Number.isFinite(tot) ? String(tot) : "");
  }, [subtotal, tax, discount]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter(inv => {
      const invNo = inv?.invoiceNumber || "";
      const poNum = inv?.po?.poNumber || "";
      const vendor = inv?.po?.vendor?.vendorName || "";
      const branch = inv?.po?.branch?.branchName || "";
      return [invNo, poNum, vendor, branch].some(s => s?.toLowerCase().includes(q));
    });
  }, [invoices, search]);

  const resetForm = () => {
    setPoId("");
    setInvoiceDate(dayjs().format("YYYY-MM-DD"));
    setStatus("DRAFT");
    setSubtotal("");
    setTax("");
    setDiscount("");
    setTotalAmount("");
    setNotes("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!poId) return Swal.fire("Validation", "Please select a Purchase Order.", "info");
    if (!totalAmount) return Swal.fire("Validation", "Total amount is required.", "info");

    setCreating(true);
    try {
      const payload = {
        poId: Number(poId),
        invoiceDate,
        status,
        subtotal: subtotal ? Number(subtotal) : 0,
        tax: tax ? Number(tax) : 0,
        discount: discount ? Number(discount) : 0,
        totalAmount: Number(totalAmount),
        notes,
      };
      const created = await createInvoice(payload);
      Swal.fire("Invoice Created", created?.invoiceNumber || "Success", "success");
      resetForm();
      setInvoices(await getAllInvoices());
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to create invoice", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleStatus = async (id, next) => {
    setUpdatingId(id);
    try {
      await updateInvoiceStatus(id, next);
      setInvoices(await getAllInvoices());
      Swal.fire("Updated", "Invoice status updated.", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to update", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete invoice?",
      text: "This cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;

    setDeletingId(id);
    try {
      await deleteInvoice(id);
      setInvoices(await getAllInvoices());
      Swal.fire("Deleted", "Invoice removed.", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to delete", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const badge = (s) => <Badge bg={STATUS_COLORS[s] || "secondary"}>{s}</Badge>;

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        {/* Create Invoice */}
        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Create Invoice</Card.Title>

              <Form onSubmit={handleCreate}>
                <Form.Group className="mb-3">
                  <Form.Label>Purchase Order</Form.Label>
                  <Form.Select value={poId} onChange={(e) => setPoId(e.target.value)}>
                    <option value="">-- Select PO --</option>
                    {pos?.map(po => (
                      <option key={po.id} value={po.id}>
                        {po.poNumber} • {po?.vendor?.vendorName || "Vendor"} • {po?.branch?.branchName || "Branch"}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Invoice Date</Form.Label>
                      <Form.Control type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ISSUED">ISSUED</option>
                        <option value="PAID">PAID</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subtotal</Form.Label>
                      <Form.Control inputMode="decimal" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} placeholder="0" />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tax</Form.Label>
                      <Form.Control inputMode="decimal" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="0" />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Discount</Form.Label>
                      <Form.Control inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Total</Form.Label>
                  <Form.Control inputMode="decimal" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="0" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control as="textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" disabled={creating}>
                    {creating ? (<><Spinner size="sm" className="me-2" /> Creating...</>) : "Create Invoice"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Invoice List */}
        <Col lg={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <Card.Title className="mb-2 mb-md-0">Invoices</Card.Title>
                <InputGroup style={{ maxWidth: 340 }}>
                  <Form.Control placeholder="Search Invoice / PO / Vendor / Branch" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <Button variant="outline-secondary" onClick={() => setSearch("")}>Clear</Button>
                </InputGroup>
              </div>

              {loading ? (
                <div className="text-center py-4"><Spinner /> <span className="ms-2">Loading...</span></div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Invoice</th>
                        <th>PO</th>
                        <th>Vendor</th>
                        <th>Branch</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th style={{ width: 260 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered?.length ? filtered.map((inv, i) => (
                        <tr key={inv.id}>
                          <td>{i + 1}</td>
                          <td className="fw-semibold">{inv.invoiceNumber}</td>
                          <td>{inv?.po?.poNumber}</td>
                          <td>{inv?.po?.vendor?.vendorName}</td>
                          <td>{inv?.po?.branch?.branchName}</td>
                          <td>{inv?.invoiceDate ? dayjs(inv.invoiceDate).format("DD MMM YYYY") : "-"}</td>
                          <td>₹{Number(inv?.totalAmount || 0).toFixed(2)}</td>
                          <td>{badge(inv?.status || "DRAFT")}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-2">
                              <Button size="sm" variant="outline-warning" disabled={updatingId === inv.id} onClick={() => handleStatus(inv.id, "ISSUED")}>
                                {updatingId === inv.id ? "..." : "Mark Issued"}
                              </Button>
                              <Button size="sm" variant="outline-success" disabled={updatingId === inv.id} onClick={() => handleStatus(inv.id, "PAID")}>
                                {updatingId === inv.id ? "..." : "Mark Paid"}
                              </Button>
                              <Button size="sm" variant="outline-danger" disabled={updatingId === inv.id} onClick={() => handleStatus(inv.id, "CANCELLED")}>
                                {updatingId === inv.id ? "..." : "Cancel"}
                              </Button>
                              <Button size="sm" variant="outline-secondary" disabled={deletingId === inv.id} onClick={() => handleDelete(inv.id)}>
                                {deletingId === inv.id ? "..." : "Delete"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={9} className="text-center text-muted py-4">No invoices found.</td></tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
