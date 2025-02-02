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

import lina.board.athentication.AuthenticationUtils;
import lina.board.athentication.GoogleAuthHelper;

import lina.board.athentication.ParsedGoogleToken;


@WebServlet("/authenticate")
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

		String googleAuthToken = request.getParameter("googleAuthToken");
		ParsedGoogleToken parsedGoogleToken = authenticate(googleAuthToken);

		if (parsedGoogleToken != null) {
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

				Cookie emailCookie = new Cookie("email", parsedGoogleToken.email);
				emailCookie.setMaxAge(60*60); //1 hour
				emailCookie.setPath("/");
				response.addCookie(emailCookie);

				Cookie userNameCookie = new Cookie("given-name", parsedGoogleToken.givenName);
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

	private ParsedGoogleToken authenticate(String googleAuthToken) {
		if (googleAuthToken != null) {
			ParsedGoogleToken parsedGoogleToken = GoogleAuthHelper.validateGoogleToken(googleAuthToken);
			return parsedGoogleToken;
		}
		return null;
	}

	private String getFrom(HttpServletRequest request) {
		Map<String, String[]> parmMap = request.getParameterMap();
		if (parmMap.get("from") != null && parmMap.get("from").length > 0) {
			String roomId = parmMap.get("from")[0];
			return roomId;
		}
		return null;
	}
}