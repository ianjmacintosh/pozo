| Statements                                                            | Branches                                                            | Functions                                                            | Lines                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-35.02%25-red.svg) | ![Branches](https://img.shields.io/badge/Coverage-17.44%25-red.svg) | ![Functions](https://img.shields.io/badge/Coverage-32.71%25-red.svg) | ![Lines](https://img.shields.io/badge/Coverage-34.81%25-red.svg) |

# Overview

Pozo is a clone of Zoop, the arcade puzzle game from 1995.

## Installation

Install all the dependencies

```bash
npm install
```

## Running Locally

```bash
npm start
```

## Playing

Navigate to http://localhost:3000/ in your web browser

---

# Developer Instructions

## Disclaimer

I used building this game as an opportunity to get experience building an application using React. As a result, there are probably a lot of things that someone starting a project like this with any experience would do differently. There are definitely things _I'd_ do differently. But what I wouldn't change is the way I got started: start building, follow a process to keep the work going forward, but don't spend hours considering architectural decisions without having enough context or understanding to make sense of them. Put another way: without experience, it's really hard to know a good decision from a bad one.

## Running Tests

```bash
npm test
```

I didn't write any tests for Pozo until the first public release was almost finished. I have some experience with Jest, so I started writing unit tests with Jest and Enzyme. Adapting what I knew to line up with React was a bit of a challenge, and my first tests seemed stilted; making a wrapper, then an instance, then calling methods within that instance and checking state seemed weird. Some articles I found along the way tried to persuade me to do things differently, and it seems like Kent C. Dodds's `testing-library` is much more popular. But I wanted to write unit tests the way I was used to, so I forced it.

https://www.vinta.com.br/blog/2019/testing-your-react-components-part-2/

https://medium.com/opendoor-labs/testing-react-components-with-jest-a7e8e4d312d8

https://medium.com/javascript-scene/unit-testing-react-components-aeda9a44aae2

https://willowtreeapps.com/ideas/best-practices-for-unit-testing-with-a-react-redux-approach

I refactored my code to follow more of a "pure functions" approach, which helped me uncover some bugs I didn't know I had. I was really suspicious when some of these seemed to "vanish" under closer inspection, specifically an issue with the closure from the timer to clearing ghosts eliminated any changes to that queue that happened while the ghosts were animating out. This article seemed very comprehensive but I wasn't able to follow it all the way through since the bugs disappeared:

https://dmitripavlutin.com/react-hooks-stale-closures/

There's still plenty more to test. The biggest architectural blunder I think I made was handling the field-queue structure in a way that makes it impossible for a single queue to update without needing React to re-render every field, queue, and item within each queue whenever ANY queue's contents change. I'm not sure exactly how to fix this issue, but probably the easiest first step would be to make a component soley responsible for holding all the fields and homebase -- right now the Board component is out of control.

The reason I added tests was to help me refactor safely, but there's still a ton of room for improvement when it comes to code coverage.

## Open Questions

As I was building the app, I had the idea to record whenever I ran into trouble or had a general React question.

Here they are:

- When should I define a routine on a child component vs App.js?
  Specifically, should I write strike routines to pass down strike handling from App to Field to Queue to Monster? Or should I handle it all in App?

  https://stackoverflow.com/questions/37949981/call-child-method-from-parent

- How should I store my CSS? Should I break it up into CSS files for each component?

- What's the right way to handle cases where I need to set state and immediately perform a task afterwards based on that state?

- Is it normal to have a ton of functions hanging off App.js? Seems bad

- What's the right way to handle keypresses to navigate through the menu vs move hero?

- The main menu state vs props seems weird -- managing menuOption vs a boolean in menuOptions?

- Approach for alert seems odd. Should I make a new alert window and get rid of it once it animates? Right now I'm removing a class once the animation has completed. Seems weird.

## Next Infrastructure Steps

- Follow a consistent approach for testing, improve code coverage
- Refactor away from the monolithic `fields` object in `<Board>`
- Normalize JS formatting (Prettier may help)
- Handle `<Alert>` and `<Menu>` instances more elegantly; use abstraction
- Continue decomposing application until functionality is evenly distributed throughout different components; aim for no components longer than 200 lines
