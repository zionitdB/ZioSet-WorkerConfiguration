package com.ZioSet_WorkerConfiguration.utils.scriptsecurity;

import com.ZioSet_WorkerConfiguration.model.ScriptDependencyEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptFileEntity;
import com.ZioSet_WorkerConfiguration.service.ScriptFileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.PrivateKey;
import java.security.Signature;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApprovalDigestService {

    private final ScriptFileService blobReadService;
    private final SigningKeyProvider signingKeyProvider;

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);

    public SignedApproval buildAndSign(ScriptEntity script, List<ScriptDependencyEntity> deps) {

        byte[] entryBytes;

        if (script.getScriptText() != null && !script.getScriptText().isEmpty() && !script.getScriptText().isBlank()) {
            //TODO("Use CryptoUtils.canonicalizeInline method before saving the actual script")
            entryBytes = CryptoUtils.canonicalizeInline(script.getScriptText());
        } else {
            ScriptFileEntity file = script.getScriptFile();
            byte[] blobBytes = blobReadService.download(file.getStorageKey());

            // verify against DB sha512
            String computed = CryptoUtils.sha512(blobBytes);
            if (!computed.equalsIgnoreCase("sha512:" + file.getSha512())) {
                throw new IllegalStateException("Main file hash mismatch (Blob tampered or db hash changed)");
            }
            entryBytes = blobBytes;
        }

        String entryHash = CryptoUtils.sha512(entryBytes);

        List<String> depHashes = new ArrayList<>();

        for (ScriptDependencyEntity dep : deps) {
            ScriptFileEntity f = dep.getScriptFile();
            byte[] depBytes = blobReadService.download(f.getStorageKey());

            String computed = CryptoUtils.sha512(depBytes);
            if (!computed.equalsIgnoreCase("sha512:" + f.getSha512())) {
                throw new IllegalStateException(
                        "Dependency hash mismatch: " + f.getFilename()
                );
            }
            depHashes.add(computed);
        }
        Map<String, String> canonicalArgs =
                CryptoUtils.canonicalizeArgs(script.getScriptArgument());
        //TODO("Use CryptoUtils.canonicalizeArgs method before saving the actual script")
        ApprovalDigest digest = new ApprovalDigest(
                1,
                script.getScriptId(),
                script.getScriptType().name(),
                entryHash,
                depHashes,
                canonicalArgs,
                List.of(script.getTargetPlatformsCsv().split(","))
        );

        try {
            String digestJson = mapper.writeValueAsString(digest);

            PrivateKey privateKey = signingKeyProvider.getPrivateKey();
            Signature sig = Signature.getInstance("Ed25519");
            sig.initSign(privateKey);
            sig.update(digestJson.getBytes(StandardCharsets.UTF_8));
            byte[] signature = sig.sign();

            return new SignedApproval(
                    digestJson,
                    Base64.getEncoder().encodeToString(signature)
            );
        } catch (Exception e) {
            throw new RuntimeException("Approval signing failed", e);
        }
    }
}
