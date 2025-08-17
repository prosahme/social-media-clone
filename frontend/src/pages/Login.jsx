import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login({ variables: { email, password } });
    const token = result.data.login.token;
    localStorage.setItem("token", token);
    alert("Login success! Token saved.");
  };

  return (
    <div>
      <h1>login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          login
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}
export default Login;
