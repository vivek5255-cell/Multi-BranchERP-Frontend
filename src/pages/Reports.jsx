// // src/pages/Reports.jsx
// import React, { useState } from "react";
// import Table from "../components/Table";

// const Reports = () => {
//   const [filter, setFilter] = useState("stock");

//   return (
//     <div>
//       <div className="page-header">
//         <h2>Reports</h2>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           style={{ padding: "6px 10px" }}
//         >
//           <option value="stock">Branch-wise Stock</option>
//           <option value="purchase">Purchase Register</option>
//           <option value="vendor">Vendor Spend</option>
//         </select>
//       </div>

//       {filter === "stock" && (
//         <Table
//           columns={["Branch", "Product", "Current Stock"]}
//           data={[
//             ["Nashik", "Shampoo Bottle", 120],
//             ["Pune", "Hair Color", 40],
//           ]}
//         />
//       )}

//       {filter === "purchase" && (
//         <Table
//           columns={["Date", "PO No", "Vendor", "Amount"]}
//           data={[
//             ["2025-10-31", "PO-0091", "Nashik Traders", "₹ 12,000"],
//             ["2025-10-30", "PO-0090", "Pune Distri", "₹ 9,500"],
//           ]}
//         />
//       )}

//       {filter === "vendor" && (
//         <Table
//           columns={["Vendor", "Total Purchase (₹)"]}
//           data={[
//             ["Nashik Traders", "65,000"],
//             ["Pune Distri", "40,800"],
//           ]}
//         />
//       )}
//     </div>
//   );
// };

// export default Reports;


// import { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Table, Form, Button, Spinner, Badge } from "react-bootstrap";
// import dayjs from "dayjs";
// import Swal from "sweetalert2";
// import {
//   getSummary, getPurchasesByDate, getInvoicesByDate,
//   getTransfersByStatus, getTopVendors
// } from "../services/reportService";

// export default function Reports() {
//   const [loading, setLoading] = useState(true);

//   const [summary, setSummary] = useState({});
//   const [pFrom, setPFrom] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
//   const [pTo, setPTo]     = useState(dayjs().format("YYYY-MM-DD"));
//   const [pRows, setPRows] = useState([]);

//   const [iFrom, setIFrom] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
//   const [iTo, setITo]     = useState(dayjs().format("YYYY-MM-DD"));
//   const [iRows, setIRows] = useState([]);

//   const [transfers, setTransfers] = useState([]);
//   const [vendors, setVendors] = useState([]);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const [s, pb, ib, ts, tv] = await Promise.all([
//         getSummary(),
//         getPurchasesByDate(pFrom, pTo),
//         getInvoicesByDate(iFrom, iTo),
//         getTransfersByStatus(),
//         getTopVendors(),
//       ]);
//       setSummary(s || {});
//       setPRows(pb || []);
//       setIRows(ib || []);
//       setTransfers(ts || []);
//       setVendors(tv || []);
//     } catch (e) {
//       Swal.fire("Error", e.message || "Failed to load reports", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

//   const reloadPurchases = async () => setPRows(await getPurchasesByDate(pFrom, pTo));
//   const reloadInvoices  = async () => setIRows(await getInvoicesByDate(iFrom, iTo));

