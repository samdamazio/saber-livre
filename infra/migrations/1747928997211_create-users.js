const { createTable } = require("node-pg-migrate/dist/operations/tables");

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // For reference, Github uses 39 characters for the username
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
  });
};

exports.down = false;
