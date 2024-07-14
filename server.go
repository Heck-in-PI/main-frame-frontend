package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

func init() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	path := filepath.Join(h.staticPath, r.URL.Path)

	fi, err := os.Stat(path)
	if os.IsNotExist(err) || fi.IsDir() {

		if strings.Contains(r.URL.Path, "/modules") {

			if strings.Contains(r.URL.Path, "/wifi") {

				if strings.Contains(r.URL.Path, "/viewer") {

					http.ServeFile(w, r, filepath.Join(h.staticPath+"/assets/html", "viewer.html"))
					return
				}

				http.ServeFile(w, r, filepath.Join(h.staticPath+"/assets/html", "wifi.html"))
				return
			}

			http.ServeFile(w, r, filepath.Join(h.staticPath+"/assets/html", "module.html"))
			return
		}

		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	}

	if err != nil {

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

// Start service on port APP_PORT
func server() {

	router := mux.NewRouter()

	spa := spaHandler{staticPath: "fronti/v1", indexPath: "index.html"}
	router.PathPrefix("/").Handler(spa)

	appPort := os.Getenv("APP_PORT")
	if appPort == "" {
		log.Println("APP_PORT can't be empty, check .env")
		return
	}

	fmt.Println("...")
	log.Println("Server started listening on port :" + appPort)

	log.Fatal(http.ListenAndServe(":"+appPort, router))
}
