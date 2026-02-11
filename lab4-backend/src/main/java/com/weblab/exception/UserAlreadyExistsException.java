package com.weblab.exception;

/**
 * Выбрасывается при попытке регистрации с уже существующим логином.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
