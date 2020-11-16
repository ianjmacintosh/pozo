import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react'

import ControlPanel from "./ControlPanel";

describe("ControlPanel", () => {
    // Arrange
    render(<ControlPanel />)

    describe("sound effects toggle button", () => {
        it("exists", () => {
        // Act
    let sfxToggleButton = screen.getByTestId("mute-toggleSfx")

          // Assert
          expect(sfxToggleButton).toBeInTheDocument()
        })

        it("calls when toggleSfxMute when clicked", () => {
            // Arrange Enzyme test
            const mockedToggleSfxMute = jest.fn();
            const mockedToggleMusicMute = jest.fn();
            render(<ControlPanel
                toggleSfxMute={mockedToggleSfxMute}
                toggleMusicMute={mockedToggleMusicMute} />);

    let sfxToggleButton = screen.getByTestId("mute-toggleSfx")

      // Act
      // Click on sfx toggle button
      fireEvent.click(sfxToggleButton);

      // Assert
      // Confirm toggleMusicMute was called
                expect(mockedToggleSfxMute).toHaveBeenCalledTimes(1);
        })
    })

    it("has a sound effects toggle button", () => {
    // Arrange
    render(<ControlPanel />)
      // Act
        const sfxToggleButton = screen.getByTestId("mute-toggleSfx")

      // Assert
      expect(sfxToggleButton).toBeInTheDocument()

    })

    it("has a music toggle button", () => {
    // Arrange
    render(<ControlPanel />)
      // Act
        const musicToggleButton = screen.getByTestId("mute-toggleMusic")

      // Assert
      expect(musicToggleButton).toBeInTheDocument()

    })
});