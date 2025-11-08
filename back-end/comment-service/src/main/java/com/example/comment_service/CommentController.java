package com.example.comment_service;

import com.example.comment_service.dto.CommentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class CommentController {
    private final CommentRepository commentRepository;
    @GetMapping("/comments/")
    public String hello() {
        int i = commentRepository.findAll().size();
        return "hello, my total size is " + i;
    }

    @GetMapping("/comments/list")
    ResponseEntity<List<Comment>> getCommentsAll() {
        List<Comment> result = commentRepository.findAll();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/comments/{id}")
    ResponseEntity<Optional<Comment>> getCommentsById(@PathVariable Long id) {
        Optional<Comment> result = commentRepository.findById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/comments/article/{id}")
    ResponseEntity<List<Comment>> getCommentsByArticle(@PathVariable Long id) {
        List<Comment> result = commentRepository.findAllByArticleId(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/comments/user/{id}")
    ResponseEntity<List<Comment>> getCommentsByUser(@PathVariable Long id) {
        List<Comment> result = commentRepository.findAllByAuthorId(id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/comments/")
    public ResponseEntity<Comment> write(@RequestBody CommentDto commentDto) {
        Comment comment = new Comment();
        comment.setArticleId(commentDto.getArticleId());
        comment.setAuthorId(commentDto.getAuthorId());
        comment.setContent(commentDto.getContent());
        commentRepository.save(comment);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}


