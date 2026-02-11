package com.weblab.service;

import com.weblab.entity.User;
import com.weblab.exception.UserAlreadyExistsException;
import com.weblab.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("Вход: пользователь не найден [username={}]", username);
                    return new UsernameNotFoundException("Пользователь не найден: " + username);
                });
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    @Transactional
    public User registerUser(String username, String rawPassword) {
        if (userRepository.existsByUsername(username)) {
            log.warn("Регистрация: пользователь уже существует [username={}]", username);
            throw new UserAlreadyExistsException("Пользователь с таким логином уже существует");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user = userRepository.save(user);
        log.info("Регистрация: успешно создан пользователь [username={}]", username);
        return user;
    }
}
