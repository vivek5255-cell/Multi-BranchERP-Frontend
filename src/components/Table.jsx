import React from "react";
import "../styles/table.css";

const Table = ({ columns = [], data = [], actions = [] }) => {
  return (
    <div className="table-wrapper">
      <table className="erp-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
            {actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx}>{cell}</td>
                ))}
                {actions.length > 0 && (
                  <td>
                    {actions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        className={`table-action ${action.className || ""}`}
                        onClick={() => action.onClick(row)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
