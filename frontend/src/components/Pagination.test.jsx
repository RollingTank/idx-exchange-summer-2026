import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination, { generatePageNumbers } from "./Pagination";

describe("Pagination Component Logic & Rendering", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("hides pagination when totalPages is 1 or less", () => {
  render(
    <Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />
  );
  
  // Checks that the pagination <nav> element is not rendered
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});

  test("disables 'Previous' on page 1 and enables 'Next'", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByText("Previous")).toBeDisabled();
    expect(screen.getByText("Next")).not.toBeDisabled();
  });

  test("disables 'Next' on the last page and enables 'Previous'", () => {
    render(<Pagination {...defaultProps} currentPage={10} />);
    expect(screen.getByText("Next")).toBeDisabled();
    expect(screen.getByText("Previous")).not.toBeDisabled();
  });

  test("invokes onPageChange when page number or action buttons are clicked", () => {
    const onPageChangeMock = jest.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={onPageChangeMock}
      />
    );

    // Click Next
    fireEvent.click(screen.getByText("Next"));
    expect(onPageChangeMock).toHaveBeenCalledWith(4);

    // Click Previous
    fireEvent.click(screen.getByText("Previous"));
    expect(onPageChangeMock).toHaveBeenCalledWith(2);

    // Click Specific Page Number
    fireEvent.click(screen.getByText("5"));
    expect(onPageChangeMock).toHaveBeenCalledWith(5);
  });

  // 🐛 DEBUG CHALLENGE REPRODUCTION & FIX VERIFICATION
  describe("Debug Challenge: Ellipsis and Page Range Generation", () => {
    test("does not duplicate the last page number when near the end", () => {
      // Near end: page 22 out of 24 pages
      const result = generatePageNumbers(22, 24);
      
      // Should NOT result in [1, '...', 20, 21, 22, 23, 1]
      expect(result).toEqual([1, "...", 20, 21, 22, 23, 24]);
      
      // Ensure total count of appearance of 1 is exactly 1
      const countOfOne = result.filter((p) => p === 1).length;
      expect(countOfOne).toBe(1);
    });

    test("renders correctly without ellipsis for small total pages (<= 7)", () => {
      expect(generatePageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    test("renders right ellipsis when current page is near the start", () => {
      expect(generatePageNumbers(2, 10)).toEqual([1, 2, 3, 4, 5, "...", 10]);
    });

    test("renders both left and right ellipsis when current page is in the middle", () => {
      expect(generatePageNumbers(5, 10)).toEqual([
        1,
        "...",
        4,
        5,
        6,
        "...",
        10,
      ]);
    });
  });
});
