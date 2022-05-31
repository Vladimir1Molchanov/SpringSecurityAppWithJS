package vm.projects.SpringSecurityApp.service;

import vm.projects.SpringSecurityApp.model.User;

import java.util.List;

public interface UserService {
    List<User> findAll();

    User findById(long id);

    void saveUser(User user);

    User findByName(String name);

    void updateUser(User user, Long id);

    void deleteById(long id);
}