//   return (
//     <Container fluid className="py-4">
//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner /> <span className="ms-2">Loading reports...</span>
//         </div>
//       ) : (
//         <>
//           <Row className="g-4">
//             <Col lg={12}>
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <Card.Title>Summary</Card.Title>
//                   <div className="d-flex flex-wrap gap-3">
//                     {Object.entries(summary).map(([k, v]) => (
//                       <div key={k} className="p-3 rounded border bg-light">
//                         <div className="text-muted text-uppercase small">{k}</div>
//                         <div className="fs-4 fw-bold">{v}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           <Row className="g-4 mt-1">
//             <Col lg={6}>
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center">
//                     <Card.Title>Purchases by Date</Card.Title>
//                     <div className="d-flex gap-2">
//                       <Form.Control type="date" value={pFrom} onChange={e=>setPFrom(e.target.value)} />
//                       <Form.Control type="date" value={pTo} onChange={e=>setPTo(e.target.value)} />
//                       <Button variant="primary" onClick={reloadPurchases}>Go</Button>
//                     </div>
//                   </div>
//                   <div className="table-responsive mt-3">
//                     <Table size="sm" hover>
//                       <thead><tr><th>Date</th><th className="text-end">Total</th></tr></thead>
//                       <tbody>
//                         {pRows.length ? pRows.map((r, i)=>(
//                           <tr key={i}>
//                             <td>{dayjs(r.date).format("DD MMM YYYY")}</td>
//                             <td className="text-end">{Number(r.totalAmount || 0).toFixed(2)}</td>
//                           </tr>
//                         )) : <tr><td colSpan={2} className="text-center text-muted">No data</td></tr>}
//                       </tbody>
//                     </Table>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col lg={6}>
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center">
//                     <Card.Title>Invoices by Date</Card.Title>
//                     <div className="d-flex gap-2">
//                       <Form.Control type="date" value={iFrom} onChange={e=>setIFrom(e.target.value)} />
//                       <Form.Control type="date" value={iTo} onChange={e=>setITo(e.target.value)} />
//                       <Button variant="primary" onClick={reloadInvoices}>Go</Button>
//                     </div>
//                   </div>
//                   <div className="table-responsive mt-3">
//                     <Table size="sm" hover>
//                       <thead><tr><th>Date</th><th className="text-end">Total</th></tr></thead>
//                       <tbody>
//                         {iRows.length ? iRows.map((r, i)=>(
//                           <tr key={i}>
//                             <td>{dayjs(r.date).format("DD MMM YYYY")}</td>
//                             <td className="text-end">{Number(r.totalAmount || 0).toFixed(2)}</td>
//                           </tr>
//                         )) : <tr><td colSpan={2} className="text-center text-muted">No data</td></tr>}
//                       </tbody>
//                     </Table>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           <Row className="g-4 mt-1">
//             <Col lg={6}>
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <Card.Title>Stock Transfers by Status</Card.Title>
//                   <Table size="sm" hover className="mt-2">
//                     <thead><tr><th>Status</th><th className="text-end">Count</th></tr></thead>
//                     <tbody>
//                       {transfers.length ? transfers.map((r, i)=>(
//                         <tr key={i}>
//                           <td><Badge bg={
//                             r.status === "RECEIVED" ? "success" :
//                             r.status === "IN_TRANSIT" ? "warning" :
//                             r.status === "CANCELLED" ? "danger" : "secondary"
//                           }>{r.status}</Badge></td>
//                           <td className="text-end">{r.count}</td>
//                         </tr>
//                       )) : <tr><td colSpan={2} className="text-center text-muted">No data</td></tr>}
//                     </tbody>
//                   </Table>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col lg={6}>
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <Card.Title>Top Vendors (by PO Amount)</Card.Title>
//                   <Table size="sm" hover className="mt-2">
//                     <thead><tr><th>Vendor</th><th className="text-end">Total</th></tr></thead>
//                     <tbody>
//                       {vendors.length ? vendors.map((r, i)=>(
//                         <tr key={i}>
//                           <td>{r.vendor}</td>
//                           <td className="text-end">{Number(r.totalAmount || 0).toFixed(2)}</td>
//                         </tr>
//                       )) : <tr><td colSpan={2} className="text-center text-muted">No data</td></tr>}
//                     </tbody>
//                   </Table>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </>
//       )}
//     </Container>
//   );
// }

import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Badge } from "react-bootstrap";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import {
  getSummary,
  getPurchasesByDate,
  getInvoicesByDate,
  getTransferStatusCounts, // correct name
  getTopVendors
} from "../services/reportService";

