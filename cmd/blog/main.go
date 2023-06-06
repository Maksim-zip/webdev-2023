package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql" //Расширение для работы с БД
	"github.com/jmoiron/sqlx"          //Расширение для использования select
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

	dbx := sqlx.NewDb(db, dbDriverName) //Распширяем функционал БД внутри GO

	mux := http.NewServeMux() //Распределяем функции по урлам
	mux.HandleFunc("/home", index(dbx))
	mux.HandleFunc("/post", post)

	// Реализуем отдачу статики
	mux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("./assets"))))

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
