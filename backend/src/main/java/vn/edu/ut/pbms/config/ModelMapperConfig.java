package vn.edu.ut.pbms.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        // Skip null values when mapping
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        return modelMapper;
    }
}
