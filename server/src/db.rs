use actix_web::{HttpResponse, ResponseError};
use deadpool_postgres::PoolError;
use derive_more::{Display, From};
use thiserror::Error;
use tokio_pg_mapper::Error as PGMError;
use tokio_postgres::error::Error as PGError;

#[derive(Error, Display, From, Debug)]
pub enum DatabaseError {
    PGError(PGError),
    PGMError(PGMError),
    PoolError(PoolError),
}

impl ResponseError for DatabaseError {
    fn error_response(&self) -> HttpResponse {
        match *self {
            // DataaseError::NotFound => HttpResponse::NotFound().finish(),
            DatabaseError::PoolError(ref err) => {
                HttpResponse::InternalServerError().body(err.to_string())
            }
            _ => HttpResponse::InternalServerError().finish(),
        }
    }
}
