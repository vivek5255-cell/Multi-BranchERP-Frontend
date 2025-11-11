// // src/pages/Dashboard.jsx
// import React from "react";
// import Table from "../components/Table";
// import "../styles/dashboard-page.css";

// const Dashboard = () => {
//   return (
//     <div>
//       <div className="page-header">
//         <h2>Dashboard</h2>
//         <p className="muted">Overview of branches, purchases, and stock.</p>
//       </div>

//       <div className="cards-row">
//         <div className="stat-card">
//           <h4>Total Branches</h4>
//           <p className="stat-number">4</p>
//           <span className="stat-hint">active</span>
//         </div>
//         <div className="stat-card">
//           <h4>Open POs</h4>
//           <p className="stat-number">12</p>
//           <span className="stat-hint">need GRN</span>
//         </div>
//         <div className="stat-card">
//           <h4>Low Stock Items</h4>
//           <p className="stat-number">6</p>
//           <span className="stat-hint">reorder today</span>
//         </div>
//       </div>

//       <h3 className="section-title">Recent Purchase Orders</h3>
//       <Table
//         columns={["PO No", "Vendor", "Branch", "Date", "Status"]}
//         data={[
//           ["PO-0012", "Nashik Traders", "Nashik", "2025-10-31", "Pending GRN"],
//           ["PO-0011", "Pune Distri", "Pune", "2025-10-30", "Completed"],
//         ]}
//       />
//     </div>
//   );
// };

// export default Dashboard;


// src/pages/Dashboard.jsx
// import { useEffect, useMemo, useState } from "react";
// import {
//   Container, Row, Col, Card, Spinner, Badge, Table, ProgressBar,
//   Button, InputGroup, Form
// } from "react-bootstrap";
// import dayjs from "dayjs";
// import Swal from "sweetalert2";

// // if you already have reportService, keep it; otherwise create it from step 2.
// import {
//   getSummary,
//   getPurchasesByDate,
//   getInvoicesByDate,
//   getTransferStatusCounts,
//   getTopVendors,
// } from "../services/reportService";

// export default function Dashboard() {
//   // date range (default: last 30 days)
//   const [from, setFrom] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
//   const [to, setTo] = useState(dayjs().format("YYYY-MM-DD"));

//   // data state
//   const [summary, setSummary] = useState(null);
//   const [purchases, setPurchases] = useState([]);
//   const [invoices, setInvoices] = useState([]);
//   const [statusCounts, setStatusCounts] = useState([]);
//   const [vendors, setVendors] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const load = async () => {
//     const busySetter = loading ? setLoading : setRefreshing;
//     busySetter(true);
//     try {
//       const [s, p, i, st, v] = await Promise.all([
//         getSummary(),
//         getPurchasesByDate(from, to),
//         getInvoicesByDate(from, to),
//         getTransferStatusCounts(),
//         getTopVendors(),
//       ]);
//       setSummary(s || {});
//       setPurchases(Array.isArray(p) ? p : []);
//       setInvoices(Array.isArray(i) ? i : []);
//       setStatusCounts(Array.isArray(st) ? st : []);
//       setVendors(Array.isArray(v) ? v : []);
//     } catch (err) {
//       Swal.fire("Error", err.message || "Failed to load dashboard", "error");
//     } finally {
//       busySetter(false);
//     }
//   };

//   useEffect(() => { load(); /* initial */ }, []);
//   const applyRange = async () => { await load(); };

//   // computed
//   const transfersTotal = useMemo(
//     () => statusCounts.reduce((sum, r) => sum + Number(r.count || 0), 0),
//     [statusCounts]
//   );

//   const currency = (n) => {
//     if (n == null) return "-";
//     const num = Number(n);
//     if (Number.isNaN(num)) return String(n);
//     return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="align-items-end g-3 mb-3">
//         <Col md={3}><h4 className="mb-0">Dashboard</h4></Col>
//         <Col md={7}>
//           <InputGroup>
//             <InputGroup.Text>From</InputGroup.Text>
//             <Form.Control type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
//             <InputGroup.Text>To</InputGroup.Text>
//             <Form.Control type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
//           </InputGroup>
//         </Col>
//         <Col md={2} className="d-grid">
//           <Button onClick={applyRange} disabled={refreshing}>
//             {refreshing ? <><Spinner size="sm" className="me-2" /> Refreshing…</> : "Apply"}
//           </Button>
//         </Col>
//       </Row>

