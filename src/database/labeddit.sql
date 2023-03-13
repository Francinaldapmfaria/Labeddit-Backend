-- Active: 1678569222431@@127.0.0.1@3306

CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

DROP TABLE users;


SELECT * FROM users;

INSERT INTO users(id, name, email, password, role)
VALUES
("a001","Lua", "luazinha@email.com", "155445", "adm"),
("a002", "Linda", "lindinha@email.com", "454544", "usuário");

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    comments INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE 
);
DROP TABLE posts;

INSERT INTO posts (id, creator_id, content)
VALUES
("p001", "81b25fb9-46a6-4d46-808e-7a0e194506aa","Meu primeiro dia de trabalho");


SELECT*FROM posts;

SELECT  
    posts.id ,
    posts.creator_id ,
    posts.content ,
    posts.likes,
    posts.dislikes,
    posts.created_at,
    posts.updated_at,
    users.name As creator_name

FROM posts
JOIN users
ON posts.creator_id = users.id;

UPDATE posts 
SET likes = 1
WHERE id = "p002";


CREATE TABLE likes_dislikes_posts(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

DROP TABLE likes_dislikes_posts;

INSERT INTO likes_dislikes_posts(user_id, post_id, like )
VALUES 
("a002", "p001",0), 
("a001", "p002", 1); 

SELECT * FROM likes_dislikes_posts;

CREATE TABLE comments(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
     FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

DROP TABLE comments;

SELECT * FROM comments;

CREATE TABLE likes_dislikes_comments (
    user_id TEXT NOT NULL,
    comments_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (comments_id) REFERENCES comments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

SELECT * FROM likes_dislikes_comments;

DROP TABLE likes_dislikes_comments;