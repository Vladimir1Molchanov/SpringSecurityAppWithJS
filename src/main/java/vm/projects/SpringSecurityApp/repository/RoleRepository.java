package vm.projects.SpringSecurityApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vm.projects.SpringSecurityApp.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
}