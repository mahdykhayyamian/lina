package lina.board.athentication;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import java.util.Collections;
import com.google.api.client.json.jackson2.JacksonFactory;
import java.security.GeneralSecurityException;
import java.io.IOException;
import lombok.Builder;
import lombok.Data;

// Based on https://developers.google.com/identity/sign-in/web/backend-auth
public class GoogleAuthHelper {

	public static String CLIENT_ID = "737742406146-ctvhpef0pmjin27075a9vhsfb0pre821.apps.googleusercontent.com";

	public static ParsedGoogleToken validateGoogleToken(String idTokenString)  {
		System.out.println("in validateGoogleToken...");
		try {
			GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
				.setAudience(Collections.singletonList(CLIENT_ID))
				.build();

			GoogleIdToken idToken = verifier.verify(idTokenString);
			if (idToken != null) {
				Payload payload = idToken.getPayload();

				// Print user identifier
				String userId = payload.getSubject();
				System.out.println("User ID: " + userId);

				// Get profile information from payload
				String email = payload.getEmail();
				System.out.println("email: " + email);

				boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
				String name = (String) payload.get("name");
				String pictureUrl = (String) payload.get("picture");
				String locale = (String) payload.get("locale");
				String familyName = (String) payload.get("family_name");
				String givenName = (String) payload.get("given_name");
				
				System.out.println("validated token successfully");

				 ParsedGoogleToken token = ParsedGoogleToken.builder()
					.userId(userId)
					.email(email)
					.name(name)
					.pictureUrl(pictureUrl)
					.locale(locale)
					.familyName(familyName)
					.givenName(givenName)
				.build();

				System.out.println(token);

				return token;

			} else {
			  System.out.println("Invalid ID token.");
			  return null;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}

@Data
@Builder
class ParsedGoogleToken {
	String userId;
	String email;
	String name;
	String pictureUrl;
	String locale;
	String familyName;
	String givenName;
}