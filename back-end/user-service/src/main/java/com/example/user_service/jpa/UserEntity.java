package com.example.user_service.jpa; // 1. jpa 패키지 안에 생성

import jakarta.persistence.*; // 2. jakarta.persistence (Spring Boot 3)
import lombok.Data;

@Data // Lombok: @Getter, @Setter, @ToString 등 자동 생성
@Entity // 3. 이 클래스가 엔티티임을 선언
@Table(name = "users") // 4. DB에 "users"라는 테이블 이름으로 생성됨
public class UserEntity {

    @Id // 5. 기본 키(PK)임을 선언
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 6. DB에서 값 자동 증가 (auto-increment)
    private Long id; // DB 내부에서 쓰는 숫자 ID

    @Column(nullable = false, length = 50, unique = true) // 7. null 불가, 길이 50, 유니크
    private String email;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true) // 8. 유니크
    private String userId; // 외부에 노출되는 유니크 ID (UUID)

    @Column(nullable = false)
    private String encryptedPassword; // 9. 암호화된 비밀번호 저장
}