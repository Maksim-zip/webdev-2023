package main

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"
	"strconv" // dobavil strconv, чтобы был Atoi

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

type indexPage struct {
	Title           string
	Subtitle        string
	FeaturedPosts   []featuredPostData
	MostRecentPosts []mostRecentPostData
}

type postData struct { //создал новую структтуру, для страницы поста
	Title    string `db:"title"`
	Subtitle string `db:"subtitle"`
	Text     string `db:"content"`
	Image    string `db:"image_url"`
}

type featuredPostData struct {
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	Author      string `db:"author"`
	AuthorImg   string `db:"author_url"`
	PublishDate string `db:"publish_date"`
	Image       string `db:"image_url"`
	ImgModifier string `db:"modifier"`
	Featured    string `db:"featured"`
	PostID      string `db:"post_id"`
}

type mostRecentPostData struct {
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	Author      string `db:"author"`
	AuthorImg   string `db:"author_url"`
	PublishDate string `db:"publish_date"`
	Image       string `db:"image_url"`
	Featured    string `db:"featured"`
	PostID      string `db:"post_id"`
}

func index(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) { //получаю все посты на странице
	return func(w http.ResponseWriter, r *http.Request) {
		featuredPostsData, err := featuredPosts(db) //ставлю фичер посты на их место
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		mostRecentPostsData, err := mostRecentPosts(db) //ставлю мост рисент посты на их место
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		ts, err := template.ParseFiles("pages/index.html") //получаю шаблон (template) в переменную ts
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		data := indexPage{ //контент для вставки в шаблон
			Title:           "Let's do it together",
			Subtitle:        "We travel the world in search of stories. Come along for the ride",
			FeaturedPosts:   featuredPostsData,
			MostRecentPosts: mostRecentPostsData,
		}

		err = ts.Execute(w, data) //заполняем шаблон данными и рендерим страницу, тут отображается страница. шаблон нужен чтобы менять динамические данные
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		log.Println("Request completed successfully")
	}
}

func post(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) { //функция для отображения единичного поста
	return func(w http.ResponseWriter, r *http.Request) {
		postIDStr := mux.Vars(r)["postID"]

		postID, err := strconv.Atoi(postIDStr) //это нужно чтобы поменять номер строки на integer
		if err != nil {
			http.Error(w, "Invalid post ID", 403) //при ошибке приходит ответ со статусом 403
			log.Println(err)                      //пишу, чтобы в теримнале писало ошибку
			return                                //заканчиваю функцию при пролучении ошибки (эти три строчки в каждой обработке ошибки)
		}

		post, err := postByID(db, postID) //вызываю функцю, чтобы забирать контент из бд для структуры postData
		if err != nil {
			if err == sql.ErrNoRows { //ошибка, если при запросе не выдало ни одной строки
				http.Error(w, "Post not found", 404)
				log.Println(err)
				return
			}

			http.Error(w, "Internal Sever Error", 500)
			log.Println(err)
			return
		}

		ts, err := template.ParseFiles("pages/post.html") //получаю шаблон (template) в переменную ts
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		err = ts.Execute(w, post) //заполняем шаблон данными и рендерим страницу, тут отображается страница.
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

func postByID(db *sqlx.DB, postID int) (postData, error) { //функця, чтобы забирать контент для структуры postData
	const query = `
		SELECT
			title,
			subtitle,
			content,
			image_url
		FROM
			post
		WHERE
			post_id = ? 
	` //подготоваил запрос, знак вопроса нужен чтобы защитаться от sql инъекций это связанная переменная

	var post postData //объявил пер. post типа postData

	err := db.Get(&post, query, postID) //контент (строка) из запроса выше помещаю в переменную &post
	if err != nil {                     //обрабатываю ошибку
		return postData{}, err
	}

	return post, nil //возвращаю собранный пост без ошибки
}

func featuredPosts(db *sqlx.DB) ([]featuredPostData, error) { //выбираю из бд все фичер посты
	const query = `
		SELECT
			title,
			subtitle,
			publish_date,
			author,
			author_url,
			image_url,
			modifier,
			post_id
		FROM
			post
		WHERE featured = 1
	`

	var posts []featuredPostData

	err := db.Select(&posts, query)
	if err != nil {
		return nil, err
	}

	return posts, nil
}

func mostRecentPosts(db *sqlx.DB) ([]mostRecentPostData, error) {
	const query = `
		SELECT
			title,
			subtitle,
			publish_date,
			author,
			author_url,
			image_url,
			post_id
		FROM
			post
		WHERE featured = 0
	`

	var posts []mostRecentPostData

	err := db.Select(&posts, query)
	if err != nil {
		return nil, err
	}

	return posts, nil
}

func login(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/login.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}

	err = ts.Execute(w, nil)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}
}

func admin(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/admin.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}

	err = ts.Execute(w, nil)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}
}
