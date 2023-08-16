import { Link, useParams } from "react-router-dom";
import { getTodo } from "../../services/api.services";
import produce from "immer";
import { useState, useEffect } from "react";
import { TODOS_PAGE, TOKEN_NAME } from "../../constants";
import { getStorage } from "../../storage";
const AboutTodo = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const user = getStorage(TOKEN_NAME);

  useEffect(() => {
    (async () => {
      let td = await getTodo(user, id);
      setTodo(
        produce({}, (draft) => {
          draft.id = td.id;
          draft.name = td.name;
          draft.completed = td.completed;
          draft.at = td.at;
        })
      );
    })();
  }, [id, user]);

  return (
    <div className="todo_details">
      <div className="container mt-4">
        {todo && (
          <div className="todo-details bg-dark p-2 d-flex align-items-center justify-content-between">
            <div className="todo-name text-capitalize text-white">
              Todo name: {todo.name}
              {", "}
              {todo?.at
                ? `created on ${new Date(todo?.at).toDateString("en-US", {
                    hour12: false,
                  })}`
                : ""}
            </div>
            <div className="todo-status">
              <div className="input-group ml-2" style={{ height: "40px" }}>
                <div className={`input-group-prepend`}>
                  <div
                    className={`input-group-text text-white text-capitalize ${
                      todo.completed ? "bg-success" : "bg-danger"
                    }`}
                  >
                    completed:{todo.completed ? "ok" : "not yet"}
                  </div>
                </div>
                <Link to={`${TODOS_PAGE}`}>
                  <span className="btn ml-2 btn-outline-info text-capitalize">
                    all todos
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutTodo;
