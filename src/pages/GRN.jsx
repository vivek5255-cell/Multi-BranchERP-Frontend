// src/pages/GRN.jsx
// import { getAllGRNs, createGRN, updateGRNStatus } from "../services/grnService";
import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Badge,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import { getAllGRNs, createGRN, updateGRNStatus } from "../services/grnService";
import { getAllPurchaseOrders } from "../services/purchaseService";

const STATUS_COLORS = {
  RECEIVED: "success",
  PARTIAL: "warning",
  CANCELLED: "danger",
  PENDING: "secondary",
};

export default function GRN() {
  // form state
  const [poId, setPoId] = useState("");
  const [receivedDate, setReceivedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [status, setStatus] = useState("RECEIVED");

  // data state
  const [grns, setGrns] = useState([]);
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");

  // load POs and GRNs
  const loadAll = async () => {
    setLoading(true);
    try {
      const [grnList, poList] = await Promise.all([
        getAllGRNs(),
        getAllPurchaseOrders(),
      ]);
      setGrns(grnList || []);
      setPos(poList || []);
    } catch (err) {
      Swal.fire("Error", err.normalizedMessage || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredGRNs = useMemo(() => {
    if (!search?.trim()) return grns;
    const q = search.toLowerCase();
    return grns.filter((g) => {
      const vendorName = g?.po?.vendor?.vendorName || "";
      const branchName = g?.po?.branch?.branchName || "";
      const poNumber = g?.po?.poNumber || "";
      return (
        (g?.grnNumber || "").toLowerCase().includes(q) ||
        poNumber.toLowerCase().includes(q) ||
        vendorName.toLowerCase().includes(q) ||
        branchName.toLowerCase().includes(q)
      );
    });
  }, [grns, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!poId) {
      Swal.fire("Validation", "Please select a Purchase Order.", "info");
      return;
    }
    setCreating(true);
    try {
      const payload = {
        poId: Number(poId),
        receivedDate: receivedDate || dayjs().format("YYYY-MM-DD"),
        status: status || "RECEIVED",
      };
      const created = await createGRN(payload);
      Swal.fire(
        "GRN Created",
        `GRN ${created?.grnNumber || ""} created successfully.`,
        "success"
      );
      // reset minimal fields
      setPoId("");
      setStatus("RECEIVED");
      setReceivedDate(dayjs().format("YYYY-MM-DD"));
      // refresh list
      const latest = await getAllGRNs();
      setGrns(latest || []);
    } catch (err) {
      Swal.fire("Error", err.normalizedMessage || err.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusUpdate = async (grnId, newStatus) => {
    setUpdatingId(grnId);
    try {
      await updateGRNStatus(grnId, newStatus);
      const latest = await getAllGRNs();
      setGrns(latest || []);
      Swal.fire("Updated", "GRN status updated.", "success");
    } catch (err) {
      Swal.fire("Error", err.normalizedMessage || err.message, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const badgeFor = (s) => (
    <Badge bg={STATUS_COLORS[s] || "secondary"}>{s}</Badge>
  );

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        {/* Create GRN */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Create GRN</Card.Title>
              <Form onSubmit={handleCreate}>
                <Form.Group className="mb-3">
                  <Form.Label>Purchase Order</Form.Label>
                  <Form.Select
                    value={poId}
                    onChange={(e) => setPoId(e.target.value)}
                  >
                    <option value="">-- Select PO --</option>
                    {pos?.map((po) => (
                      <option key={po.id} value={po.id}>
                        {po.poNumber} • {po?.vendor?.vendorName || "Vendor"} •{" "}
                        {po?.branch?.branchName || "Branch"}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Received Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={receivedDate}
                        onChange={(e) => setReceivedDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="RECEIVED">RECEIVED</option>
                        <option value="PARTIAL">PARTIAL</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid">
                  <Button type="submit" disabled={creating}>
                    {creating ? (
                      <>
                        <Spinner size="sm" className="me-2" /> Creating...
                      </>
                    ) : (
                      "Create GRN"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* GRN List */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <Card.Title className="mb-2 mb-md-0">GRNs</Card.Title>
                <InputGroup style={{ maxWidth: 320 }}>
                  <Form.Control
                    placeholder="Search GRN / PO / Vendor / Branch"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearch("")}
                  >
                    Clear
                  </Button>
                </InputGroup>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner /> <span className="ms-2">Loading...</span>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>GRN</th>
                        <th>PO</th>
                        <th>Vendor</th>
                        <th>Branch</th>
                        <th>Received</th>
                        <th>Status</th>
                        <th style={{ width: 220 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGRNs?.length ? (
                        filteredGRNs.map((g, idx) => (
                          <tr key={g.id}>
                            <td>{idx + 1}</td>
                            <td className="fw-semibold">{g.grnNumber}</td>
                            <td>{g?.po?.poNumber}</td>
                            <td>{g?.po?.vendor?.vendorName}</td>
                            <td>{g?.po?.branch?.branchName}</td>
                            <td>
                              {g?.receivedDate
                                ? dayjs(g.receivedDate).format("DD MMM YYYY")
                                : "-"}
                            </td>
                            <td>{badgeFor(g?.status || "PENDING")}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  disabled={updatingId === g.id}
                                  onClick={() =>
                                    handleStatusUpdate(g.id, "RECEIVED")
                                  }
                                >
                                  {updatingId === g.id ? "..." : "Mark Received"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-warning"
                                  disabled={updatingId === g.id}
                                  onClick={() =>
                                    handleStatusUpdate(g.id, "PARTIAL")
                                  }
                                >
                                  {updatingId === g.id ? "..." : "Mark Partial"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  disabled={updatingId === g.id}
                                  onClick={() =>
                                    handleStatusUpdate(g.id, "CANCELLED")
                                  }
                                >
                                  {updatingId === g.id ? "..." : "Cancel"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center text-muted py-4">
                            No GRNs found.
                          </td>
                        </tr>
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
