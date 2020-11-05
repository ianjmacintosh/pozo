import React from 'react';
import { shallow } from 'enzyme';

import Board from "./Board";

describe("Board", () => {
    const wrapper = shallow(<Board />),
        instance = wrapper.instance(),
        subject = instance.getStrikeResults;

    describe("'strike' method", () => {
        // Queues to experiment with:
        // Empty queue
        const sampleQueue0 = [];

        // A short queue
        const sampleQueue1 = [{"type":"monster","color":1},{"type":"monster","color":2}];

        // A longer queue
        const sampleQueue2 = [{"type":"monster","color":1},{"type":"monster","color":1},{"type":"monster","color":1}];

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
            it("loses an item", () => {
                expect(subject(sampleQueue1, 1)).toHaveLength(1);
            })

            it("gets its second item's color changed to the strike color", () => {
                expect(subject(sampleQueue1, 1)[0].color).toBe(1);
            })
        })

        describe("when called with a color that's the same color as all items", () => {
            it("clears the queue", () => {
                expect(subject(sampleQueue2, 1)).toHaveLength(0);
            })
        })
    })
})
