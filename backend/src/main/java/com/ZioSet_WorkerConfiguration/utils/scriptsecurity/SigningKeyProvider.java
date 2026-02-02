package com.ZioSet_WorkerConfiguration.utils.scriptsecurity;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

@Getter
@Component
public class SigningKeyProvider {

    private final PrivateKey privateKey;

    public SigningKeyProvider(
            @Value("${script.signing.private-key-path}") String keyPath
    ) {
        this.privateKey = loadPemPrivateKey(keyPath);
    }

    private PrivateKey loadPemPrivateKey(String path) {
        try {
            String pem = Files.readString(Path.of(path), StandardCharsets.UTF_8);

            // Remove PEM armor
            pem = pem
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replaceAll("\\s", "");

            byte[] der = Base64.getDecoder().decode(pem);

            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(der);
            return KeyFactory.getInstance("Ed25519").generatePrivate(spec);

        } catch (Exception e) {
            throw new RuntimeException("Failed to load signing key", e);
        }
    }
}

