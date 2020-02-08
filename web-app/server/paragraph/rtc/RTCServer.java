import java.io.IOException;

import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.OnError;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.Set;
import java.util.Collections;
import java.util.HashSet;

@ServerEndpoint("/broadcast")
public class RTCServer {

    private static Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());

    @OnMessage
    public void onMessage(Session session, String msg) {
        System.out.println("got message : " + msg);
        System.out.println("peers size" + peers.size());

        try {
            for (Session peer : peers) {
                if (!peer.equals(session)) {
                    peer.getBasicRemote().sendText(msg);
                }
            }
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @OnOpen
    public void open(Session session, EndpointConfig conf) {

        System.out.println(session.getId() + " has opened a connection");
        peers.add(session);
    }

    @OnClose
    public void onClose(Session session){
        System.out.println("Session " +session.getId()+" has ended");
        peers.remove(session);
    }

    @OnError
    public void error(Session session, Throwable t) {
        System.out.println(t);
        peers.remove(session);
    }

}