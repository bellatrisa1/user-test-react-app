import React, { useState, useEffect } from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { FixedSizeList as List } from "react-window";
import "./App.css";

const generateUsers = () =>
  Array.from({ length: 999999 }, (_, id) => ({
    id,
    name: `Пользователь ${id + 1}`,
    department: id % 2 === 0 ? "IT-отдел" : "Маркетинг",
    company: id % 3 === 0 ? "Apple Inc." : "Samsung Group",
    jobTitle: id % 2 === 0 ? "Frontend-разработчик" : "Менеджер",
    online: Math.random() > 0.5,
  }));

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: generateUsers(),
    selectedUser: null,
  },
  reducers: {
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) state.users[index] = action.payload;
    },
  },
});

const { selectUser, updateUser } = usersSlice.actions;
const store = configureStore({ reducer: usersSlice.reducer });

const UserList = () => {
  const users = useSelector((state) => state.users);
  const selectedUser = useSelector((state) => state.selectedUser);
  const dispatch = useDispatch();

  const Row = ({ index, style }) => (
    <div
      className={`user-item ${
        users[index].id === selectedUser?.id ? "selected" : ""
      }`}
      style={style}
      onClick={() => dispatch(selectUser(users[index]))}
    >
      <img
        src="../img/user-svgrepo-com (1).svg"
        alt="avatar"
        className="avatar"
      />
      <span>{users[index].name}</span>
    </div>
  );

  return (
    <div className="user-list">
      <List height={400} itemCount={users.length} itemSize={40} width={280}>
        {Row}
      </List>
    </div>
  );
};

const UserDetails = () => {
  const user = useSelector((state) => state.selectedUser);
  const dispatch = useDispatch();
  const [form, setForm] = useState(user || {});

  useEffect(() => {
    setForm(user || {});
  }, [user]);

  if (!user) return <div className="user-details">Выберите пользователя</div>;

  return (
    <div className="user-details">
      <div className="user-header">
        <img
          src="../img/icons8-пользователь-мужчина-в-кружке-50.png"
          alt="avatar"
          className="avatar-large"
        />
        <input
          className="user-name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <label>
        Должность
        <input
          value={form.jobTitle || ""}
          onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
        />
      </label>
      <label>
        Отдел
        <input
          value={form.department || ""}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        />
      </label>
      <label>
        Компания
        <input
          value={form.company || ""}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </label>
      <button onClick={() => dispatch(updateUser(form))}>Сохранить</button>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <div className="container">
      <UserList />
      <UserDetails />
    </div>
  </Provider>
);

export default App;
