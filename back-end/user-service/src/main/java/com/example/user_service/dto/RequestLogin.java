package com.example.user_service.dto;

import lombok.Data;

@Data
public class RequestLogin {
    private String email;
    private String password;
}