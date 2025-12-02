package com.example.article_service.service;

import com.example.article_service.domain.Article;
import com.example.article_service.dto.ArticleCreateRequest;
import com.example.article_service.dto.ArticleResponse;
import com.example.article_service.exception.ArticleNotFoundException;
import com.example.article_service.exception.UnauthorizedException;
import com.example.article_service.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleService {

    private final ArticleRepository articleRepository;

    // 게시글 생성
    @Transactional
    public Long createArticle(Long userId, ArticleCreateRequest request) {
        Article article = Article.builder()
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .build();

        Article saved = articleRepository.save(article);
        log.info("게시글 생성 완료 - ID: {}, 작성자: {}", saved.getId(), userId);
        return saved.getId();
    }

    // 게시글 목록 조회
    public Page<ArticleResponse> getArticles(Pageable pageable) {
        return articleRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(ArticleResponse::from);
    }

    // 게시글 상세 조회 (조회수 증가)
    @Transactional
    public ArticleResponse getArticle(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleNotFoundException(articleId));

        article.incrementViewCount();
        log.info("게시글 조회 - ID: {}, 조회수: {}", articleId, article.getViewCount());

        return ArticleResponse.from(article);
    }

    // 게시글 수정
    @Transactional
    public void updateArticle(Long userId, Long articleId, ArticleCreateRequest request) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleNotFoundException(articleId));

        if (!article.getUserId().equals(userId)) {
            throw new UnauthorizedException("게시글 수정 권한이 없습니다");
        }

        article.update(request.getTitle(), request.getContent());
        log.info("게시글 수정 완료 - ID: {}", articleId);
    }

    // 게시글 삭제
    @Transactional
    public void deleteArticle(Long userId, Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleNotFoundException(articleId));

        if (!article.getUserId().equals(userId)) {
            throw new UnauthorizedException("게시글 삭제 권한이 없습니다");
        }

        articleRepository.delete(article);
        log.info("게시글 삭제 완료 - ID: {}", articleId);
    }
}

