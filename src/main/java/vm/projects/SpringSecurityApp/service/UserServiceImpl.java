package vm.projects.SpringSecurityApp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vm.projects.SpringSecurityApp.model.Role;
import vm.projects.SpringSecurityApp.model.User;
import vm.projects.SpringSecurityApp.repository.RoleRepository;
import vm.projects.SpringSecurityApp.repository.UserRepository;

import javax.transaction.Transactional;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository
            , RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll()
                .stream()
                .sorted(Comparator.comparingLong(User::getId))
                .collect(Collectors.toList());
    }

    @Override
    public User findById(long id) {
        return userRepository.findById(id).get();
    }

    @Override
    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> roleSet = new HashSet<>();
        roleSet.add(roleService.getById(1L));
        user.setRoles(roleSet);
        userRepository.save(user);
    }

    @Override
    public void updateUser(User user, Long id) {
        User updateUser = userRepository.findById(id).get();
        updateUser.setFirstName(user.getFirstName());
        updateUser.setLastName(user.getLastName());
        updateUser.setAge(user.getAge());
        updateUser.setRoles(user.getRoles());
        userRepository.save(updateUser);
    }


    @Override
    public void deleteById(long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findByName(String name) {
        return userRepository.findByFirstName(name).orElse(new User());
    }

    @Override
    public User getAuthUser() {
        return userRepository.findByFirstName(SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName()).orElse(new User());
    }
}
