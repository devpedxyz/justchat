use actix_web::{HttpResponse, ResponseError};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum UserAccountError {
    #[error("User could not be found")]
    UserNotFound,

    // #[error("User already exists")]
    // UserAlreadyExists,
    #[error("A database error occurred: {0}")]
    DatabaseError(#[from] tokio_postgres::Error),
}

impl ResponseError for UserAccountError {
    fn error_response(&self) -> HttpResponse {
        match *self {
            UserAccountError::UserNotFound => HttpResponse::NotFound().body(self.to_string()),
            // UserAccountError::UserAlreadyExists => HttpResponse::Conflict().body(self.to_string()),
            UserAccountError::DatabaseError(ref err) => {
                HttpResponse::InternalServerError().body(err.to_string())
            }
        }
    }
}
