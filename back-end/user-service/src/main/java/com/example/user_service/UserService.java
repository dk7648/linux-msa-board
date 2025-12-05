package com.example.user_service;

import com.example.user_service.dto.UserDto;
import com.example.user_service.jpa.UserEntity;
import com.example.user_service.jpa.UserRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 생성자 주입 방식 (권장)
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 회원가입 메서드
    public UserDto createUser(UserDto userDto) {
        userDto.setUserId(UUID.randomUUID().toString());

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        
        // DTO -> Entity 변환
        UserEntity userEntity = mapper.map(userDto, UserEntity.class);
        
        // 비밀번호 암호화 후 설정
        userEntity.setEncryptedPassword(passwordEncoder.encode(userDto.getPassword()));
        
        // DB 저장
        userRepository.save(userEntity);

        // Entity -> DTO 반환
        return mapper.map(userEntity, UserDto.class);
    }

    // ID로 사용자 조회
    public UserDto getUserById(Long id) {
        UserEntity userEntity = userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        
        UserDto userDto = mapper.map(userEntity, UserDto.class);
        
        // name 값을 username과 fullName에도 설정
        userDto.setUsername(userEntity.getName());
        userDto.setFullName(userEntity.getName());
        
        return userDto;
    }

    // 로그인 인증용 메서드 (Spring Security에서 사용)
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByEmail(email);
        
        if (userEntity == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        return new User(userEntity.getEmail(), userEntity.getEncryptedPassword(),
                true, true, true, true, new ArrayList<>());
    }

    // 이메일로 사용자 정보 조회
    public UserDto getUserDetailsByEmail(String email) {
        UserEntity userEntity = userRepository.findByEmail(email);
        
        if (userEntity == null) {
            throw new UsernameNotFoundException(email);
        }

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        
        return mapper.map(userEntity, UserDto.class);
    }
    
    // 이메일로 사용자 ID 조회
    public Long getUserIdByEmail(String email) {
        UserEntity userEntity = userRepository.findByEmail(email);
        
        if (userEntity == null) {
            throw new UsernameNotFoundException(email);
        }
        
        return userEntity.getId();
    }
}
