import { SET_EMPTY_TODOS_STORE } from "../constants";

export default function setEmptyTodosAction(todos = []) {
  return {
    type: SET_EMPTY_TODOS_STORE,
    playload: todos,
  };
}
