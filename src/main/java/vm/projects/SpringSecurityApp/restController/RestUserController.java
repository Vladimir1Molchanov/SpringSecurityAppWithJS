package vm.projects.SpringSecurityApp.restController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vm.projects.SpringSecurityApp.model.User;
import vm.projects.SpringSecurityApp.service.UserService;

@RestController
@RequestMapping("api/user")
public class RestUserController {

    private final UserService userService;

    public RestUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public User getAuthUser(){
        return userService.getAuthUser();
    }
}
