-- 기존 article_db 스키마 삭제 (있다면)
DROP DATABASE IF EXISTS article_db;

-- Article Service 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS ARTICLE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ARTICLE;

-- Articles 테이블 (JPA가 자동 생성하지만 수동 생성도 가능)
CREATE TABLE IF NOT EXISTS articles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '작성자 ID (user-service 참조)',
    title VARCHAR(100) NOT NULL COMMENT '게시글 제목',
    content VARCHAR(2000) NOT NULL COMMENT '게시글 내용',
    view_count INT NOT NULL DEFAULT 0 COMMENT '조회수',
    created_at DATETIME(6) NOT NULL COMMENT '생성일시',
    updated_at DATETIME(6) NOT NULL COMMENT '수정일시',
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='게시글 테이블';

