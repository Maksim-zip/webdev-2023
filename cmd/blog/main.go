package main

//вызывается при запуске скрипта (go run ...)
//показвает какие обрабочтики (handlers) используются при действиях на страницер

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql" //Расширение для работы с БД
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx" //Расширение для использования select
)

const (
	port         = ":3000"
	dbDriverName = "mysql"
)

func main() {
	db, err := openDB()
	if err != nil {
		log.Fatal(err)
	}

	dbx := sqlx.NewDb(db, dbDriverName) //Расширяем функционал БД внутри GO

	mux := mux.NewRouter() //заменил NewServMux на NewRouter и библиотеку http на mux
	mux.HandleFunc("/home", index(dbx))
	mux.HandleFunc("/post/{postID}", post(dbx)) //обрабатываю теперь не по посту, а по пост id

	// Реализуем отдачу статики
	mux.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", http.FileServer(http.Dir("./assets/"))))

	log.Println("Start server " + port)
	err = http.ListenAndServe(port, mux)
	if err != nil {
		log.Fatal(err)
	}
}

// Соединяемся с БД
func openDB() (*sql.DB, error) {
	return sql.Open(dbDriverName, "root:1234567890@tcp(localhost:3306)/blog?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true")
}
