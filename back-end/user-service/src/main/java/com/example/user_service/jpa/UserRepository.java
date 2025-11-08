package com.example.user_service.jpa; // 1. 패키지 경로가 "jpa"여야 합니다.

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // (이 어노테이션은 생략해도 됩니다)
public interface UserRepository extends JpaRepository<UserEntity, Long> { // 2. <User>가 아닌 <UserEntity>
    
    // 3. 로그인 시 이메일로 회원을 찾기 위한 메서드
    UserEntity findByEmail(String email);
}