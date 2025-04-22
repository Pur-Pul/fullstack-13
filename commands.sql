CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);
INSERT INTO blogs (author, url, title, likes) VALUES ('Author1', 'www.blog.com', 'Blog1', 5);
INSERT INTO blogs (url, title) VALUES ('www.blog2.com', 'Blog2');