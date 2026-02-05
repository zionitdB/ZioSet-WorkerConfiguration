package com.ZioSet_WorkerConfiguration.utils.scriptsecurity;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.Map;

public final class CryptoUtils {

    private CryptoUtils() {}

    public static byte[] canonicalizeInline(String text) {
        String normalized = text
                .replace("\r\n", "\n")
                .replace("\r", "\n")
                .stripTrailing() + "\n";
        return normalized.getBytes(StandardCharsets.UTF_8);
    }

    public static Map<String, String> canonicalizeArgs(Map<String, String> args) {
        return args == null
                ? Map.of()
                : args.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(
                        LinkedHashMap::new,
                        (m, e) -> m.put(e.getKey(), e.getValue()),
                        Map::putAll
                );
    }


    public static String sha512(byte[] data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            byte[] hash = md.digest(data);

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));
            return "sha512:" + hex;
        } catch (Exception e) {
            throw new RuntimeException("SHA-512 failed", e);
        }
    }
}
