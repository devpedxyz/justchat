INSERT INTO testing.user_account (email, first_name, last_name, username)
VALUES ($1, $2, $3, $4)
RETURNING $table_fields;
