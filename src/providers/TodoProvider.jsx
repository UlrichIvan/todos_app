import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { RGX_TODO_ID, TODOS_PAGE, TOKEN_NAME } from "../constants";
import NotFound from "../pages/NotFound";
import { getStorage } from "../storage";

function TodoProvider({ children }) {
  let user = getStorage(TOKEN_NAME);
  const { id } = useParams();
  const { pathname } = useLocation();

  if (
    `${TODOS_PAGE}/${id}` === pathname &&
    RGX_TODO_ID.test(id) &&
    user?.isauth
  )
    return <>{children}</>;
  else return <NotFound />;
}

export default TodoProvider;
