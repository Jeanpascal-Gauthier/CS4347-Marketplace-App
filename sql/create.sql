CREATE DATABASE IF NOT EXISTS shopbase;
USE shopbase;

CREATE TABLE `User` (
    user_id    INT          NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(50)  NOT NULL,
    last_name  VARCHAR(50)  NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    address    VARCHAR(255) DEFAULT NULL,
    reg_date   DATE         NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (user_id)
);

CREATE TABLE Buyer (
    user_id          INT          NOT NULL,
    dft_payment      VARCHAR(50)  DEFAULT NULL,
    dft_shipping_addr VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES `User`(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Seller (
    user_id       INT          NOT NULL,
    business_name VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES `User`(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Category (
    category_id INT         NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (category_id)
);

CREATE TABLE Listing (
    listing_id  INT           NOT NULL AUTO_INCREMENT,
    seller_id   INT           NOT NULL,
    title       VARCHAR(100)  NOT NULL,
    description TEXT          DEFAULT NULL,
    price       DECIMAL(10,2) NOT NULL,
    quantity    INT           NOT NULL DEFAULT 1,
    `condition` VARCHAR(30)   NOT NULL DEFAULT 'Used',
    image_url   VARCHAR(255)  DEFAULT NULL,
    date_posted DATE          NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (listing_id),
    FOREIGN KEY (seller_id) REFERENCES Seller(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Belongs_To (
    listing_id  INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (listing_id, category_id),
    FOREIGN KEY (listing_id)  REFERENCES Listing(listing_id)  ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE
);

CREATE TABLE `Order` (
    order_id     INT           NOT NULL AUTO_INCREMENT,
    buyer_id     INT           NOT NULL,
    listing_id   INT           NOT NULL,
    total_price  DECIMAL(10,2) NOT NULL,
    quantity     INT           NOT NULL DEFAULT 1,
    status       VARCHAR(20)   NOT NULL DEFAULT 'Pending',
    shipping_addr VARCHAR(255) NOT NULL,
    payment_info VARCHAR(100)  NOT NULL,
    order_date   DATE          NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (order_id),
    FOREIGN KEY (buyer_id)   REFERENCES Buyer(user_id)     ON DELETE NO ACTION,
    FOREIGN KEY (listing_id) REFERENCES Listing(listing_id) ON DELETE NO ACTION
);

CREATE TABLE Review (
    review_id   INT      NOT NULL AUTO_INCREMENT,
    order_id    INT      NOT NULL,
    reviewer_id INT      NOT NULL,
    seller_id   INT      NOT NULL,
    rating      TINYINT  NOT NULL,
    comment     TEXT     DEFAULT NULL,
    review_date DATE     NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (review_id),
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (order_id)    REFERENCES `Order`(order_id)  ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES Buyer(user_id)     ON DELETE CASCADE,
    FOREIGN KEY (seller_id)   REFERENCES Seller(user_id)    ON DELETE CASCADE
);
