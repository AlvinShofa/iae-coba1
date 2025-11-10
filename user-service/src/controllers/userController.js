export const registerUser = (call, callback) => {
  const { usernamename, email, password } = call.request;

  // Simpan ke database (atau simulasi)
  const newUser = {
    id: Math.floor(Math.random() * 1000),
    usernamename,
    email,
    password,
  };

  callback(null, {
    message: "User registered successfully",
    user: newUser,
  });
};

// export const loginUser = (call, callback) => {
//   const { username, password } = call.request;

//   // Simulasi login sukses
//   callback(null, {
//     message: "Login success",
//     user: { id: 1, name: "Test User", email },
//   });
// };
