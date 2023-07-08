use diesel::{Queryable, Selectable};
use serde::{Deserialize, Serialize};
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(Deserialize, PostgresMapper, Serialize, Debug, Clone, Queryable, Selectable)]
#[diesel(table_name = crate::user_account::schema::user_accounts)]
#[pg_mapper(table = "user_accounts")]
pub struct UserAccount {
    pub email: String,
    pub username: String,
    pub first_name: String,
    pub last_name: String,
}
