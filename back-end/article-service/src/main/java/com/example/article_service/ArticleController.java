package com.example.article_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ArticleController {
    @GetMapping("/articles/")
    public String hello() {
        return "hello";
    }
}
