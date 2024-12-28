# Micro Instagram Backend📱

## Environment Variable setup ⚙️ 🤖

```

PORT = 8080

DB_HOST = localhost
DB_USER = root
DB_PASSWORD = <password>
DB_NAME = micro_instagram

CLOUDINARY_CLOUD_NAME=dzqhr1ymt
CLOUDINARY_API_KEY=457153132365814
CLOUDINARY_API_SECRET=-hglSa7Lu5ADhfTlA-Gl6u5adEM

```

## MySQL Setup

1. Create a database with DB_NAME

2. Run the following query to add two tables:

```
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        mobileNumber BIGINT NOT NULL UNIQUE,
        address TEXT,
        postCount INT DEFAULT 0
    );

    CREATE TABLE posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        images JSON,
        userId INT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

```
## Installation ⬇️ 🕹️

Here are the steps you need to follow to install the dependencies.

1. clone the repository.

```
git clone https://github.com/ankur020/Micro-Insta
```

2. After that **cd** into the directory then run this command to install all the dependencies

```
npm install
```
or

```
yarn install
```

3. Now run this command to start the developement server

```
npm run dev
```

or 

```
yarn dev
```
