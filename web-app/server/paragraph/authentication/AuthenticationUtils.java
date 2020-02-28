package lina.board.athentication;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Cookie;
import io.jsonwebtoken.Jwts;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.RequestDispatcher;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import lina.board.athentication.GoogleAuthHelper;
import lina.board.athentication.ParsedGoogleToken;
import lina.board.athentication.AuthenticationCookies;
import lina.board.athentication.AuthenticationUtils;
import javax.websocket.server.HandshakeRequest;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

public class AuthenticationUtils {

	public static AuthenticationCookies getAuthCookies(ServletRequest request) {

		Cookie[] cookies = ((HttpServletRequest)request).getCookies();

		String authType = null;
		String authToken = null;

		if (cookies != null) {
			for (Cookie cookie : cookies) {
				System.out.println(cookie.getName() + " : " + cookie.getValue());

				if (cookie.getName().equals("auth-type")) {
					authType = cookie.getValue();
				}

				if (cookie.getName().equals("auth-token")) {
					authToken = cookie.getValue();
				}
			}
		}

		return AuthenticationCookies.builder().authType(authType).authToken(authToken).build();
	}

	public static AuthenticationCookies getAuthCookies(HandshakeRequest req) {
		Map<String,List<String>> headers = req.getHeaders();
		Map<String, String> cookies = AuthenticationUtils.parseCookies(headers.get("cookie").get(0));

		String authType = cookies.get("auth-type");
		String authToken = cookies.get("auth-token");

		return AuthenticationCookies.builder().authType(authType).authToken(authToken).build();
	}

	public static boolean authenticate(AuthenticationCookies authCookies) {
		System.out.println("authenticating...");

		String authType = authCookies.authType;
		String authToken = authCookies.authToken;

		if (authType == null || authToken == null) {
			System.out.println("authType or authToken not provided, auth failed.");
			return false;
		}

		if (authType.equals("googleAuth")) {
			ParsedGoogleToken parsedGoogleToken = GoogleAuthHelper.validateGoogleToken(authToken);
			if (parsedGoogleToken != null) {
				return true;
			} else {
				return false;
			}
		}

		return false;
	}

	public static Cookie getCookie(HttpServletRequest request, String name) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(name)) {
					return cookie;
				}
			}
		}
		return null;
	}

	public static void deleteCookie(HttpServletRequest request, HttpServletResponse response, String name) {
		Cookie cookie = getCookie(request, name);
		cookie.setValue("");
		cookie.setMaxAge(0);
		cookie.setPath("/");
		response.addCookie(cookie);
	}

	public static Map<String, String> parseCookies(String rawCookie) {
		Map<String, String> cookiesMap = new HashMap<String, String>();

		String[] rawCookieParams = rawCookie.split(";");
		for(String rawCookieNameAndValue :rawCookieParams)	{
			String[] rawCookieNameAndValuePair = rawCookieNameAndValue.split("=");
			cookiesMap.put(rawCookieNameAndValuePair[0].trim(), rawCookieNameAndValuePair[1].trim());
		}

		return cookiesMap;
	}
}
