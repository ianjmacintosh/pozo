import React from 'react';
import { shallow } from 'enzyme';

import Hero from "./Hero";

describe("Hero", () => {
    const mockedShowAlert = jest.fn(),
        wrapper = shallow(<Hero
            showAlert={mockedShowAlert}
            canMove={true}
            playSound={jest.fn()}
            handleStrikeCall={jest.fn()}
        // color={this.state.heroColor}
        // longQueueSize={this.props.longQueueSize}
        // shortQueueSize={this.props.shortQueueSize}
    />),
        instance = wrapper.instance();


        it("sets a timeout", () => {
            // Arrange
            jest.useFakeTimers();

        // Act

            // Wait 1s
        shallow(<Hero />);

        // Assert
        expect(setTimeout).toHaveBeenCalledTimes(1);
    })

    describe("'showInGameInstructions' method", () => {
        const subject = instance.showInGameInstructions;

        it("is not undefined", () => {
            expect(subject).not.toBeUndefined();
        })

        it("calls 'showAlert'", () => {
            // Act
            subject();

            // Assert
            expect(mockedShowAlert).toHaveBeenCalled();
        })
    })

    describe("handleKeypress", () => {
        it("updates 'untouched' state when given a key", () => {
            // Arrange
            // Act
            instance.handleKeypress({ key: " " });

            // Assert
            expect(instance.state.untouched).toBe(false);
        })
    })
});