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
    // For reference, 254 is the maximum length of an email address: https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // For reference, 72 character is the maximum length for a bcrypt generated password hash https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length/39851#39851
    password: {
      type: "varchar(72)",
      notNull: true,
    },
    // For reference, why timestamp with timezone: https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;
