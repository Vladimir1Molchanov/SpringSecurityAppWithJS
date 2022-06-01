package vm.projects.SpringSecurityApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "roles")
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "roleName")
    private String roleName;

    @JsonIgnore
    @Column(name = "users")
    @ManyToMany(targetEntity = User.class
            , mappedBy = "roles"
            , fetch = FetchType.LAZY)
    private List<User> users;

    public Role(String roleName) {
        this.roleName = roleName;
    }
    
    @Override
    public String getAuthority() {
        return getRoleName();
    }

    @Override
    public String toString(){
        return "[id : " + getId() + ", roleName : " + getRoleName() + "]";
    }
}
