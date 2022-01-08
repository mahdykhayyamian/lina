package lina.demo.smartframes;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lina.climate.persistence.ClimateRepository;
import climate.model.DailyMeasure;
import java.util.List;
import com.google.gson.Gson;
import java.io.PrintWriter;

@WebServlet(urlPatterns = {"/climate/trends"})
public class ClimateTrendsPageServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public ClimateTrendsPageServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		RequestDispatcher RequetsDispatcherObj = null;

		if(request.getHeader("User-Agent").contains("Mobi")) {
			RequetsDispatcherObj = request.getRequestDispatcher("/src/climate/climateTrends.mobile.jsp");
		} else {
			RequetsDispatcherObj = request.getRequestDispatcher("/src/climate/climateTrends.desktop.jsp");
		}

		RequetsDispatcherObj.forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
}
