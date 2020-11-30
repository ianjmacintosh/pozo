import React from 'react';
import { render, screen } from '@testing-library/react'
import Scoreboard from "./Scoreboard";

let score = 0;
render(<Scoreboard score={score}/>);

const highScore = screen.getByTestId("high-score-display");

test("shows a high score component", () => {
    expect(highScore).toBeDefined();
});

test("starts as 0", () => {
    expect(highScore.textContent).toBe("0")
})