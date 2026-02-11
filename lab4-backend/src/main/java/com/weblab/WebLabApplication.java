package com.weblab;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WebLabApplication {

    private static final Logger log = LoggerFactory.getLogger(WebLabApplication.class);

    public static void main(String[] args) {
        log.info("Starting WebLabApplication...");
        SpringApplication.run(WebLabApplication.class, args);
        log.info("WebLabApplication started. Static and SPA fallback from classpath:/static/");
    }
}
