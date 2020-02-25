package lina.board.athentication;

import lombok.Builder;

@Builder
public class AuthenticationCookies {
	String authType;
	String authToken;
}