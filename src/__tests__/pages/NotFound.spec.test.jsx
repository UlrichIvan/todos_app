import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFound from "../../pages/NotFound";
import { HOME_PAGE, NOT_FOUND } from "../../constants";
import SignIn from "../../pages/signin/SignIn";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

describe("NotFound.jsx", () => {
  let user;
  const renderElement = () => {
    const document = render(
      <Router>
        <Routes>
          <Route path={HOME_PAGE} element={<SignIn />} />
          <Route path={NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Router>
    );
    user = userEvent.setup();

    return document;
  };

  it("Not found page loaded successfully", async () => {
    history.pushState({}, "", "/arcticles");
    renderElement();
    let element = await screen.findByText(/Page Not Found/i);
    expect(element).toBeInTheDocument();
  });

  it("Go to home page", async () => {
    history.pushState({}, "", "/arcticles");
    renderElement();

    await user.click(await screen.findByTestId("home-page"));
    expect(await screen.findByText(/signin/i)).toBeInTheDocument();
  });
});
