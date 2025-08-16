require("dotenv").config();
console.log("Is JWT_SECRET defined?", !!process.env.JWT_SECRET);
console.log("JWT_SECRET value:", process.env.JWT_SECRET);

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./config/db");
const getUserFromToken = require("./middleware/auth");

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
      name: String!
      email: String!
    }

    type Post {
      id: ID!
      content: String!
      userId: ID!
      likes: Int!
      comments: Int!
      user: User!
      createdAt: String!
    }

    type Like {
      id: ID!
      postId: ID!
      userId: ID!
    }

    type Comment {
      id: ID!
      content: String!
      postId: ID!
      userId: ID!
      user: User!
      createdAt: String!
    }

    type AuthPayload {
      token: String!
      user: User!
    }
    
    type Query {
      users: [User]
      posts: [Post]
      comments(postId: ID!): [Comment]
    }

    type Mutation {
      createUser(name: String!, email: String!, password: String!): User!
      login(email: String!, password: String!): AuthPayload!
      createPost(content: String!): Post!
      likePost(postId: ID!): Like!
      createComment(postId: ID!, content: String!): Comment!
    }
`);

const root = {
  users: async (args, context) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
    const rows = await query(
      "SELECT id, name, email FROM users ORDER BY id DESC"
    );
    return rows;
  },

  posts: async () => {
    const rows = await query(
      "SELECT id, content, userId, createdAt FROM posts ORDER BY createdAt DESC"
    );

    // attach nested fields manually
    const postsWithRelations = await Promise.all(
      rows.map(async (post) => {
        const users = await query(
          "SELECT id, name, email FROM users WHERE id = ?",
          [post.userId]
        );
        const likes = await query(
          "SELECT COUNT(*) as count FROM likes WHERE postId = ?",
          [post.id]
        );
        const comments = await query(
          "SELECT COUNT(*) as count FROM comments WHERE postId = ?",
          [post.id]
        );
        return {
          ...post,
          user: users[0],
          likes: likes[0].count,
          comments: comments[0].count,
        };
      })
    );

    return postsWithRelations;
  },

  comments: async ({ postId }) => {
    const rows = await query(
      "SELECT id, content, postId, userId, createdAt FROM comments WHERE postId = ? ORDER BY createdAt DESC",
      [postId]
    );
    return rows;
  },

  createUser: async ({ name, email, password }) => {
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      throw new Error("name, email and password are required");
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

  login: async ({ email, password }) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error("Email and password are required");
    }

    const users = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [
      email,
    ]);
    if (!users.length) {
      throw new Error("Invalid email or password");
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  },

  createPost: async ({ content }, context) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }

    if (!content?.trim()) {
      throw new Error("Content is required");
    }

    const result = await query(
      "INSERT INTO posts (content, userId) VALUES (?, ?)",
      [content.trim(), context.user.userId]
    );

    return {
      id: result.insertId,
      content: content.trim(),
      userId: context.user.userId,
      createdAt: new Date().toISOString(),
    };
  },

  likePost: async ({ postId }, context) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }

    const userId = context.user.userId;

    const existingLike = await query(
      "SELECT id FROM likes WHERE postId = ? AND userId = ? LIMIT 1",
      [postId, userId]
    );

    if (existingLike.length) {
      throw new Error("Post already liked");
    }

    const result = await query(
      "INSERT INTO likes (postId, userId) VALUES (?, ?)",
      [postId, userId]
    );

    return {
      id: result.insertId,
      postId: postId,
      userId: userId,
    };
  },

  createComment: async ({ postId, content }, context) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }

    if (!content?.trim()) {
      throw new Error("Comment content is required");
    }

    const result = await query(
      "INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)",
      [postId, context.user.userId, content.trim()]
    );

    return {
      id: result.insertId,
      postId: postId,
      userId: context.user.userId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
  },
};

app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: {
      user: getUserFromToken(req),
    },
  }))
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT|| ${PORT}`));
