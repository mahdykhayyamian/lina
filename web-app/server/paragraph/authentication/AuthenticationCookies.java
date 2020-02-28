package lina.board.athentication;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AuthenticationCookies {
	String authType;
	String authToken;
}