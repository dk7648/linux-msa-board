package com.example.comment_service.dto;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class CommentDto {
    private Long articleId;
    private Long authorId;
    private String content;
}