import React from 'react';
import { shallow } from 'enzyme';

import Board from "./Board";

describe("Board", () => {
    const wrapper = shallow(<Board />),
        instance = wrapper.instance();

    describe("'strike' method", () => {
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
})
