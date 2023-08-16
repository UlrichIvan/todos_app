import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { reducers } from "../../store";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";

import Todos from "../../pages/todos/Todos";
import SignIn from "../../pages/signin/SignIn";
import AboutTodo from "../../pages/todos/AboutTodo";
import { act } from "react-dom/test-utils";

const store = configureStore({
  reducer: { ...reducers },
});

jest.mock("axios", () => {
  return {
    get: () =>
      Promise.resolve({
        data: {
          name: "michel",
          isauth: false,
          id: "da62ff55-c8e7-4f87-aea3-e26bed23904e",
          todos: [
            {
              id: "c07bf570-4983-447f-bfff-262e4b6112da",
              name: "infos",
              completed: true,
            },
            {
              id: "e2e71a56-b545-4764-8438-013737020de4",
              name: "maths",
              completed: false,
            },
          ],
        },
      }),
    patch: () =>
      Promise.resolve({
        status: 200,
      }),
    delete: () =>
      Promise.resolve({
        status: 200,
      }),
  };
});

jest.mock("../../storage", () => {
  return {
    getStorage: () => ({
      isauth: false,
      id: "da62ff55-c8e7-4f87-aea3-e26bed23904e",
    }),
    removeStorage: () => {},
  };
});

describe("Todo.jsx", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    window.history.pushState({}, "", "/todos");
  });

  let MockTodosComponent = () => {
    return (
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/todos/:id" element={<AboutTodo />} />
          </Routes>
        </Router>
      </Provider>
    );
  };

  it("FormTodo should be mounted", async () => {
    await act(async () => {
      render(<MockTodosComponent />);
    });
    expect(screen.getByTestId("todos")).toBeInTheDocument();
    // screen.debug()
  });

  it("Todo should be in document", async () => {
    await act(async () => {
      render(<MockTodosComponent />);
    });
    expect((await screen.findAllByTestId("todo")).length).toBeGreaterThan(0);
    // screen.debug()
  });

  it("Add todo in document", async () => {
    await act(async () => {
      render(<MockTodosComponent />);
    });

    let input = screen.getByPlaceholderText(/enter todo name.../i);

    await act(async () => {
      fireEvent.change(input, { target: { value: "treading" } });
    });
    let formElement = screen.getByTestId("submit");
    let todosBefore = await screen.findAllByTestId("todo");

    await act(async () => {
      fireEvent.submit(formElement);
    });
    let todosAfter = await screen.findAllByTestId("todo");

    expect(todosAfter.length).toEqual(todosBefore.length + 1);
    // screen.debug()
  });

  it("Remove todo in document", async () => {
    await act(async () => {
      render(<MockTodosComponent />);
    });

    let todosBeforeRemoved = screen.getAllByText(/remove/i);

    await act(async () => {
      fireEvent.click(todosBeforeRemoved[0]);
    });

    let todosAfterRemoved = await screen.findAllByText(/remove/i);

    expect(todosBeforeRemoved.length).toEqual(todosAfterRemoved.length + 1);
    // screen.debug()
  });

  it("about todo ", async () => {
    await act(async () => {
      render(<MockTodosComponent />);
    });

    let todosBeforeAbout = screen.getAllByText(/about/i);

    fireEvent.click(todosBeforeAbout[0]);

    let spanElement = await screen.findByText(/Todo name/i);

    expect(spanElement).toBeInTheDocument();
    // screen.debug()
  });

  it("logout user ", async () => {
    await act(async () => {
      render(<MockTodosComponent />);
    });

    let logout = screen.getByText(/logout/i);

    fireEvent.click(logout);

    let spanElement = await screen.findByText(/Sign In/i);

    expect(spanElement).toBeInTheDocument();
    // screen.debug();
  });

  it("checked input ", async () => {
    await act(async () => {
      render(<MockTodosComponent />);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("checkbox success"));
    });

    expect(screen.queryByTestId("checkbox success")).toBeNull();
    // screen.debug();
  });
});
