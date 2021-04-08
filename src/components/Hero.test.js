import React from "react";
import { shallow } from "enzyme";

import Hero from "./Hero";

describe("Hero", () => {
  const mockedShowAlert = jest.fn(),
    wrapper = shallow(
      <Hero
        showAlert={mockedShowAlert}
        canMove={true}
        handleSound={jest.fn()}
        handleStrikeCall={jest.fn()}
        // color={this.state.heroColor}
        // longQueueSize={this.props.longQueueSize}
        // shortQueueSize={this.props.shortQueueSize}
      />
    ),
    instance = wrapper.instance();

  it("sets a timeout", () => {
    // Arrange
    jest.useFakeTimers();

    // Act
    shallow(<Hero showAlert={mockedShowAlert} />);

    // Assert
    expect(setTimeout).toHaveBeenCalledTimes(1);
    jest.clearAllTimers();
  });

  it("calls showAlert after a second if no button's pushed", () => {
    const mockedShowAlert = jest.fn();

    // Arrange
    jest.useFakeTimers();
    // Mount the component
    shallow(<Hero canMove={true} showAlert={mockedShowAlert} />);

    // Act
    // Wait a second
    jest.runAllTimers();

    // Assert
    // Confirm showAlert done gots called
    expect(mockedShowAlert).toHaveBeenCalled();
  });

  it("doesn't call showAlert after a second if a button's been pushed", () => {
    const mockedShowAlert = jest.fn();

    // Arrange
    jest.useFakeTimers();
    // Mount the component
    let thisInstance = shallow(
      <Hero
        showAlert={mockedShowAlert}
        canMove={true}
        handleSound={jest.fn()}
        handleStrikeCall={jest.fn()}
      />
    ).instance();

    // Act
    // Wait a second
    thisInstance.handleKeypress({ key: " " });
    jest.runAllTimers();

    // Assert
    // Confirm showAlert done gots called
    expect(mockedShowAlert).not.toHaveBeenCalled();
  });

  describe("'showInGameInstructions' method", () => {
    const subject = instance.showInGameInstructions;

    it("is not undefined", () => {
      expect(subject).not.toBeUndefined();
    });

    it("calls 'showAlert'", () => {
      // Act
      subject();

      // Assert
      expect(mockedShowAlert).toHaveBeenCalled();
    });
  });

  describe("handleKeypress", () => {
    it("updates 'untouched' state when given a key", () => {
      // Arrange
      // Act
      instance.handleKeypress({ key: " " });

      // Assert
      expect(instance.state.untouched).toBe(false);
    });
  });
});