export default function Reports() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({});
  const [pFrom, setPFrom] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [pTo, setPTo]     = useState(dayjs().format("YYYY-MM-DD"));
  const [pRows, setPRows] = useState([]);

  const [iFrom, setIFrom] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [iTo, setITo]     = useState(dayjs().format("YYYY-MM-DD"));
  const [iRows, setIRows] = useState([]);

  const [transfers, setTransfers] = useState([]);
  const [vendors, setVendors] = useState([]);

  // ✅ Memoize load so ESLint is happy and avoids stale closures
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, pb, ib, ts, tv] = await Promise.all([
        getSummary(),
        getPurchasesByDate(pFrom, pTo),
        getInvoicesByDate(iFrom, iTo),
        getTransferStatusCounts(),
        getTopVendors(),
      ]);
      setSummary(s || {});
      setPRows(Array.isArray(pb) ? pb : []);
      setIRows(Array.isArray(ib) ? ib : []);
      setTransfers(Array.isArray(ts) ? ts : []);
      setVendors(Array.isArray(tv) ? tv : []);
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to load reports", "error");
    } finally {
      setLoading(false);
    }
  }, [pFrom, pTo, iFrom, iTo]);

  useEffect(() => {
    load();
  }, [load]); // ✅ no warning

  const reloadPurchases = async () => {
    try {
      const pb = await getPurchasesByDate(pFrom, pTo);
      setPRows(Array.isArray(pb) ? pb : []);
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to load purchases", "error");
    }
  };

  const reloadInvoices  = async () => {
    try {
      const ib = await getInvoicesByDate(iFrom, iTo);
      setIRows(Array.isArray(ib) ? ib : []);
    } catch (e) {
      Swal.fire("Error", e.message || "Failed to load invoices", "error");
    }
  };

  return (
    <Container fluid className="py-4">
      {loading ? (
        <div className="text-center py-5">
          <Spinner /> <span className="ms-2">Loading reports...</span>
        </div>
      ) : (
        <>
          <Row className="g-4">
            <Col lg={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Summary</Card.Title>
                  <div className="d-flex flex-wrap gap-3">
                    {Object.entries(summary).map(([k, v]) => (
                      <div key={k} className="p-3 rounded border bg-light">
                        <div className="text-muted text-uppercase small">{k}</div>
                        <div className="fs-4 fw-bold">{v}</div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mt-1">
            <Col lg={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>Purchases by Date</Card.Title>
                    <div className="d-flex gap-2">
                      <Form.Control type="date" value={pFrom} onChange={e=>setPFrom(e.target.value)} />
                      <Form.Control type="date" value={pTo} onChange={e=>setPTo(e.target.value)} />
                      <Button variant="primary" onClick={reloadPurchases}>Go</Button>
                    </div>
                  </div>
                  <div className="table-responsive mt-3">
                    <Table size="sm" hover>
                      <thead><tr><th>Date</th><th className="text-end">Total</th></tr></thead>
                      <tbody>
                        {pRows.length ? pRows.map((r, i)=>(
                          <tr key={i}>
                            <td>{r?.date ? dayjs(r.date).format("DD MMM YYYY") : "-"}</td>
                            <td className="text-end">{Number(r?.totalAmount || 0).toFixed(2)}</td>
                          </tr>
                        )) : <tr><td colSpan={2} className="text-center text-muted">No data</td></tr>}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>Invoices by Date</Card.Title>
                    <div className="d-flex gap-2">
                      <Form.Control type="date" value={iFrom} onChange={e=>setIFrom(e.target.value)} />
                      <Form.Control type="date" value={iTo} onChange={e=>setITo(e.target.value)} />
                      <Button variant="primary" onClick={reloadInvoices}>Go</Button>
                    </div>
                  </div>
                  <div className="table-responsive mt-3">
                    <Table size="sm" hover>
                      <thead><tr><th>Date</th><th className="text-end">Total</th></tr></thead>
                      <tbody>
                        {iRows.length ? iRows.map((r, i)=>(
                          <tr key={i}>
                            <td>{r?.date ? dayjs(r.date).format("DD MMM YYYY") : "-"}</td>
                            <td className="text-end">{Number(r?.totalAmount || 0).toFixed(2)}</td>
                          </tr>
                        )) : <tr><td colSpan={2} className="text-center text-muted">No data</td></tr>}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mt-1">
            <Col lg={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Stock Transfers by Status</Card.Title>
                  <Table size="sm" hover className="mt-2">
                    <thead><tr><th>Status</th><th className="text-end">Count</th></tr></thead>
                    <tbody>
                      {transfers.length ? transfers.map((r, i)=>(
                        <tr key={i}>
                          <td>
                            <Badge bg={
                              r?.status === "RECEIVED" ? "success" :
                              r?.status === "IN_TRANSIT" ? "warning" :
                              r?.status === "CANCELLED" ? "danger" : "secondary"
                            }>
                              {r?.status || "-"}
                            </Badge>
                          </td>
                          <td className="text-end">{Number(r?.count || 0)}</td>
                        </tr>
                      )) : <tr><td colSpan={2} className="text-center text-muted">No data</td></tr>}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Top Vendors (by PO Amount)</Card.Title>
                  <Table size="sm" hover className="mt-2">
                    <thead><tr><th>Vendor</th><th className="text-end">Total</th></tr></thead>
                    <tbody>
                      {vendors.length ? vendors.map((r, i)=>(
                        <tr key={i}>
                          <td>{r?.vendor || "-"}</td>
                          <td className="text-end">{Number(r?.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                      )) : <tr><td colSpan={2} className="text-center text-muted">No data</td></tr>}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
