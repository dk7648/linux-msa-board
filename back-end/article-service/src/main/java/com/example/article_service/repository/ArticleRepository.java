package com.example.article_service.repository;

import com.example.article_service.domain.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    // 최신순으로 전체 게시글 조회
    Page<Article> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // 특정 사용자의 게시글 조회 (최신순)
    Page<Article> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // 특정 사용자의 게시글 개수 조회
    Long countByUserId(Long userId);
}

