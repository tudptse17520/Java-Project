package vn.edu.ut.pbms.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        // Cấu hình nâng cao cho ModelMapper giúp ánh xạ DTO chính xác
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT) 
                .setFieldMatchingEnabled(true)                 
                .setSkipNullEnabled(true);                      
                
        return modelMapper;
    }
}