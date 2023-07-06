use actix_web::{web, Error, HttpResponse};
use deadpool_postgres::{Client, Pool};

use crate::db::DatabaseError;

use super::{models::UserAccount, repository};

pub async fn add_user_account(
    user: web::Json<UserAccount>,
    db_pool: web::Data<Pool>,
) -> Result<HttpResponse, Error> {
    let user_info: UserAccount = user.into_inner();
    let client: Client = db_pool.get().await.map_err(DatabaseError::PoolError)?;
    let new_user = repository::add_user_account(&client, user_info).await?;

    Ok(HttpResponse::Ok().json(new_user))
}
