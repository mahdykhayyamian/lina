package paragraph.api;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.AllArgsConstructor;

import javax.servlet.ServletException;
import java.io.BufferedReader;
import com.google.gson.Gson;
import lombok.Data;
import lina.paragraph.model.Board;
import lina.paragraph.persistence.BoardRepository;
import lina.board.utils.ServletUtils;
import lina.board.athentication.AuthenticationUtils;
import lina.board.athentication.AuthenticationCookies;
import java.util.Properties;
import javax.mail.Session;
import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Message;
import javax.mail.internet.MimeBodyPart;
import javax.mail.Transport;
import javax.mail.Multipart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.InternetAddress;
import javax.mail.BodyPart;
import javax.mail.util.ByteArrayDataSource; 
import javax.activation.DataHandler;
import java.util.Base64;
import lina.board.athentication.AuthInfo;


@WebServlet("/api/addFeedback")
public class AddFeedbackServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AddFeedbackServlet() {
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

		AuthInfo authInfo = null;
		try {
			AuthenticationCookies authCookies = AuthenticationUtils.getAuthCookies(request);
			authInfo = AuthenticationUtils.authenticate(authCookies);
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}

		if (authInfo == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		try {
			String data = ServletUtils.getPostBody(request);
			System.out.println(data);

			Gson gson = new Gson();
			FeedbackPayload payload = gson.fromJson(data, FeedbackPayload.class);

			Properties prop = new Properties();
			prop.put("mail.smtp.auth", true);
			prop.put("mail.smtp.starttls.enable", "true");
			prop.put("mail.smtp.host", "smtp.gmail.com");
			prop.put("mail.smtp.port", "25");
			prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");

			Session session = Session.getInstance(prop, new Authenticator() {
				@Override
				protected PasswordAuthentication getPasswordAuthentication() {
					return new PasswordAuthentication("feedback@lina.run", "5@lamLinaFeedback");
				}
			});

			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress("feedback@lina.run"));
			message.setRecipients(
				Message.RecipientType.TO, InternetAddress.parse("feedback@lina.run"));
			message.setSubject(payload.title);

			Multipart multipart = new MimeMultipart();
			 
			// feedback detail
			String msg = payload.detail;
			MimeBodyPart mimeBodyPart = new MimeBodyPart();
			mimeBodyPart.setContent(msg, "text/html");
			multipart.addBodyPart(mimeBodyPart);
			 
			// screenshot attachment
			String base64 = payload.screenshotImg.split(",")[1];
			byte[] rawImage = Base64.getDecoder().decode(base64);
			BodyPart imagePart = new MimeBodyPart();
			ByteArrayDataSource imageDataSource = new ByteArrayDataSource(rawImage,"image/png");
			imagePart.setDataHandler(new DataHandler(imageDataSource));
			imagePart.setHeader("Content-ID", "<qrImage>");
			imagePart.setFileName("Screenshot.png");
			multipart.addBodyPart(imagePart);

			message.setContent(multipart);
			Transport.send(message);

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}
}


@Data
@AllArgsConstructor
class FeedbackPayload {
   String title;
   String detail;
   String screenshotImg;
}

