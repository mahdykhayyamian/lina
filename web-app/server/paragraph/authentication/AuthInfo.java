package lina.board.athentication;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthInfo {
	String email;
	String name;
}
