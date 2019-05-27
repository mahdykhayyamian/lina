package lina.board.athentication;

import java.io.IOException;
import java.util.Map;
import java.util.PriorityQueue;

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
import io.jsonwebtoken.security.Keys;
import java.security.Key;

/**
 * Servlet implementation class HomeServlet
 */
@WebServlet("/whiteboard/authenticate")
public class AuthenticateServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public static final Key KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    /**
     * @see HttpServlet#HttpServlet()
     */
    public AuthenticateServlet() {
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

		String remoteAddress = request.getRemoteAddr() ;
		System.out.println("remote address : " + remoteAddress);

		String userAgent = request.getHeader("User-Agent");
		System.out.println("userAgent : " + userAgent);

		String userName = request.getParameter("userName");
		System.out.println(userName);

		if (authenticate(userName)) {
			String jwtToken = jwtToken(userName);
			System.out.println("jwt token : " + jwtToken);

			Cookie userNameCookie = new Cookie("user-name", userName);
			userNameCookie.setMaxAge(60*60); //1 hour
			response.addCookie(userNameCookie);

			Cookie jwtTokenCookie = new Cookie("lina-token", jwtToken);
			jwtTokenCookie.setMaxAge(60*60); //1 hour
			response.addCookie(jwtTokenCookie);

			response.sendRedirect("/whiteboard");
		}
	}

	private boolean authenticate(String userName) {
		//TODO actually implement authentication
		return true;
	}

	private String jwtToken(String userName) {
		String jws = Jwts.builder().setSubject(userName).signWith(KEY).compact();
		return jws;
	}
}