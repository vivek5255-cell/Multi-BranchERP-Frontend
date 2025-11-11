// src/pages/StockTransfer.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Container, Row, Col, Card, Button, Table, Form, Badge, InputGroup, Spinner
} from "react-bootstrap";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import { getAllTransfers, createTransfer, updateTransferStatus } from "../services/stockTransferService";
import { getBranches } from "../services/branchService";
import { getProducts } from "../services/productService";

const STATUS = {
  REQUESTED: "secondary",
  IN_TRANSIT: "warning",
  RECEIVED: "success",
  CANCELLED: "danger",
};

export default function StockTransfer() {
  const [fromBranch, setFromBranch] = useState("");
  const [toBranch, setToBranch] = useState("");
  const [transferDate, setTransferDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [notes, setNotes] = useState("");

  const [lines, setLines] = useState([{ productId: "", qty: "" }]);

  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [t, b, p] = await Promise.all([
        getAllTransfers(),
        getBranches(),
        getProducts(),
      ]);
      setTransfers(t || []);
      setBranches(b || []);
      setProducts(p || []);
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const addLine = () => setLines((prev) => [...prev, { productId: "", qty: "" }]);
  const removeLine = (i) => setLines((prev) => prev.filter((_, idx) => idx !== i));
  const changeLine = (i, key, val) => {
    setLines((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: val };
      return copy;
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transfers;
    return transfers.filter((t) => {
      const f = [
        t?.transferNumber,
        t?.fromBranch?.branchName,
        t?.toBranch?.branchName,
        t?.status,
      ]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());
      return f.some((x) => x.includes(q));
    });
  }, [transfers, search]);

  const reset = () => {
    setFromBranch("");
    setToBranch("");
    setTransferDate(dayjs().format("YYYY-MM-DD"));
    setNotes("");
    setLines([{ productId: "", qty: "" }]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!fromBranch || !toBranch) {
      return Swal.fire("Validation", "Choose both From and To branches.", "info");
    }
    if (fromBranch === toBranch) {
      return Swal.fire("Validation", "From and To branches cannot be the same.", "info");
    }

    const items = lines
      .map((l) => ({
        productId: Number(l.productId),
        quantity: Number(l.qty),
      }))
      .filter((x) => x.productId && !Number.isNaN(x.quantity) && x.quantity > 0);

    if (!items.length) {
      return Swal.fire("Validation", "Add at least one valid product line (qty > 0).", "info");
    }

    setCreating(true);
    try {
      const payload = {
        fromBranchId: Number(fromBranch),
        toBranchId: Number(toBranch),
        transferDate,
        notes,
        items,
      };
      const created = await createTransfer(payload);
      Swal.fire("Transfer Created", created?.transferNumber || "Success", "success");
      reset();
      setTransfers(await getAllTransfers());
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to create transfer", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleStatus = async (id, next) => {
    setUpdatingId(id);
    try {
      await updateTransferStatus(id, next);
      setTransfers(await getAllTransfers());
      Swal.fire("Updated", "Transfer status updated.", "success");
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const badge = (s) => <Badge bg={STATUS[s] || "secondary"}>{s}</Badge>;

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Create Stock Transfer</Card.Title>
              <Form onSubmit={handleCreate}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>From Branch</Form.Label>
                      <Form.Select
                        value={fromBranch}
                        onChange={(e) => setFromBranch(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.branchName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>To Branch</Form.Label>
                      <Form.Select
                        value={toBranch}
                        onChange={(e) => setToBranch(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.branchName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={transferDate}
                        onChange={(e) => setTransferDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="optional"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <strong>Items</strong>
                  <Button size="sm" variant="outline-primary" onClick={addLine}>
                    + Add Line
                  </Button>
                </div>

                {lines.map((ln, i) => (
                  <Row className="mb-2" key={i}>
                    <Col md={7}>
                      <Form.Select
                        value={ln.productId}
                        onChange={(e) => changeLine(i, "productId", e.target.value)}
                      >
                        <option value="">-- Product --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.productName || p.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Qty"
                        value={ln.qty}
                        onChange={(e) => changeLine(i, "qty", e.target.value)}
                      />
                    </Col>
                    <Col md={1} className="d-grid">
                      <Button
                        variant="outline-danger"
                        onClick={() => removeLine(i)}
                        disabled={lines.length === 1}
                        title="Remove line"
                      >
                        ×
                      </Button>
                    </Col>
                  </Row>
                ))}

                <div className="d-grid mt-3">
                  <Button type="submit" disabled={creating}>
                    {creating ? (
                      <>
                        <Spinner size="sm" className="me-2" /> Creating...
                      </>
                    ) : (
                      "Create Transfer"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <Card.Title className="mb-2 mb-md-0">Stock Transfers</Card.Title>
                <InputGroup style={{ maxWidth: 340 }}>
                  <Form.Control
                    placeholder="Search by number / branch / status"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button variant="outline-secondary" onClick={() => setSearch("")}>
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
                        <th>Transfer</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length ? (
                        filtered.map((t, i) => (
                          <tr key={t.id}>
                            <td>{i + 1}</td>
                            <td className="fw-semibold">{t.transferNumber}</td>
                            <td>{t?.fromBranch?.branchName}</td>
                            <td>{t?.toBranch?.branchName}</td>
                            <td>
                              {t?.transferDate
                                ? dayjs(t.transferDate).format("DD MMM YYYY")
                                : "-"}
                            </td>
                            <td>{badge(t.status)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline-warning"
                                  disabled={updatingId === t.id}
                                  onClick={() => handleStatus(t.id, "IN_TRANSIT")}
                                >
                                  {updatingId === t.id ? "..." : "Mark In-Transit"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  disabled={updatingId === t.id}
                                  onClick={() => handleStatus(t.id, "RECEIVED")}
                                >
                                  {updatingId === t.id ? "..." : "Mark Received"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  disabled={updatingId === t.id}
                                  onClick={() => handleStatus(t.id, "CANCELLED")}
                                >
                                  {updatingId === t.id ? "..." : "Cancel"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center text-muted py-4">
                            No transfers found.
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


// // src/pages/StockTransfer.jsx
// import { useEffect, useMemo, useState } from "react";
// import {
//   Container, Row, Col, Card, Button, Table, Form, Badge, InputGroup, Spinner
// } from "react-bootstrap";
// import Swal from "sweetalert2";
// import dayjs from "dayjs";

// import { getAllTransfers, createTransfer, updateTransferStatus } from "../services/stockTransferService";
// import { getBranches } from "../services/branchService";
// import { getProducts } from "../services/productService";

// const STATUS = {
//   REQUESTED: "secondary",
//   IN_TRANSIT: "warning",
//   RECEIVED: "success",
//   CANCELLED: "danger",
// };

// const asList = (x) =>
//   Array.isArray(x) ? x :
//   Array.isArray(x?.data) ? x.data :
//   Array.isArray(x?.content) ? x.content :
//   [];

// export default function StockTransfer() {
//   const [fromBranch, setFromBranch] = useState("");
//   const [toBranch, setToBranch] = useState("");
//   const [transferDate, setTransferDate] = useState(dayjs().format("YYYY-MM-DD"));
//   const [notes, setNotes] = useState("");

//   const [lines, setLines] = useState([{ productId: "", qty: "" }]);

//   const [branches, setBranches] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [transfers, setTransfers] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [creating, setCreating] = useState(false);
//   const [updatingId, setUpdatingId] = useState(null);
//   const [search, setSearch] = useState("");

//   const loadAll = async () => {
//     setLoading(true);
//     try {
//       const [t, b, p] = await Promise.all([
//         getAllTransfers(),
//         getBranches(),
//         getProducts(),
//       ]);
//       setTransfers(asList(t));
//       setBranches(asList(b));
//       setProducts(asList(p));
//     } catch (e) {
//       Swal.fire("Error", e.message || "Failed to load data", "error");
//       setTransfers([]); setBranches([]); setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadAll(); }, []);

//   const addLine = () => setLines((prev) => [...prev, { productId: "", qty: "" }]);
//   const removeLine = (i) => setLines((prev) => prev.filter((_, idx) => idx !== i));
//   const changeLine = (i, key, val) => {
//     setLines((prev) => {
//       const copy = [...prev];
//       copy[i] = { ...copy[i], [key]: val };
//       return copy;
//     });
//   };

//   const filtered = useMemo(() => {
//     const base = asList(transfers);
//     const q = (search || "").trim().toLowerCase();
//     if (!q) return base;
//     return base.filter((t) => {
//       const f = [
//         t?.transferNumber,
//         t?.fromBranch?.branchName,
//         t?.toBranch?.branchName,
//         t?.status,
//       ]
//         .filter(Boolean)
//         .map((x) => String(x).toLowerCase());
//       return f.some((x) => x.includes(q));
//     });
//   }, [transfers, search]);

//   const reset = () => {
//     setFromBranch("");
//     setToBranch("");
//     setTransferDate(dayjs().format("YYYY-MM-DD"));
//     setNotes("");
//     setLines([{ productId: "", qty: "" }]);
//   };

//   const handleCreate = async (e) => {
//     e.preventDefault();

//     if (!fromBranch || !toBranch) {
//       return Swal.fire("Validation", "Choose both From and To branches.", "info");
//     }
//     if (fromBranch === toBranch) {
//       return Swal.fire("Validation", "From and To branches cannot be the same.", "info");
//     }

//     const items = lines
//       .map((l) => ({
//         productId: Number(l.productId),
//         quantity: Number(l.qty),
//       }))
//       .filter((x) => x.productId && Number.isFinite(x.quantity) && x.quantity > 0);

//     if (!items.length) {
//       return Swal.fire("Validation", "Add at least one valid product line (qty > 0).", "info");
//     }

//     setCreating(true);
//     try {
//       const payload = {
//         fromBranchId: Number(fromBranch),
//         toBranchId: Number(toBranch),
//         transferDate,
//         notes,
//         items,
//       };
//       const created = await createTransfer(payload);
//       Swal.fire("Transfer Created", created?.transferNumber || "Success", "success");
//       reset();
//       const latest = await getAllTransfers();
//       setTransfers(asList(latest));
//     } catch (e) {
//       Swal.fire("Error", e.message || "Failed to create transfer", "error");
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleStatus = async (id, next) => {
//     setUpdatingId(id);
//     try {
//       await updateTransferStatus(id, next);
//       const latest = await getAllTransfers();
//       setTransfers(asList(latest));
//       Swal.fire("Updated", "Transfer status updated.", "success");
//     } catch (e) {
//       Swal.fire("Error", e.message || "Failed to update status", "error");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const badge = (s) => <Badge bg={STATUS[s] || "secondary"}>{s}</Badge>;

//   return (
//     <Container fluid className="py-4">
//       <Row className="g-4">
//         <Col lg={5}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Card.Title className="mb-3">Create Stock Transfer</Card.Title>
//               <Form onSubmit={handleCreate}>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>From Branch</Form.Label>
//                       <Form.Select
//                         value={fromBranch}
//                         onChange={(e) => setFromBranch(e.target.value)}
//                       >
//                         <option value="">-- Select --</option>
//                         {asList(branches).map((b) => (
//                           <option key={b.id} value={b.id}>
//                             {b.branchName}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>To Branch</Form.Label>
//                       <Form.Select
//                         value={toBranch}
//                         onChange={(e) => setToBranch(e.target.value)}
//                       >
//                         <option value="">-- Select --</option>
//                         {asList(branches).map((b) => (
//                           <option key={b.id} value={b.id}>
//                             {b.branchName}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Date</Form.Label>
//                       <Form.Control
//                         type="date"
//                         value={transferDate}
//                         onChange={(e) => setTransferDate(e.target.value)}
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Notes</Form.Label>
//                       <Form.Control
//                         value={notes}
//                         onChange={(e) => setNotes(e.target.value)}
//                         placeholder="optional"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <div className="mb-2 d-flex justify-content-between align-items-center">
//                   <strong>Items</strong>
//                   <Button size="sm" variant="outline-primary" onClick={addLine}>
//                     + Add Line
//                   </Button>
//                 </div>

//                 {lines.map((ln, i) => (
//                   <Row className="mb-2" key={i}>
//                     <Col md={7}>
//                       <Form.Select
//                         value={ln.productId}
//                         onChange={(e) => changeLine(i, "productId", e.target.value)}
//                       >
//                         <option value="">-- Product --</option>
//                         {asList(products).map((p) => (
//                           <option key={p.id} value={p.id}>
//                             {p.productName || p.name}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Col>
//                     <Col md={4}>
//                       <Form.Control
//                         inputMode="numeric"
//                         pattern="[0-9]*"
//                         placeholder="Qty"
//                         value={ln.qty}
//                         onChange={(e) => changeLine(i, "qty", e.target.value)}
//                       />
//                     </Col>
//                     <Col md={1} className="d-grid">
//                       <Button
//                         variant="outline-danger"
//                         onClick={() => removeLine(i)}
//                         disabled={lines.length === 1}
//                         title="Remove line"
//                       >
//                         ×
//                       </Button>
//                     </Col>
//                   </Row>
//                 ))}

//                 <div className="d-grid mt-3">
//                   <Button type="submit" disabled={creating}>
//                     {creating ? (
//                       <>
//                         <Spinner size="sm" className="me-2" /> Creating...
//                       </>
//                     ) : (
//                       "Create Transfer"
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col lg={7}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
//                 <Card.Title className="mb-2 mb-md-0">Stock Transfers</Card.Title>
//                 <InputGroup style={{ maxWidth: 340 }}>
//                   <Form.Control
//                     placeholder="Search by number / branch / status"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />
//                   <Button variant="outline-secondary" onClick={() => setSearch("")}>
//                     Clear
//                   </Button>
//                 </InputGroup>
//               </div>

//               {loading ? (
//                 <div className="text-center py-4">
//                   <Spinner /> <span className="ms-2">Loading...</span>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <Table hover className="align-middle">
//                     <thead>
//                       <tr>
//                         <th>#</th>
//                         <th>Transfer</th>
//                         <th>From</th>
//                         <th>To</th>
//                         <th>Date</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {asList(filtered).length ? (
//                         asList(filtered).map((t, i) => (
//                           <tr key={t.id ?? i}>
//                             <td>{i + 1}</td>
//                             <td className="fw-semibold">{t.transferNumber}</td>
//                             <td>{t?.fromBranch?.branchName}</td>
//                             <td>{t?.toBranch?.branchName}</td>
//                             <td>
//                               {t?.transferDate
//                                 ? dayjs(t.transferDate).format("DD MMM YYYY")
//                                 : "-"}
//                             </td>
//                             <td>{badge(t.status)}</td>
//                             <td>
//                               <div className="d-flex gap-2">
//                                 <Button
//                                   size="sm"
//                                   variant="outline-warning"
//                                   disabled={updatingId === t.id}
//                                   onClick={() => handleStatus(t.id, "IN_TRANSIT")}
//                                 >
//                                   {updatingId === t.id ? "..." : "Mark In-Transit"}
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="outline-success"
//                                   disabled={updatingId === t.id}
//                                   onClick={() => handleStatus(t.id, "RECEIVED")}
//                                 >
//                                   {updatingId === t.id ? "..." : "Mark Received"}
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="outline-danger"
//                                   disabled={updatingId === t.id}
//                                   onClick={() => handleStatus(t.id, "CANCELLED")}
//                                 >
//                                   {updatingId === t.id ? "..." : "Cancel"}
//                                 </Button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan={7} className="text-center text-muted py-4">
//                             No transfers found.
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </Table>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