//       {/* Summary cards */}
//       <Row className="g-3 mb-3">
//         <SummaryCard title="Products" value={summary?.products} />
//         <SummaryCard title="Vendors" value={summary?.vendors} />
//         <SummaryCard title="Branches" value={summary?.branches} />
//         <SummaryCard title="Purchase Orders" value={summary?.purchaseOrders} />
//         <SummaryCard title="Invoices" value={summary?.invoices} />
//         <SummaryCard title="Stock Transfers" value={summary?.stockTransfers} />
//       </Row>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner /> <span className="ms-2">Loading…</span>
//         </div>
//       ) : (
//         <>
//           <Row className="g-3">
//             {/* Purchases by date */}
//             <Col lg={6}>
//               <Card className="shadow-sm h-100">
//                 <Card.Body>
//                   <Card.Title>Purchases (by date)</Card.Title>
//                   <SmallLineTable rows={purchases} />
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Invoices by date */}
//             <Col lg={6}>
//               <Card className="shadow-sm h-100">
//                 <Card.Body>
//                   <Card.Title>Invoices (by date)</Card.Title>
//                   <SmallLineTable rows={invoices} />
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           <Row className="g-3 mt-1">
//             {/* Transfers by status */}
//             <Col lg={6}>
//               <Card className="shadow-sm h-100">
//                 <Card.Body>
//                   <Card.Title>Transfers by Status</Card.Title>

//                   {transfersTotal === 0 ? (
//                     <div className="text-muted">No transfer data.</div>
//                   ) : (
//                     <>
//                       <div className="mb-2">
//                         <ProgressBar>
//                           {statusCounts.map((r, idx) => {
//                             const pct = (Number(r.count) / transfersTotal) * 100;
//                             const variant = statusVariant(r.status);
//                             return (
//                               <ProgressBar
//                                 key={idx}
//                                 now={pct}
//                                 label={`${Math.round(pct)}%`}
//                                 variant={variant}
//                               />
//                             );
//                           })}
//                         </ProgressBar>
//                       </div>
//                       <Table size="sm" className="mb-0">
//                         <thead>
//                           <tr>
//                             <th>Status</th>
//                             <th className="text-end">Count</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {statusCounts.map((r, i) => (
//                             <tr key={i}>
//                               <td>
//                                 <Badge bg={statusVariant(r.status)}>{r.status}</Badge>
//                               </td>
//                               <td className="text-end">{r.count}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Top vendors */}
//             <Col lg={6}>
//               <Card className="shadow-sm h-100">
//                 <Card.Body>
//                   <Card.Title>Top Vendors (by PO Amount)</Card.Title>
//                   {vendors?.length ? (
//                     <Table hover size="sm" className="align-middle">
//                       <thead>
//                         <tr>
//                           <th>#</th>
//                           <th>Vendor</th>
//                           <th className="text-end">Total</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {vendors.map((v, idx) => (
//                           <tr key={idx}>
//                             <td>{idx + 1}</td>
//                             <td>{String(v.vendor ?? v.name ?? "-")}</td>
//                             <td className="text-end">{currency(v.totalAmount)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   ) : (
//                     <div className="text-muted">No data.</div>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </>
//       )}
//     </Container>
//   );
// }

// function SummaryCard({ title, value }) {
//   return (
//     <Col sm={6} md={4} xl={2}>
//       <Card className="shadow-sm h-100">
//         <Card.Body className="d-flex flex-column">
//           <div className="text-muted">{title}</div>
//           <div className="display-6 fw-semibold">{value ?? 0}</div>
//         </Card.Body>
//       </Card>
//     </Col>
//   );
// }

// function SmallLineTable({ rows }) {
//   // rows: [{ date: '2025-11-03', totalAmount: 12345.67 }, ...]
//   if (!Array.isArray(rows) || rows.length === 0) return <div className="text-muted">No data.</div>;
//   const currency = (n) =>
//     Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   return (
//     <Table hover size="sm" className="align-middle">
//       <thead>
//         <tr>
//           <th>Date</th>
//           <th className="text-end">Total Amount</th>
//         </tr>
//       </thead>
//       <tbody>
//         {rows.map((r, i) => (
//           <tr key={i}>
//             <td>{dayjs(r.date).isValid() ? dayjs(r.date).format("DD MMM YYYY") : String(r.date)}</td>
//             <td className="text-end">{currency(r.totalAmount)}</td>
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// }

// function statusVariant(status) {
//   switch (String(status || "").toUpperCase()) {
//     case "REQUESTED": return "secondary";
//     case "IN_TRANSIT": return "warning";
//     case "RECEIVED": return "success";
//     case "CANCELLED": return "danger";
//     default: return "primary";
//   }
// }





// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Container, Row, Col, Card, Spinner, Badge, Table, ProgressBar,
  Button, InputGroup, Form
} from "react-bootstrap";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import {
  getSummary,
  getPurchasesByDate,
  getInvoicesByDate,
  getTransferStatusCounts,
  getTopVendors,
} from "../services/reportService";

