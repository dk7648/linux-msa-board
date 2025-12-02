package com.example.comment_service.dto;

import com.example.comment_service.Comment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommentResponse {
    private Long commentId;
    private Long authorId;
    private String content;
    private LocalDateTime createdAt;

    public CommentResponse(Comment comment) {
        this.commentId = comment.getId();
        this.authorId = comment.getAuthorId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
    }
}
