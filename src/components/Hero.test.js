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

    it("shows instructions after 1s if no keys get pressed", () => {
        // Arrange
        const spy = jest.spyOn(instance, "showInGameInstructions");

        // Act

            // Wait 1s


        // Assert
        expect(spy).toHaveBeenCalled();
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

        it("moving updates 'untouched' state", () => {
            // Arrange
            // Act
            instance.handleKeypress({ key: " " });

            // Assert
            expect(instance.state.untouched).toBe(false);
        })
    })
});