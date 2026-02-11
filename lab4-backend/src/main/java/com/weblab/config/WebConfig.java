package com.weblab.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Конфигурация веб-слоя: раздача статики и SPA fallback.
 * Все неизвестные пути (/, /login, /main и т.д.) отдают index.html.
 */
// @Configuration
// public class WebConfig implements WebMvcConfigurer {

//     private static final Logger log = LoggerFactory.getLogger(WebConfig.class);

//     @Override
//     public void addResourceHandlers(ResourceHandlerRegistry registry) {
//         log.info("Registering resource handler: /** -> classpath:/static/ with index.html fallback");
//         registry.addResourceHandler("/**")
//                 .addResourceLocations("classpath:/static/")
//                 .resourceChain(true)
//                 .addResolver(new PathResourceResolver() {
//                     @Override
//                     protected Resource getResource(String resourcePath, Resource location) throws IOException {
//                         Resource resource = location.createRelative(resourcePath);
//                         if (resource.exists() && resource.isReadable()) {
//                             return resource;
//                         }
//                         return location.createRelative("index.html");
//                     }
//                 });
//     }
// }

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        // Если это реальный файл (картинка, скрипт) — отдаем его
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        // В противном случае (для путей Angular типа /login) отдаем index.html
                        return location.createRelative("index.html");
                    }
                });
    }
}