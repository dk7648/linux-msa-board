package com.example.comment_service;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findAllByArticleId(Long id);

    List<Comment> findAllByAuthorId(Long id);
}
