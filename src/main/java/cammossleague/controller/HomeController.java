package cammossleague.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // Forward any non-API, non-static path to the SPA's index.html so React Router
    // can handle client-side routes (e.g. /teams/3 on a hard refresh).
    @GetMapping(value = {
            "/",
            "/{path:[^\\.]*}",
            "/{path:^(?!api|actuator|h2-console|login|oauth2|error).*}/**"
    })
    public String forwardToSpa() {
        return "forward:/index.html";
    }
}
