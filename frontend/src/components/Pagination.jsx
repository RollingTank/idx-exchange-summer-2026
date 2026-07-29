import React from "react";
import './Pagination.css'

export const generatePageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 7) {
        return Array.from({
            length : totalPages
        }, (_, i) => i + 1);
    }

    const showLeftEllipsis = currentPage > 4;
    const showRightEllipsis = currentPage < totalPages - 3;
    
    if (!showLeftEllipsis && showRightEllipsis) {
        return [1, 2, 3, 4, 5, "...", totalPages,];
    }
    if (showLeftEllipsis && !showRightEllipsis) {
        const startRange = totalPages - 4;
        return [1, "...", startRange, startRange + 1, startRange + 2, startRange + 3, totalPages,];
    }
    if (showLeftEllipsis && showRightEllipsis) {
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages,];
    }
    return [];
};

export default function Pagination({ currentPage, totalPages, onPageChange}) {
    if (totalPages <= 1) {
        return null;
    }
    const pageNumbers = generatePageNumbers(currentPage, totalPages);
    return (
        <nav className="pagination-container" aria-label="Pagination Navigation">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            className={`pagination-number ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </nav>
    );
}
