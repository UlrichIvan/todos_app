import axios from "axios";
import { BASE_URL } from "../constants";

// USERS SERVICES
export const login = async ({ name }) => {
  try {
    let res = await axios.get(BASE_URL + "/users", {
      params: { name },
    });

    if (res.data.length === 1) {
      let { islogged } = await updateUser(res.data[0]);
      return {
        islogged,
        id: res.data[0].id,
      };
    } else return false;
  } catch (err) {
    console.log(err.message);
  }
};
export const updateUser = async ({ name, id, todos = [] }) => {
  try {
    let res = await axios.put(`${BASE_URL}/users/${id}`, {
      name: name,
      isauth: true,
      id,
      todos,
    });

    return { islogged: res.status === 200 };
  } catch (error) {
    throw new Error(error.message);
  }
};
export const createUser = async (user) => {
  try {
    let res = await axios.get(BASE_URL + "/users", {
      params: { name: user?.name },
    });

    // if user already exists
    if (res.data?.length) {
      return {
        exists: true,
      };
    } else {
      // save user in database
      return await axios.post(BASE_URL + "/users", { ...user });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
export const logOut = async (user, cb) => {
  try {
    let user_client = await axios
      .get(`${BASE_URL}/users/${user.id}`)
      .then((res) => res.data);

    if (user_client) {
      let res = await axios.patch(`${BASE_URL}/users/${user.id}`, {
        ...user_client,
        isauth: false,
      });
      if (res.status === 200) cb();
    } else {
      cb();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// TODOS SERVICES
export const addTodo = async (user, todo, cb) => {
  try {
    // get all todos from user
    let { todos } = await axios
      .get(`${BASE_URL}/users/${user.id}`)
      .then((res) => res.data);

    let res = await axios.patch(`${BASE_URL}/users/${user.id}`, {
      ...user,
      todos: [...todos, todo],
    });

    if (res.status === 200) cb(todo);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteTodo = async (user, todo, cb) => {
  try {
    let user_client = await axios
      .get(`${BASE_URL}/users/${user.id}`)
      .then((res) => res.data);

    let newTodos = user_client.todos.filter((td) => td.id !== todo.id);

    let res = await axios.patch(`${BASE_URL}/users/${user.id}`, {
      ...user_client,
      todos: newTodos,
    });

    if (res.status === 200) cb(todo);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateTodo = async (user, todo, cb) => {
  try {
    let user_client = await axios
      .get(`${BASE_URL}/users/${user.id}`)
      .then((res) => res.data);

    let todoIndex = user_client.todos.findIndex((td) => td.id === todo.id);

    if (todoIndex !== -1) {
      user_client.todos[todoIndex].completed = !todo.completed;

      let res = await axios.patch(`${BASE_URL}/users/${user.id}`, {
        ...user_client,
      });

      if (res.status === 200) cb(todo);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTodo = async (user, todoId) => {
  try {
    let user_client = await axios
      .get(`${BASE_URL}/users/${user.id}`)
      .then((res) => res.data);

    return user_client.todos.find((td) => td.id === todoId);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTodos = async (user, cb) => {
  try {
    let _user = await axios
      .get(`${BASE_URL}/users/${user.id}`)
      .then((res) => res.data);

    cb(_user.todos);
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
