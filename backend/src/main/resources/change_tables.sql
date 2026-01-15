ALTER TABLE agent_update_systems
    MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE agent_updates
    MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE agent_update_files
    MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;



--------------------


ALTER TABLE user_mst
    MODIFY username VARCHAR(100) NOT NULL,
    MODIFY email VARCHAR(150) NOT NULL;

ALTER TABLE user_mst
    ADD CONSTRAINT uk_user_username UNIQUE (username),
ADD CONSTRAINT uk_user_email UNIQUE (email);