export default function Dashboard() {
  const [from, setFrom] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
  const [to, setTo] = useState(dayjs().format("YYYY-MM-DD"));

  const [summary, setSummary] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Memoized loader
  const load = useCallback(async ({ initial = false } = {}) => {
    // control which spinner to show
    if (initial) setLoading(true);
    else setRefreshing(true);

    try {
      const [s, p, i, st, v] = await Promise.all([
        getSummary(),
        getPurchasesByDate(from, to),
        getInvoicesByDate(from, to),
        getTransferStatusCounts(),
        getTopVendors(),
      ]);
      setSummary(s || {});
      setPurchases(Array.isArray(p) ? p : []);
      setInvoices(Array.isArray(i) ? i : []);
      setStatusCounts(Array.isArray(st) ? st : []);
      setVendors(Array.isArray(v) ? v : []);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to load dashboard", "error");
    } finally {
      if (initial) setLoading(false);
      else setRefreshing(false);
    }
  }, [from, to]);

  // initial load
  useEffect(() => {
    load({ initial: true });
  }, [load]);

  const applyRange = async () => {
    await load(); // soft refresh (shows button spinner state)
  };

  const transfersTotal = useMemo(
    () => statusCounts.reduce((sum, r) => sum + Number(r.count || 0), 0),
    [statusCounts]
  );

  const currency = (n) => {
    if (n == null) return "-";
    const num = Number(n);
    if (Number.isNaN(num)) return String(n);
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Container fluid className="py-4">
      <Row className="align-items-end g-3 mb-3">
        <Col md={3}><h4 className="mb-0">Dashboard</h4></Col>
        <Col md={7}>
          <InputGroup>
            <InputGroup.Text>From</InputGroup.Text>
            <Form.Control type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
            <InputGroup.Text>To</InputGroup.Text>
            <Form.Control type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
          </InputGroup>
        </Col>
        <Col md={2} className="d-grid">
          <Button onClick={applyRange} disabled={refreshing}>
            {refreshing ? <><Spinner size="sm" className="me-2" /> Refreshing…</> : "Apply"}
          </Button>
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <SummaryCard title="Products" value={summary?.products} />
        <SummaryCard title="Vendors" value={summary?.vendors} />
        <SummaryCard title="Branches" value={summary?.branches} />
        <SummaryCard title="Purchase Orders" value={summary?.purchaseOrders} />
        <SummaryCard title="Invoices" value={summary?.invoices} />
        <SummaryCard title="Stock Transfers" value={summary?.stockTransfers} />
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner /> <span className="ms-2">Loading…</span>
        </div>
      ) : (
        <>
          <Row className="g-3">
            <Col lg={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>Purchases (by date)</Card.Title>
                  <SmallLineTable rows={purchases} />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>Invoices (by date)</Card.Title>
                  <SmallLineTable rows={invoices} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3 mt-1">
            <Col lg={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>Transfers by Status</Card.Title>
                  {transfersTotal === 0 ? (
                    <div className="text-muted">No transfer data.</div>
                  ) : (
                    <>
                      <div className="mb-2">
                        <ProgressBar>
                          {statusCounts.map((r, idx) => {
                            const pct = (Number(r.count) / transfersTotal) * 100;
                            const variant = statusVariant(r.status);
                            return (
                              <ProgressBar
                                key={idx}
                                now={pct}
                                label={`${Math.round(pct)}%`}
                                variant={variant}
                              />
                            );
                          })}
                        </ProgressBar>
                      </div>
                      <Table size="sm" className="mb-0">
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th className="text-end">Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statusCounts.map((r, i) => (
                            <tr key={i}>
                              <td><Badge bg={statusVariant(r.status)}>{r.status}</Badge></td>
                              <td className="text-end">{r.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>Top Vendors (by PO Amount)</Card.Title>
                  {vendors?.length ? (
                    <Table hover size="sm" className="align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Vendor</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendors.map((v, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{String(v.vendor ?? v.name ?? "-")}</td>
                            <td className="text-end">{currency(v.totalAmount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-muted">No data.</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

function SummaryCard({ title, value }) {
  return (
    <Col sm={6} md={4} xl={2}>
      <Card className="shadow-sm h-100">
        <Card.Body className="d-flex flex-column">
          <div className="text-muted">{title}</div>
          <div className="display-6 fw-semibold">{value ?? 0}</div>
        </Card.Body>
      </Card>
    </Col>
  );
}

function SmallLineTable({ rows }) {
  if (!Array.isArray(rows) || rows.length === 0) return <div className="text-muted">No data.</div>;
  const currency = (n) =>
    Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Table hover size="sm" className="align-middle">
      <thead>
        <tr>
          <th>Date</th>
          <th className="text-end">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{dayjs(r.date).isValid() ? dayjs(r.date).format("DD MMM YYYY") : String(r.date)}</td>
            <td className="text-end">{currency(r.totalAmount)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function statusVariant(status) {
  switch (String(status || "").toUpperCase()) {
    case "REQUESTED": return "secondary";
    case "IN_TRANSIT": return "warning";
    case "RECEIVED": return "success";
    case "CANCELLED": return "danger";
    default: return "primary";
  }
}
