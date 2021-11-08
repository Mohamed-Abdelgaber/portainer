package middlewares

import (
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_demoEnvironment_shouldFail(t *testing.T) {
	r := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{}`))
	w := httptest.NewRecorder()

	h := http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {})

	RestrictDemoEnv(true).Middleware(h).ServeHTTP(w, r)

	response := w.Result()
	assert.Equal(t, http.StatusBadRequest, response.StatusCode)

	body, _ := io.ReadAll(response.Body)
	assert.Contains(t, string(body), "This feature is not available in the demo version of Portainer")
}

func Test_notDemoEnvironment_shouldSucceed(t *testing.T) {
	r := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{}`))
	w := httptest.NewRecorder()

	h := http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {})

	RestrictDemoEnv(false).Middleware(h).ServeHTTP(w, r)

	response := w.Result()
	assert.Equal(t, http.StatusOK, response.StatusCode)

}
