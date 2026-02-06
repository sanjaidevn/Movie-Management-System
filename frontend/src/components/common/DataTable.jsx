//region Imports
import React from 'react';

import { getPaginationRange } from '../../utils/commonFunctions';
//endregion Imports

//region DataTable Component
const DataTable = ({
  title = '',
  columns = [],
  data = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange = () => {},
  emptyMessage = 'No records found',
}) => {
  try {
    const safeData = Array.isArray(data) ? data : [];

    return (
      <div className="card shadow-sm">
        <div className="card-body">
          {title ? <h6 className="fw-bold mb-3">{title}</h6> : null}

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  {columns?.map((col, i) => (
                    <th key={i} style={col?.width ? { width: col.width } : {}}>
                      {col?.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Empty State */}
                {!loading && safeData?.length === 0 ? (
                  <tr>
                    <td colSpan={columns?.length} className="text-center text-muted">
                      {emptyMessage}
                    </td>
                  </tr>
                ) : null}

                {/* Rows */}
                {safeData.map((row, rowIndex) => (
                  <tr key={row?.id ?? rowIndex}>
                    {columns?.map((col, colIndex) => (
                      <td key={colIndex}>
                        {typeof col?.render === 'function'
                          ? col?.render(row, rowIndex)
                          : (row?.[col?.accessor] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (INSIDE TABLE COMPONENT) */}
          {totalPages > 1 ? (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-3 flex-wrap">
              {/* Prev */}
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                Prev
              </button>

              {/* Page Numbers */}
              {getPaginationRange(page, totalPages).map((p, index, arr) => {
                const prev = arr[index - 1];

                return (
                  <React.Fragment key={p}>
                    {/* Ellipsis */}
                    {prev && p - prev > 1 ? <span className="px-1 text-muted">...</span> : null}

                    <button
                      className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => onPageChange(p)}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

              {/* Next */}
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  } catch (err) {
    return null;
  }
};
//endregion DataTable

export default DataTable;
