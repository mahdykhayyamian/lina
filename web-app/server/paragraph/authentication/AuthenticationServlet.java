package lina.board.athentication;

import java.io.IOException;
import java.util.Map;
import java.util.Base64;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Cookie;

import java.util.stream.Collectors;
import com.google.gson.Gson;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import lina.board.athentication.AuthenticationUtils;
import lina.board.athentication.GoogleAuthHelper;


@WebServlet("/paragraph/authenticate")
public class AuthenticationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public AuthenticationServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String userName = request.getParameter("userName");
		System.out.println("userName : " + userName);

		String googleAuthToken = request.getParameter("googleAuthToken");
		System.out.println("googleAuthToken : " + googleAuthToken);

		if (authenticate(userName, googleAuthToken)) {

			System.out.println("authenticated, going to set cookies");

			if (googleAuthToken != null) {

				Cookie authTypeCookie = new Cookie("auth-type", "googleAuth");
				authTypeCookie.setMaxAge(60*60); //1 hour
				authTypeCookie.setPath("/");
				response.addCookie(authTypeCookie);

				Cookie authTokenCookie = new Cookie("auth-token", googleAuthToken);
				authTokenCookie.setMaxAge(60*60); //1 hour
				authTokenCookie.setPath("/");
				response.addCookie(authTokenCookie);

				Cookie userNameCookie = new Cookie("user-name", userName);
				userNameCookie.setMaxAge(60*60); //1 hour
				userNameCookie.setPath("/");
				response.addCookie(userNameCookie);
			}

			String fromEncoded = getFrom(request);

			if (fromEncoded != null) {
				byte[] decodedURLBytes = Base64.getUrlDecoder().decode(fromEncoded);
				String redirectURL= new String(decodedURLBytes);
				System.out.println("redirect url : " + redirectURL);
				response.sendRedirect(redirectURL);
			} else {
				response.sendRedirect("/paragraph");
			}
		} else {
			System.out.println("could not authenticate!");
		}
	}

	private boolean authenticate(String userName, String googleAuthToken) {
		if (googleAuthToken != null) {
			ParsedGoogleToken parsedGoogleToken = GoogleAuthHelper.validateGoogleToken(googleAuthToken);
			if (parsedGoogleToken != null) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	}

	private String jwtToken(String userName) {
		String jws = Jwts.builder().setSubject(userName).signWith(AuthenticationUtils.KEY).compact();
		return jws;
	}

	private String getFrom(HttpServletRequest request) {
		Map<String, String[]> parmMap = request.getParameterMap();
		if (parmMap.get("from") != null && parmMap.get("from").length > 0) {
			String roomNumber = parmMap.get("from")[0];
			return roomNumber;
		}
		return null;
	}
}