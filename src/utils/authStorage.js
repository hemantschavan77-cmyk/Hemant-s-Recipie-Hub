const USER_KEY = 'users';
const LOGGEDIN_KEY = 'loggedInUser';

export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save user:", error);
  }
};

export const getUsers = () => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to get users:", error);
    return [];
  }
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(LOGGEDIN_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const getLoggedInUser = () => {
  try {
    const stored = localStorage.getItem(LOGGEDIN_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to get logged in user:", error);
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(LOGGEDIN_KEY);
};
