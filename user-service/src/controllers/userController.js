export const registerUser = (call, callback) => {
  const { name, email, password } = call.request;

  // Simpan ke database (atau simulasi)
  const newUser = {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
  };

  callback(null, {
    message: "User registered successfully",
    user: newUser,
  });
};

export const loginUser = (call, callback) => {
  const { email, password } = call.request;

  // Simulasi login sukses
  callback(null, {
    message: "Login success",
    user: { id: 1, name: "Test User", email },
  });
};
