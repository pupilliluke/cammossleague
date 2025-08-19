package cammossleague.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class HomeController {
    
    @GetMapping("/")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cam Moss League API");
        response.put("status", "running");
        response.put("apiPrefix", "/api");
        response.put("publicEndpoints", "/api/public/*");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/players")
    public String players() {
        return "players";
    }

}