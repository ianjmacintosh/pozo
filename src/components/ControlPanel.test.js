import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import ControlPanel from "./ControlPanel";

describe("ControlPanel", () => {
    render(<ControlPanel />)

    it("has a sound effects toggle button", () => {
    // Arrange

      // Act
        const sfxToggleButton = screen.getByTestId("mute-toggleSfx")

      // Assert
      expect(sfxToggleButton).toBeInTheDocument()

    })

    it("has a music toggle button", () => {
    // Arrange

      // Act
        const musicToggleButton = screen.getByTestId("mute-toggleMusic")

      // Assert
      expect(musicToggleButton).toBeInTheDocument()

    })
});