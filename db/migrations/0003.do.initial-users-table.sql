CREATE TABLE users(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255),
  email varchar(255),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  _google_auth_info jsonb
);

CREATE UNIQUE INDEX users_lower_email ON users(lower(email));

CREATE TRIGGER users_update_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
