import React from "react";
import { shallow } from "enzyme";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Board from "./Board";

describe("Board", () => {
  const wrapper = shallow(
      <Board
        playSound={jest.fn()}
        updateAlert={jest.fn()}
        showAlert={jest.fn()}
        changeGameActive={jest.fn()}
      />
    ),
    instance = wrapper.instance();

  it("shows a link to ianjmacintosh.com homepage", () => {
    render(<Board isGameActive={true}></Board>);

    const personalSiteLink = screen.getByText("Ian J. MacIntosh");

    expect(personalSiteLink).toHaveAttribute(
      "href",
      "https://www.ianjmacintosh.com/"
    );
  });

  describe("'getStrikeResults' method", () => {
    const subject = instance.getStrikeResults;

    // Queues to experiment with:
    // Empty queue
    const sampleQueue0 = [],
      // A short queue
      sampleQueue1 = [
        { type: "monster", color: 1 },
        { type: "monster", color: 2 },
      ],
      // A longer queue
      sampleQueue2 = [
        { type: "monster", color: 1 },
        { type: "monster", color: 1 },
        { type: "monster", color: 1 },
      ],
      // A very short queue
      sampleQueue3 = [{ type: "monster", color: 1 }];

    it("is not undefined", () => {
      expect(subject).not.toBeUndefined();
    });

    it("returns an empty queue when given an empty queue", () => {
      expect(subject(sampleQueue0, 0)).toHaveLength(0);
    });

    describe("when called with a color that's different than the first item", () => {
      it("returns the same-length queue", () => {
        expect(subject(sampleQueue1, 0)).toHaveLength(2);
      });

      it("changes the first item's color to the strike color", () => {
        expect(subject(sampleQueue1, 0)[0].color).toBe(0);
      });
    });

    describe("when called with a color that's the same as the first item", () => {
      it("stays the same length", () => {
        expect(subject(sampleQueue1, 1)).toHaveLength(2);
      });

      it("has one ghost", () => {
        expect(
          subject(sampleQueue1, 1).filter((item) => item.type === "ghost")
        ).toHaveLength(1);
      });

      it("returns a list with the first monster's color updated to be the strike color", () => {
        expect(
          subject(sampleQueue1, 1).find((item) => item.type === "monster").color
        ).toBe(1);
      });

      it("does not change the reference it's given", () => {
        // Arrange
        // Make a deep copy of sample queue #3
        // NOTE: Lodash offers a safer approach, but this is OK for now
        // NOTE: Read more about this at https://blog.logrocket.com/methods-for-deep-cloning-objects-in-javascript/
        let safeQueueCopy = JSON.parse(JSON.stringify(sampleQueue1));

        // Act
        subject(safeQueueCopy, 1);

        // Assert
        expect(safeQueueCopy).toStrictEqual(sampleQueue1);
      });
    });

    describe("when called with a color that's the same color as all items", () => {
      it("stays the same length", () => {
        expect(subject(sampleQueue2, 1)).toHaveLength(3);
      });

      it("has three ghosts", () => {
        expect(
          subject(sampleQueue2, 1).filter((item) => item.type === "ghost")
        ).toHaveLength(3);
      });

      it("has zero monsters", () => {
        expect(
          subject(sampleQueue2, 1).filter((item) => item.type === "monster")
        ).toHaveLength(0);
      });
    });

    describe("when applying a color to a one item queue whose item is that color", () => {
      it("does not change the reference it's given", () => {
        // Arrange
        // Make a deep copy of sample queue #3
        // NOTE: Lodash offers a safer approach, but this is OK for now
        // NOTE: Read more about this at https://blog.logrocket.com/methods-for-deep-cloning-objects-in-javascript/
        let safeQueueCopy = JSON.parse(JSON.stringify(sampleQueue3));

        // Act
        subject(safeQueueCopy, 1);

        // Assert
        expect(safeQueueCopy).toStrictEqual(sampleQueue3);
      });
    });
  });

  describe("'handleStrikeCall' method", () => {
    const subject = instance.handleStrikeCall;

    it("is not undefined", () => {
      expect(subject).not.toBeUndefined();
    });

    it("calls 'getStrikeResults'", () => {
      // Arrange
      const spy = jest.spyOn(instance, "getStrikeResults");

      // Act
      subject("up", 0, 0);

      // Assert
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });

    it("calls 'reportElimination'", () => {
      // Arrange
      const spy = jest.spyOn(instance, "reportElimination");
      wrapper.setState({
        score: 0,
        streak: 0,
        fields: {
          up: {
            // Up and down queues will end the game when their length > 5
            queueLengthLimit: 5,
            queues: [
              [
                {
                  type: "monster",
                  color: 0,
                },
              ],
              [],
              [],
              [],
            ],
          },
          left: {
            // Left and right queues will end the game when their length > 8
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          right: {
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          down: {
            queueLengthLimit: 5,
            queues: [[], [], [], []],
          },
        },
      });

      // Act
      subject("up", 0, 0);

      // Assert
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });

    it("updates the score when eliminating one monster", () => {
      // Arrange
      const spy = jest.spyOn(instance, "reportElimination");
      wrapper.setState({
        score: 0,
        streak: 0,
        fields: {
          up: {
            // Up and down queues will end the game when their length > 5
            queueLengthLimit: 5,
            queues: [
              [
                {
                  type: "monster",
                  color: 0,
                },
              ],
              [],
              [],
              [],
            ],
          },
          left: {
            // Left and right queues will end the game when their length > 8
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          right: {
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          down: {
            queueLengthLimit: 5,
            queues: [[], [], [], []],
          },
        },
      });

      // Act
      subject("up", 0, 0);

      // Assert
      expect(wrapper.state("score")).toBe(100);

      spy.mockRestore();
    });

    it("updates the streak count when eliminating a monster", () => {
      // Arrange
      wrapper.setState({
        score: 0,
        streak: 0,
        fields: {
          up: {
            // Up and down queues will end the game when their length > 5
            queueLengthLimit: 5,
            queues: [
              [
                {
                  type: "monster",
                  color: 0,
                },
              ],
              [],
              [],
              [],
            ],
          },
          left: {
            // Left and right queues will end the game when their length > 8
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          right: {
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          down: {
            queueLengthLimit: 5,
            queues: [[], [], [], []],
          },
        },
      });

      // Act
      subject("up", 0, 0);

      // Assert
      expect(wrapper.state("streak")).toBe(1);
    });

    it("clears the streak when swapping colors with a monster", () => {
      // Arrange
      wrapper.setState({ streak: 1 });
      wrapper.setState({
        fields: {
          up: {
            // Up and down queues will end the game when their length > 5
            queueLengthLimit: 5,
            queues: [
              [
                {
                  type: "monster",
                  color: 0,
                },
              ],
              [],
              [],
              [],
            ],
          },
          left: {
            // Left and right queues will end the game when their length > 8
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          right: {
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          down: {
            queueLengthLimit: 5,
            queues: [[], [], [], []],
          },
        },
      });

      // Act
      subject("up", 0, 1);

      // Assert
      expect(wrapper.state("streak")).toBe(0);
    });

    it("clears the streak when swapping colors with a monster", () => {
      // Arrange
      wrapper.setState({ streak: 1 });
      wrapper.setState({
        fields: {
          up: {
            // Up and down queues will end the game when their length > 5
            queueLengthLimit: 5,
            queues: [
              [
                {
                  type: "monster",
                  color: 0,
                },
              ],
              [],
              [],
              [],
            ],
          },
          left: {
            // Left and right queues will end the game when their length > 8
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          right: {
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          down: {
            queueLengthLimit: 5,
            queues: [[], [], [], []],
          },
        },
      });

      // Act
      subject("up", 1, 1);

      // Assert
      expect(wrapper.state("streak")).toBe(1);
    });

    it("updates the score more when on a streak", () => {
      // Arrange
      wrapper.setState({
        streak: 0,
        score: 0,
      });

      wrapper.setState({
        fields: {
          up: {
            // Up and down queues will end the game when their length > 5
            queueLengthLimit: 5,
            queues: [
              [
                {
                  type: "monster",
                  color: 0,
                },
              ],
              [
                {
                  type: "monster",
                  color: 0,
                },
              ],
              [
                {
                  type: "monster",
                  color: 1,
                },
              ],
              [],
            ],
          },
          left: {
            // Left and right queues will end the game when their length > 8
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          right: {
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          down: {
            queueLengthLimit: 5,
            queues: [[], [], [], []],
          },
        },
      });

      // Act
      subject("up", 0, 0);
      subject("up", 1, 0);

      // Assert
      expect(wrapper.state("score")).toBe(300);
    });

    it("updates the ghosts scores appropriately", () => {
      // Arrange
      wrapper.setState({
        streak: 0,
        score: 0,
      });

      wrapper.setState({
        fields: {
          up: {
            // Up and down queues will end the game when their length > 5
            queueLengthLimit: 5,
            queues: [
              [
                {
                  type: "monster",
                  color: 0,
                },
                {
                  type: "monster",
                  color: 0,
                },
                {
                  type: "monster",
                  color: 0,
                },
              ],
              [
                {
                  type: "monster",
                  color: 0,
                },
              ],
              [
                {
                  type: "monster",
                  color: 1,
                },
              ],
              [],
            ],
          },
          left: {
            // Left and right queues will end the game when their length > 8
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          right: {
            queueLengthLimit: 8,
            queues: [[], [], [], []],
          },
          down: {
            queueLengthLimit: 5,
            queues: [[], [], [], []],
          },
        },
      });

      // Act
      subject("up", 0, 0);

      // Assert
      expect(wrapper.state("fields").up.queues[0]).toStrictEqual([
        {
          type: "ghost",
          content: 100,
        },
        {
          type: "ghost",
          content: 200,
        },
        {
          type: "ghost",
          content: 300,
        },
      ]);
    });
  });
});
