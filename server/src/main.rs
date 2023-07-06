mod config;
mod db;
mod user_account;

use crate::config::AppConfig;
use ::config::Config;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use tokio_postgres::NoTls;
use user_account::handlers::add_user_account;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(body_string: String) -> impl Responder {
    HttpResponse::Ok().body(body_string)
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let _config = Config::builder()
        .add_source(::config::Environment::default())
        .build()
        .unwrap();
    let config: AppConfig = _config.try_deserialize().unwrap();
    let db_pool = config.pg.create_pool(None, NoTls).unwrap();
    let server = HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db_pool.clone()))
            .service(web::resource("/user-accounts").route(web::post().to(add_user_account)))
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(config.server_addr.clone())?
    .run();

    println!("Server running at http://{}/", config.server_addr);

    server.await
}
