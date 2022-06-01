package vm.projects.SpringSecurityApp.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import vm.projects.SpringSecurityApp.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByFirstName(String name);

    @Override
    @EntityGraph(attributePaths = {"roles"})
    List<User> findAll();
}
