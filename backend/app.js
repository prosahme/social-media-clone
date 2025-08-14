require("dotenv").config();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

const schema = buildSchema(`
    type User {
    id: ID!
    name:String!
    email:String!
    
    }
    
    type Query {
    users: [User]
    }

    type Mutation {
      createUser(name: String!, email: String! , password: String!): User!
    }
    `);

const root = {
  users: async () => {
    const rows = await query(
      "SELECT id,name,email FROM users ORDER BY id DESC"
    );
    return rows;
  },

  createUser: async ({ name, email, password }) => {
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      throw new Error("name , email and password are required");
    }

    const existing = await query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length) {
      throw new Error("Email already in use");
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await query(
      "INSERT INTO users (name, email, password) VALUES(?, ?, ?)",
      [name.trim(), email.trim(), hashed]
    );

    return { id: result.insertId, name: name.trim(), email: email.trim() };
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
