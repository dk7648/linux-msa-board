package com.example.article_service.controller;

import com.example.article_service.dto.ArticleCreateRequest;
import com.example.article_service.dto.ArticleResponse;
import com.example.article_service.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    /**
     * 게시글 생성
     */
    @PostMapping
    public ResponseEntity<Long> createArticle(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody ArticleCreateRequest request) {
        log.info("게시글 생성 요청 - 사용자 ID: {}", userId);
        Long articleId = articleService.createArticle(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(articleId);
    }

    /**
     * 게시글 목록 조회 (페이징)
     */
    @GetMapping
    public ResponseEntity<Page<ArticleResponse>> getArticles(
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("게시글 목록 조회 - 페이지: {}, 사이즈: {}", pageable.getPageNumber(), pageable.getPageSize());
        Page<ArticleResponse> articles = articleService.getArticles(pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * 게시글 상세 조회 (조회수 증가)
     */
    @GetMapping("/{articleId}")
    public ResponseEntity<ArticleResponse> getArticle(@PathVariable Long articleId) {
        log.info("게시글 상세 조회 - ID: {}", articleId);
        ArticleResponse article = articleService.getArticle(articleId);
        return ResponseEntity.ok(article);
    }

    /**
     * 게시글 수정
     */
    @PutMapping("/{articleId}")
    public ResponseEntity<Void> updateArticle(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long articleId,
            @Valid @RequestBody ArticleCreateRequest request) {
        log.info("게시글 수정 요청 - ID: {}, 사용자 ID: {}", articleId, userId);
        articleService.updateArticle(userId, articleId, request);
        return ResponseEntity.ok().build();
    }

    /**
     * 게시글 삭제
     */
    @DeleteMapping("/{articleId}")
    public ResponseEntity<Void> deleteArticle(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long articleId) {
        log.info("게시글 삭제 요청 - ID: {}, 사용자 ID: {}", articleId, userId);
        articleService.deleteArticle(userId, articleId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 헬스 체크
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Article Service is running");
    }
}

