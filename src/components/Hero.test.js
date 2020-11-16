import React from 'react';
import { shallow } from 'enzyme';

import Hero from "./Hero";

describe("Hero", () => {
    const wrapper = shallow(<Hero
        // color={this.state.heroColor}
        // canMove={this.props.isGameActive}
        // playSound={this.props.playSound}
        // longQueueSize={this.props.longQueueSize}
        // shortQueueSize={this.props.shortQueueSize}
        // handleStrikeCall={this.handleStrikeCall}
    />),
        instance = wrapper.instance();

    describe("'showInGameInstructions' method", () => {
        const subject = instance.showInGameInstructions;

        it("is not undefined", () => {
            expect(subject).not.toBeUndefined();
        })
    })
});