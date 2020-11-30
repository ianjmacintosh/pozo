import React from 'react';
import { render, screen } from '@testing-library/react'

import Scoreboard from "./Scoreboard";

test("updates the score when the prop updates", () => {
    const { rerender } = render(<Scoreboard score={0}/>);

    rerender(<Scoreboard score={1}/>)

    const currentScore = screen.getByTestId("current-score-display");

    expect(currentScore.textContent).toBe("1");
})

test("shows a high score component, which starts as 0", () => {
    render(<Scoreboard />);

    const highScore = screen.getByTestId("high-score-display");
    expect(highScore).toBeDefined();
    expect(highScore.textContent).toBe("0")
});

test("updates when the score is more than the high score", () => {
    const { rerender } = render(<Scoreboard score={0}/>);
    rerender(<Scoreboard score={5}/>);

    const highScore = screen.getByTestId("high-score-display");

    expect(highScore.textContent).toBe("5")
})

test("does not update when the score is less than the high score", () => {
    const { rerender } = render(<Scoreboard score={0}/>);
    rerender(<Scoreboard score={5}/>);
    const highScore = screen.getByTestId("high-score-display");
    expect(highScore).toHaveTextContent("5");

    rerender(<Scoreboard score={0}/>);
    expect(highScore.textContent).toBe("5")
})