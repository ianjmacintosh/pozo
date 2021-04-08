import React from "react";
import { shallow } from "enzyme";

import Board from "./Board";

describe("Board", () => {
  const mockedSetStage = jest.fn();
  const wrapper = shallow(
      <Board
        handleSound={jest.fn()}
        updateAlert={jest.fn()}
        showAlert={jest.fn()}
        setStage={mockedSetStage}
        changeGameActive={jest.fn()}
      />
    ),
    instance = wrapper.instance();

  describe("'endStage' method", () => {
    const subject = instance.endStage;

    it("exists", () => {
      expect(subject).not.toBeUndefined();
    });

    it("sets stage to 1 if the player lost", () => {
      // Arrange

      // Act
      subject(false);

      // Assert
      expect(mockedSetStage).toHaveBeenCalledWith(1);
    });
  });
});
