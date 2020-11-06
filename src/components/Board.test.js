import React from 'react';
import { shallow } from 'enzyme';

import Board from "./Board";

describe("Board", () => {
    const wrapper = shallow(<Board
        playSound={jest.fn()}
        updateAlert={jest.fn()}
        showAlert={jest.fn()}
        changeGameActive={jest.fn()}/>),
        instance = wrapper.instance();

    describe("'getStrikeResults' method", () => {
        const subject = instance.getStrikeResults;

        // Queues to experiment with:
        // Empty queue
        const sampleQueue0 = [],

        // A short queue
            sampleQueue1 = [{"type":"monster","color":1},{"type":"monster","color":2}],

        // A longer queue
            sampleQueue2 = [{"type":"monster","color":1},{"type":"monster","color":1},{"type":"monster","color":1}],

        // A very short queue
            sampleQueue3 = [{type: "monster", color: 1}];

        it("exists", () => {
            expect(subject);
        })

        it("returns an empty queue when given an empty queue", () => {
            expect(subject(sampleQueue0, 0)).toHaveLength(0);
        })

        describe("when called with a color that's different than the first item", () => {
            it("returns the same-length queue", () => {
                expect(subject(sampleQueue1, 0)).toHaveLength(2);
            })

            it("changes the first item's color to the strike color", () => {
                expect(subject(sampleQueue1, 0)[0].color).toBe(0);
            })
        })

        describe("when called with a color that's the same as the first item", () => {
            it("stays the same length", () => {
                expect(subject(sampleQueue1, 1)).toHaveLength(2);
            })

            it("has one ghost", () => {
                expect(subject(sampleQueue1, 1).filter((item) => item.type === "ghost")).toHaveLength(1);
            })

            it("returns a list with the first monster's color updated to be the strike color", () => {
                expect(subject(sampleQueue1, 1).find((item) => item.type === "monster").color).toBe(1);
            })

            it("does not change the reference it's given", () => {
                // Arrange
                // Make a deep copy of sample queue #3
                // NOTE: Lodash offers a safer approach, but this is OK for now
                // NOTE: Read more about this at https://blog.logrocket.com/methods-for-deep-cloning-objects-in-javascript/
                let safeQueueCopy = JSON.parse(JSON.stringify(sampleQueue1));

                // Act
                subject(safeQueueCopy, 1);

                // Assert
                expect(safeQueueCopy).toStrictEqual(sampleQueue1)
            })
        })

        describe("when called with a color that's the same color as all items", () => {
            it("stays the same length", () => {
                expect(subject(sampleQueue2, 1)).toHaveLength(3);
            })

            it("has three ghosts", () => {
                expect(subject(sampleQueue2, 1).filter((item) => item.type === "ghost")).toHaveLength(3);
            })

            it("has zero monsters", () => {
                expect(subject(sampleQueue2, 1).filter((item) => item.type === "monster")).toHaveLength(0);
            })
        })

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
                expect(safeQueueCopy).toStrictEqual(sampleQueue3)
            })
        })
    })

    describe("'handleStrikeCall' method", () => {
        const subject = instance.handleStrikeCall;

        it("exists", () => {
            expect(subject).not.toBeUndefined();
        })

        it("calls 'getStrikeResults'", () => {
            // Arrange
            const spy = jest.spyOn(instance, "getStrikeResults");

            // Act
            subject("up", 0, 0);

            // Assert
            expect(spy).toHaveBeenCalled();

            spy.mockRestore();
        })

        it("calls 'reportElimination'", () => {
            // Arrange
            const spy = jest.spyOn(instance, "reportElimination");

            // Act
            subject("up", 0, 0);

            // Assert
            expect(spy).toHaveBeenCalled();

            spy.mockRestore();
        })

        it("updates the score when eliminating one monster", () => {
            // Arrange
            const spy = jest.spyOn(instance, "reportElimination");
            wrapper.setState({
                fields: {
                    up: {
                        // Up and down queues will end the game when their length > 5
                        queueLengthLimit: 5,
                        queues: [[
                            {
                                type: "monster",
                                color: 0
                            }
                        ], [], [], []],
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
                }
            });

            // Act
            subject("up", 0, 0);

            // Assert
            expect(wrapper.state("score")).toBe(100);

            spy.mockRestore();
        })
    })
})
