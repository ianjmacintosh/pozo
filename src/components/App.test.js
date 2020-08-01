import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders Pozo title", () => {
  const { getByText } = render(<App />);
  const bigTitleHeadline = getByText(/Pozo/i);
  expect(bigTitleHeadline).toBeInTheDocument();
});
