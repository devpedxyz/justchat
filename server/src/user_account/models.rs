use serde::{Deserialize, Serialize};
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(Deserialize, PostgresMapper, Serialize)]
#[pg_mapper(table = "user_account")]
pub struct UserAccount {
    pub email: String,
    pub username: String,
    pub first_name: String,
    pub last_name: String,
}
