package com.example.comment_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CommentController {
    @GetMapping("/comments/")
    public String hello() {
        return "hello";
    }
}


