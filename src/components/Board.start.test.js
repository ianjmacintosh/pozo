import React from 'react';
import { shallow } from 'enzyme';

import Board from "./Board";

describe("Board", () => {
    const wrapper = shallow(<Board
        playSound={jest.fn()}
        updateAlert={jest.fn()}
        showAlert={jest.fn()}
        changeMusic={jest.fn()}
        setStage={jest.fn()}/>),
        instance = wrapper.instance();

    describe("'start' method", () => {
        const subject = instance.start;

        it("exists", () => {
            expect(subject).not.toBeUndefined();
        })

        it("clears the scoreboard", () => {
            // Arrange
            // Set the score to 100
            wrapper.setState({ score: 100 });

            // Act
            // Start stage 0
            subject(1);

            // Assert
            // Confirm the scoreboard shows 0
            expect(wrapper.state("score")).toBe(0);
        })
    })
})
