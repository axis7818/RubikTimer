INSERT INTO Person (
    id, firstName, lastName, email,
    password, whenRegistered, role
) VALUES (
    1, "admin", "admin", "admin@admin.com",
    "password", NOW(), 1
);
