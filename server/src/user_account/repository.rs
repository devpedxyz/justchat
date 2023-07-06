use deadpool_postgres::Client;
use tokio_pg_mapper::FromTokioPostgresRow;

use super::errors::UserAccountError;
use super::models::UserAccount;

pub async fn add_user_account(
    client: &Client,
    user_info: UserAccount,
) -> Result<UserAccount, UserAccountError> {
    let stmt = include_str!("./sql/add_user_account.sql");
    let stmt = stmt.replace("$table_fields", &UserAccount::sql_table_fields());
    let stmt = client.prepare(&stmt).await.unwrap();

    client
        .query(
            &stmt,
            &[
                &user_info.email,
                &user_info.first_name,
                &user_info.last_name,
                &user_info.username,
            ],
        )
        .await?
        .iter()
        .map(|row| UserAccount::from_row_ref(row).unwrap())
        .collect::<Vec<UserAccount>>()
        .pop()
        .ok_or(UserAccountError::UserNotFound)
}
