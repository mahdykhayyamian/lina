package whiteboard.api;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.servlet.ServletException;
import java.io.BufferedReader;
import com.google.gson.Gson;
import lombok.Data;
import lina.whiteboard.persistence.ContentTypeRepository;
import java.util.List;
import lina.whiteboard.model.ContentType;
import com.google.gson.Gson;
import java.io.PrintWriter;
import lina.board.athentication.AuthenticationUtils;

@WebServlet("/api/getContentTypes")
public class GetContentTypesServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetContentTypesServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("Inside getting content types...");

		boolean authenticated = false;
		try {
			authenticated = AuthenticationUtils.authenticated(request, response);
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}

        if (!authenticated) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            List<ContentType> contentTypes = ContentTypeRepository.getContentTypes();
            Gson gson = new Gson();
            String jsonPayload = gson.toJson(contentTypes);
            System.out.println("json payload");
            System.out.println(jsonPayload);

            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            out.print(jsonPayload);
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {}
}