import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatusContainer } from "./StatusContainer";
test("renders StatusContainer", () => {
  render(<StatusContainer />);
  expect(screen.getByText("This is a status container")).toBeInTheDocument();
});
