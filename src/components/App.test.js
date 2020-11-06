import React from 'react';
import { shallow } from 'enzyme';

import App from "./App";

describe("App", () => {
  const wrapper = shallow(<App />),
    instance = wrapper.instance();

  describe("'setStage' method", () => {
    const subject = instance.setStage;

    it("exists", () => {
      expect(subject).not.toBeUndefined();
    })

    it("updates the app div's class when game is active", () => {
      // Arrange
      wrapper.setState({
        gameActive: true,
        stage: 0
      })
      expect(wrapper.find(".App").hasClass("stage1")).toBe(false);

      // Act
      subject(1);

      // Assert
      expect(wrapper.find(".App").hasClass("stage1")).toBe(true);
    })
  })
});