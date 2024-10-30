package com.ZioSet_WorkerConfiguration.controller;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontEndRoutingController {

    @RequestMapping(value = {
        "/", 
        "/Login", 
        "/agent",
        "agent/Category",
        "agent/Actions",
        "agent/CommandConfiguration"
     
    
    })
    public String index(HttpServletResponse response) {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "SAMEORIGIN");
        response.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://20.219.1.165:8085 http://20.219.1.165:8084; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: http:; frame-src 'self'; frame-ancestors 'none'; font-src 'self' https://fonts.gstatic.com; media-src 'self'; object-src 'none'; manifest-src 'self'; worker-src 'self'; form-action 'self';");
        return "forward:/index.html";
    }
}
