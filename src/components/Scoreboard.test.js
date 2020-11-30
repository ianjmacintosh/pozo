import React from 'react';
import { render, screen } from '@testing-library/react'
import Scoreboard from "./Scoreboard";

render(<Scoreboard />);

const scoreboard = screen.getByTestId("high-score-display");

test("shows a high score component", () => {
    expect(scoreboard).toBeDefined();
});