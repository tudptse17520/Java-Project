package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.SystemConfig;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Integer> {

    Optional<SystemConfig> findByConfigKey(String configKey);

    @Query("SELECT c FROM SystemConfig c WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(c.configKey) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<SystemConfig> searchByKeyword(@Param("keyword") String keyword);
}
