package cammossleague.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * Handles two things:
 *   1. The application root "/", which serves the React SPA's index.html.
 *   2. Spring's /error endpoint, where we forward 404s for non-API paths to
 *      the SPA so React Router can handle deep links (e.g. /teams/3 on a hard
 *      refresh). API 404s and all non-404 errors get a normal JSON response.
 *
 * In dev (no client/dist bundled into static/), GET / and SPA deep links will
 * 404 normally — the SPA is served by the Vite dev server on a different port.
 */
@Controller
public class HomeController implements ErrorController {

    private final boolean spaBundleAvailable =
        getClass().getClassLoader().getResource("static/index.html") != null;

    @RequestMapping("/")
    public Object root() {
        return spaBundleAvailable
            ? "forward:/index.html"
            : ResponseEntity.ok(Map.of(
                "message", "Cam Moss League API",
                "status", "running",
                "apiPrefix", "/api"));
    }

    @RequestMapping("/error")
    public Object handleError(HttpServletRequest request) {
        Object statusCode = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object originalUri = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        int status = statusCode instanceof Integer s ? s : 500;
        String uri = originalUri instanceof String u ? u : "";

        boolean isApiPath =
            uri.startsWith("/api/") || uri.startsWith("/actuator/")
            || uri.startsWith("/login/") || uri.startsWith("/oauth2/");

        if (status == HttpStatus.NOT_FOUND.value() && spaBundleAvailable && !isApiPath) {
            return "forward:/index.html";
        }

        return ResponseEntity.status(status).body(Map.of(
            "status", status,
            "error", HttpStatus.valueOf(status).getReasonPhrase(),
            "path", uri));
    }
}
