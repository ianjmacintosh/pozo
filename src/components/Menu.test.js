import React from "react";
import { render } from "@testing-library/react";
import Menu from "./Menu";

test("renders Pozo title", () => {
  const { getByText } = render(<Menu />);
  const bigTitleHeadline = getByText(/Pozo/i);
  expect(bigTitleHeadline).toBeInTheDocument();
});
