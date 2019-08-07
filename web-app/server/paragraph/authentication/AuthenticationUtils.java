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
import java.security.Key;
import io.jsonwebtoken.SignatureAlgorithm;

public class AuthenticationUtils {

	public static final Key KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

	public static boolean authenticated(ServletRequest request, ServletResponse response) {
		System.out.println("authenticating...");
		Cookie[] cookies = ((HttpServletRequest)request).getCookies();

		String jwtToken = null;
		String userName = null;

		if (cookies != null) {
			for (Cookie cookie : cookies) {
				System.out.println(cookie.getName() + " : " + cookie.getValue());

				if (cookie.getName().equals("user-name")) {
					userName = cookie.getValue();
				}

				if (cookie.getName().equals("lina-token")) {
					jwtToken = cookie.getValue();
				}
			}

			if (userName == null || jwtToken == null) {
				System.out.println("userName or jwtToken not provided, auth failed.");
				return false;
			}

			if (Jwts.parser().setSigningKey(KEY).parseClaimsJws(jwtToken).getBody().getSubject().equals(userName)) {
				System.out.println("authentication successfull.");
				return true;
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
		cookie.setValue(null);
		cookie.setMaxAge(0);
		cookie.setPath(cookie.getPath());
		response.addCookie(cookie);
	}

}